package rhsp.opcofin;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.NavigableMap;
import java.util.TreeMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class WebhookPush {

    private final Logger logger = LoggerFactory.getLogger(WebhookPush.class);

    @Value("${webhook.endpoint}")
    private String endpoint;

    @Value("${webhook.state}")
    private String state;

    @Value("${subsidiaries.overalls}")
    private Integer subsidiaryId;

    private final String CONFIG_KEY = "config.json";
    private final String CONFIG_PROP_TXN_DATE = "transactionDate";
    private final String CONFIG_PROP_HASH = "hashUpdatedTimestamps";

    private final SnowflakeService snowflakeService;
    private final GetSecretValue getSecretValue;
    private final GetObjectValue getObjectValue;
    private final ObjectMapper objectMapper;

    @Autowired
    public WebhookPush(SnowflakeService snowflakeService, GetSecretValue getSecretValue, 
        GetObjectValue getObjectValue, ObjectMapper objectMapper) {
        this.snowflakeService = snowflakeService;
        this.getSecretValue = getSecretValue;
        this.getObjectValue = getObjectValue;
        this.objectMapper = objectMapper;
    }

    @Scheduled(fixedDelay = 60000, initialDelay = 3000)
    public void pushLatestDayStateful() {
        var configState = fetchStateFromS3();
        var transactionDatesFromS3 = getTransactionDatesFromS3(configState);
        var transactionDatesFromDb = getTransactionDatesFromDb();
        var transactionDateToPush = getEarliestDateUnmatched(transactionDatesFromS3, transactionDatesFromDb);

        if (transactionDateToPush == null) {
            logger.info("No transaction dates greater than or equal to " + transactionDateToPush);
            return;
        }

        var pushCutoff = LocalDate.now().minusDays(2);
        if (transactionDateToPush.isAfter(pushCutoff)) {
            logger.info(transactionDateToPush + " is after the cutoff " + pushCutoff);
            return;
        }

        var transactionsNode = Mono.just(snowflakeService.queryTransactionsOn(subsidiaryId, transactionDateToPush))
            .flatMap(snowflakeService::simpleQuery)
            .map(snowflakeService::makeArrayOfRealObjects)
            .block();
        
        var transactionsArray = (ArrayNode) transactionsNode;
        logger.info("date " + transactionDateToPush + ", transactions.size() = " + transactionsArray.size());
        var json = transactionsArray.toPrettyString();

        var webClient = WebClient.create();
        Mono<JsonNode> mono = webClient.post()
                .uri(resolveEndpoint())
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(json)
                .retrieve()
                .bodyToMono(JsonNode.class);
        var responseJson = mono.block();
        logger.debug(responseJson.toPrettyString());
        var key = DateTimeFormatter.ISO_LOCAL_DATE.format(transactionDateToPush); 
        var val = transactionDatesFromDb.get(transactionDateToPush);
        configState.put(key, val);
        pushStateToS3(configState);
        return;
    }

    private LocalDate getEarliestDateUnmatched(NavigableMap<LocalDate,Long> s3, NavigableMap<LocalDate,Long> db) {
        var dbDates = db.keySet();
        for (var date : dbDates) {
            if (!s3.containsKey(date)) {
                return date;
            }
            if (!s3.get(date).equals(db.get(date))) {
                return date;
            }
        }
        return null;
    }

    private NavigableMap<LocalDate,Long> getTransactionDatesFromDb() {
        var json = Mono.just(snowflakeService.queryTransactionDates(subsidiaryId))
            .flatMap(snowflakeService::simpleQuery)
            .map(snowflakeService::makeArrayOfRealObjects)
            .block();
        
        NavigableMap<LocalDate,Long> transactionDatesFromDb = new TreeMap<>();
        json.forEach(element -> 
            transactionDatesFromDb.put(
                LocalDate.parse(element.get(CONFIG_PROP_TXN_DATE).asText(), DateTimeFormatter.ISO_LOCAL_DATE),
                element.get(CONFIG_PROP_HASH).asLong()
        ));
        return transactionDatesFromDb;
    }

    private NavigableMap<LocalDate,Long> getTransactionDatesFromS3(Map<String,Object> state) {
        NavigableMap<LocalDate,Long> transactionDatesFromS3 = new TreeMap<>();
        state.forEach((k,v) ->
            transactionDatesFromS3.put(
                LocalDate.parse(k, DateTimeFormatter.ISO_LOCAL_DATE),
                Long.parseLong(v.toString())
        ));
        return transactionDatesFromS3;
    }

    private String resolveEndpoint() {
        if (endpoint.startsWith("arn:")) {
            return getSecretValue.request(endpoint);
        }
        return endpoint;
    }

    private Map<String,Object> fetchStateFromS3() {
        try {
            byte[] bytes = getObjectValue.request(state, CONFIG_KEY);
            var node = objectMapper.readTree(bytes);
            var map = objectMapper.convertValue(node, new TypeReference<Map<String,Object>>() {});
            return map;
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private void pushStateToS3(Map<String,?> map) {
        try {
            var jsonText = objectMapper.writeValueAsString(map);
            var jsonBytes = jsonText.getBytes("utf-8");
            getObjectValue.update(state, CONFIG_KEY, jsonBytes);
        }
        catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
