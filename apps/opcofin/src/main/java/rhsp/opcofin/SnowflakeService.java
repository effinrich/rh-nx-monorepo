package rhsp.opcofin;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.DoubleNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.LongNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.text.ParseException;

@Service
public class SnowflakeService {

    private final Logger logger = LoggerFactory.getLogger(SnowflakeService.class);

    private final RSAPublicKey snowflakeApiPublicKey;
    private final String snowflakeApiPublicKeyFingerprint;
    private final RSAPrivateKey snowflakeApiPrivateKey;
    private final WebClient webClient = WebClient.create();
    private final ObjectMapper objectMapper;

    private final String DATABASE = "SERVING";
    private final String SCHEMA = "FINANCE_REPORTS";

    @Value("${snowflake.account}")
    private String accountId;

    @Value("${snowflake.login}")
    private String userName;

    @Value("${snowflake.host}")
    private String apiHost;

    @Value("${snowflake.transaction-table}")
    private String transactionTable;

    @Autowired
    public SnowflakeService(RSAPublicKey snowflakeApiPublicKey, String snowflakeApiPublicKeyFingerprint,
                            RSAPrivateKey snowflakeApiPrivateKey,
                            ObjectMapper objectMapper) {
        this.snowflakeApiPublicKey = snowflakeApiPublicKey;
        this.snowflakeApiPublicKeyFingerprint = snowflakeApiPublicKeyFingerprint;
        this.snowflakeApiPrivateKey = snowflakeApiPrivateKey;
        this.objectMapper = objectMapper;
    }

    public record QueryParams(
            String schema,
            String database,
            String statement
    ) {}

    public record SnowflakeResponse(
            String code,
            String message,
            String sqlState,
            String statementHandle,
            Instant createdOn,
            String requestId,
            JsonNode data,
            JsonNode resultSetMetaData,
            String statementStatusUrl
    ) {
        public SnowflakeResponse(String code, String message, String sqlState, String statementHandle) {
            this(code, message, sqlState, statementHandle, null, null, null, null, null);
        }
    }

    public JsonNode makeArrayOfRealObjects(SnowflakeResponse rawData){
        var data = (ArrayNode) rawData.data();
        var newArrayNode = new ArrayNode(JsonNodeFactory.instance);
        data.forEach(innerArray -> {
            var castInnerArray = (ArrayNode) innerArray;
            var newObjectNode = new ObjectNode(JsonNodeFactory.instance);
            for(var i = 0; i < castInnerArray.size(); i++) {
                var rowType = (ArrayNode) rawData.resultSetMetaData().findPath("rowType");
                var dataType = rowType.get(i).findPath("type").asText();
                var dataScale = rowType.get(i).findPath("scale").asInt(-1);
                var name = dbStyleToCamelCase(rowType.get(i).findPath("name").asText());
                switch (dataType) {
                    case "boolean":
                        var booleanValue = castInnerArray.get(i).asBoolean();
                        newObjectNode.set(name, JsonNodeFactory.instance.booleanNode(booleanValue));
                        break;
                    case "date":
                        var days = castInnerArray.get(i).asInt();
                        var date = LocalDate.EPOCH.plus(days, ChronoUnit.DAYS);
                        var dateIso = DateTimeFormatter.ISO_LOCAL_DATE.format(date);
                        newObjectNode.set(name, new TextNode(dateIso));
                        break;
                    case "fixed":
                        if (dataScale > 0) {
                            var doubleValue = castInnerArray.get(i).asDouble();
                            newObjectNode.set(name, new DoubleNode(doubleValue));
                        }
                        else {
                            var longValue = castInnerArray.get(i).asLong();
                            newObjectNode.set(name, new LongNode(longValue));
                        }
                        break;
                    case "timestamp_ltz":
                        var tsValue = castInnerArray.get(i).asLong();
                        var timestamp = LocalDateTime.ofEpochSecond(tsValue, 0, ZoneOffset.UTC);
                        var timestampIso = DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(timestamp);
                        newObjectNode.set(name, new TextNode(timestampIso));
                        break;
                    default:
                        newObjectNode.set(name, castInnerArray.get(i));
                }
            }
            newArrayNode.add(newObjectNode);
          });
        return newArrayNode;
    }

    public String dbStyleToCamelCase(String columnName) {
        var words = columnName.split("_");
        var stringBuilder = new StringBuilder();
        for (int i=0; i<words.length; ++i) {
            words[i] = words[i].toLowerCase();
            if (i > 0) {
                var wordLen = words[i].length();
                var firstLetter = words[i].substring(0,1);
                var restOfWord = words[i].substring(1,wordLen);
                words[i] = firstLetter.toUpperCase() + restOfWord;
            }
            stringBuilder.append(words[i]);
        }
        return stringBuilder.toString();
    }

    public Mono<SnowflakeResponse> simpleQuery(QueryParams params) {
        return  webClient.post()
                .uri("https://" + apiHost + "/api/v2/statements")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + signJwt())
                .header("X-Snowflake-Authorization-Token-Type", "KEYPAIR_JWT")
                .bodyValue(params)
                .retrieve()
                .bodyToMono(SnowflakeResponse.class)
                .onErrorResume(WebClientResponseException.class, (e) -> {
                    Map<String, String> errorBody = null;
                    try {
                        errorBody = objectMapper.readValue(e.getResponseBodyAsString(), new TypeReference<Map<String,String>>() {});
                    } catch (JsonProcessingException ex) {
                        logger.error("Can't parse: " + e.getResponseBodyAsString(), ex);
                        errorBody = Map.of("message", e.getResponseBodyAsString());
                    }
                    var errorAsResponse = new SnowflakeResponse(
                        errorBody.get("code"), errorBody.get("message"), errorBody.get("sqlState"), errorBody.get("statementHandle"));
                    return Mono.just(errorAsResponse);
                });
    }

    public QueryParams queryTransactionsOn(Integer subsidiaryId, LocalDate date) {
        var query = "select *" +
                    " from " + transactionTable + 
                    " where SUBSIDIARY_ID = " + subsidiaryId + 
                    " and transaction_date = '" + date + " 00:00:00.000 +0000';";
        var snowflakeParams = new SnowflakeService.QueryParams(SCHEMA, DATABASE, query);
        return snowflakeParams;
    }

    public QueryParams queryTransactionDates(Integer subsidiaryId) {
        var query = "select transaction_date, hash_agg(updated_at) as hash_updated_timestamps" +
                    " from " + transactionTable + 
                    " where SUBSIDIARY_ID = " + subsidiaryId + 
                    " group by transaction_date" +
                    " order by transaction_date desc;";
        var snowflakeParams = new SnowflakeService.QueryParams(SCHEMA, DATABASE, query);
        return snowflakeParams; 
    }

    public String signJwt() {
        
        var now = Instant.now();
        String issuer = accountId + "." + userName + "." + snowflakeApiPublicKeyFingerprint;
        String subject = accountId + "." + userName;

        var header = new JWSHeader.Builder(JWSAlgorithm.RS256).build();
        var claims = new JWTClaimsSet.Builder()
            .issueTime(Date.from(now))
            .expirationTime(Date.from(now.plus(1, ChronoUnit.HOURS)))
            .issuer(issuer)
            .subject(subject)
            .build();

        var signedJwt = new SignedJWT(header, claims);
        try {
            signedJwt.sign(new RSASSASigner(snowflakeApiPrivateKey));
            return signedJwt.serialize();
        }
        catch (JOSEException e) {
            logger.error("Signing error", e);
            throw new RuntimeException(e);
        }

    }

    public boolean validateJwt(String jwt) {
        try {
            var parsedJwt = SignedJWT.parse(jwt);
            parsedJwt.verify(new RSASSAVerifier(snowflakeApiPublicKey));
            return true;
        }
        catch (JOSEException | IllegalStateException | ParseException e) {
            logger.info("Invalid JWT", e);
        }
        return false;
    }
}
