package rhsp.opcofin;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.databind.JsonNode;

import reactor.core.publisher.Mono;

// import java.util.Map;

@Profile("pull-api")
@RestController
@RequestMapping("/api/v1")
public class ApiV1Controller {

    @SuppressWarnings("unused")
    private final Logger logger = LoggerFactory.getLogger(ApiV1Controller.class);

    private final SnowflakeService snowflakeService;

    private final List<Integer> disallowedSubsidiaryIds;

    @Autowired
    public ApiV1Controller(SnowflakeService snowflakeService, List<Integer> disallowedSubsidiaryIds) {
        this.snowflakeService = snowflakeService;
        this.disallowedSubsidiaryIds = disallowedSubsidiaryIds;
    }

    public record JwtResponse(String jwt) {}

    @RequestMapping(
            method = RequestMethod.POST, path = "/jwt/create",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Mono<JwtResponse> createJwt() {
        return Mono
            .fromCallable(snowflakeService::signJwt)
            .map(JwtResponse::new);
    }


    @RequestMapping(
            method = RequestMethod.POST, path = "/query/submit",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Mono<SnowflakeService.SnowflakeResponse> submitQuery(@RequestBody SnowflakeService.QueryParams params) {
        return snowflakeService.simpleQuery(params);
    }

    @RequestMapping(
        method = RequestMethod.GET, path = "/subsidiaries/{subsidiaryId}/transaction-dates",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Mono<JsonNode> transactionQuery(@PathVariable Integer subsidiaryId) {
        return Mono.fromCallable(() -> {
            if (disallowedSubsidiaryIds.contains(subsidiaryId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid subsidiaryId");
            }
            var snowflakeParams = snowflakeService.queryTransactionDates(subsidiaryId);
            return snowflakeParams;
        })
        .flatMap(snowflakeService::simpleQuery)
        .map(snowflakeService::makeArrayOfRealObjects); 
    }

    @RequestMapping(
        method = RequestMethod.GET, path = "/subsidiaries/{subsidiaryId}/transaction-dates/{yyyy-mm-dd}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public Mono<JsonNode> transactionQuery(@PathVariable Integer subsidiaryId, @PathVariable("yyyy-mm-dd") String urlDate) {
        return Mono.fromCallable(() -> {
            if (disallowedSubsidiaryIds.contains(subsidiaryId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid subsidiaryId");
            }
            var date = LocalDate.parse(urlDate, DateTimeFormatter.ISO_LOCAL_DATE);
            var snowflakeParams = snowflakeService.queryTransactionsOn(subsidiaryId, date);
            return snowflakeParams;
        })
        .doOnError(DateTimeParseException.class, e -> {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot parse date from path parameter");
        })
        .flatMap(snowflakeService::simpleQuery)
        .map(snowflakeService::makeArrayOfRealObjects);
    }

}
