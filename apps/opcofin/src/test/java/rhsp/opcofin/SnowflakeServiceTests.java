package rhsp.opcofin;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class SnowflakeServiceTests {

    private SnowflakeService snowflakeService;
    private final Logger logger = LoggerFactory.getLogger(SnowflakeServiceTests.class);

    private final String SQLSTATE_SUCCESS = "00000";
    private final String SQLSTATE_COMPILE_ERROR = "42S02";

    @Autowired
    public SnowflakeServiceTests(SnowflakeService snowflakeService) {
        this.snowflakeService = snowflakeService;
    }

    @Test
    public void validateJwt() {
        String jwt = snowflakeService.signJwt();
        assertTrue(snowflakeService.validateJwt(jwt));
    }

    @Test
    public void validateJwt_random() {
        String malformedJwt = UUID.randomUUID().toString();
        assertFalse(snowflakeService.validateJwt(malformedJwt));
    }

    @Test
    public void query() {
        var params = new SnowflakeService.QueryParams(null, null, "SELECT 1");
        var response = snowflakeService.simpleQuery(params).block();
        assertEquals(SQLSTATE_SUCCESS, response.sqlState());
    }

    @Test
    public void query_badsql() {
        var params = new SnowflakeService.QueryParams(null, null, "SELECT 1 from DNE");
        var response = snowflakeService.simpleQuery(params).block();
        assertEquals(SQLSTATE_COMPILE_ERROR, response.sqlState());
    }

    @Test
    public void test_transform_data() throws JsonMappingException, JsonProcessingException {
        String json = """
            {
                "data": [
                    [
                        "44",
                        "RH Studio 2 OpCo 31, Inc.",
                        "Parent Company : Redesign Health Inc. : RHI Holdings 2, LLC : RH Studio 2 OpCo 31, Inc.",
                        "RH Studio 2 OpCo 31, Inc.",
                        null,
                        "33",
                        "RHI Holdings 2, LLC",
                        "85 5th Avenue",
                        "8th Floor",
                        null,
                        "New York",
                        "NY",
                        "10003",
                        "US",
                        "1",
                        null,
                        "USD",
                        "false",
                        "false",
                        "1648824186.000000000"
                    ],
                    [
                        "45",
                        "RHI NVF Management Co., Inc.",
                        "Parent Company : Redesign Health Inc. : RHI NVF Management Co., Inc.",
                        null,
                        null,
                        "4",
                        "Redesign Health Inc.",
                        null,
                        null,
                        null,
                        null,
                        "NY",
                        null,
                        "US",
                        "1",
                        null,
                        "USD",
                        "false",
                        "false",
                        "1650573513.000000000"
                    ]
                ],
            "resultSetMetaData": 
                {
                    "rowType": [
                        {
                        "name": "SUBSIDIARY_ID"
                        },
                        {
                        "name": "SUBSIDIARY_NAME"
                        },
                        {
                        "name": "SUBSIDIARY_FULL_NAME"
    
                        },
                        {
                        "name": "SUBSIDIARY_LEGAL_NAME"
                        },
                        {
                        "name": "EMAIL_ADDRESS"
                        },
                        {
                        "name": "PARENT_ID"
                        },
                        {
                        "name": "PARENT_COMPANY_NAME"
                        },
                        {
                        "name": "ADDRESS_LINE_1"
                        },
                        {
                        "name": "ADDRESS_LINE_2"
                        },
                        {
                        "name": "ADDRESS_LINE_3"
                        },
                        {
                        "name": "CITY"
                        },
                        {
                        "name": "STATE"
                        },
                        {
                        "name": "ZIP_CODE"
                        },
                        {
                        "name": "COUNTRY"
                        },
                        {
                        "name": "FISCAL_CALENDAR_ID"
                        },
                        {
                        "name": "SUBIDIARY_URL"
                        },
                        {
                        "name": "CURRENCY_SYMBOL"
                        },
                        {
                        "name": "IS_INACTIVE"
                        },
                        {
                        "name": "IS_DELETED"
                        },
                        {
                        "name": "UPDATED_AT"
                        }
                    ]
                }
            }
        """;

        var objectMapper = new ObjectMapper();
        var snowflakeSampleResponse = objectMapper.readValue(json, JsonNode.class);
        var data = snowflakeSampleResponse.findPath("data");
        var metaData = snowflakeSampleResponse.findPath("resultSetMetaData");
        var params = new SnowflakeService.SnowflakeResponse("", "", "", "", Instant.now(), "", data, metaData, "");
        var response = snowflakeService.makeArrayOfRealObjects(params);
        logger.info(response.toPrettyString());
        var dataSize = data.size();
        var responseSize = response.size();
        var rowType = metaData.findPath("rowType");
        var firstKey = rowType.get(0).findPath("name").asText();
        var lastKey = rowType.get(rowType.size() - 1).findPath("name").asText();
        var responseFirstObj = response.get(0);
        var responseFirstVal = responseFirstObj.findPath(snowflakeService.dbStyleToCamelCase(firstKey)).asText();
        var responseLastVal = responseFirstObj.findPath(snowflakeService.dbStyleToCamelCase(lastKey)).asText();
        var dataFirstEl = data.get(0);
        var dataFirstVal = dataFirstEl.get(0).asText();
        var dataLastVal = dataFirstEl.get(dataFirstEl.size() - 1).asText();
        assertEquals(dataSize, responseSize);
        assertEquals(dataFirstVal, responseFirstVal);
        assertEquals(dataLastVal, responseLastVal);
    }
}