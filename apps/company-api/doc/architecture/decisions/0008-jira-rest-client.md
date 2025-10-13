# 8. Jira Rest Client

Date: 2022-10-13

## Status

Accepted

## Context

We need to generate Jira tickets for OpCo infrastructure requests. Jira no longer supports their SDK and requires developers to generate
their own [API clients via OpenAPI](https://blog.developer.atlassian.com/update-to-jira-clouds-swagger-openapi-docs/).

## Decision

We will download [Jira's v2 REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v2/intro/) OpenAPI v3 definition file and generate API models using [swagger-codegen](https://github.com/swagger-api/swagger-codegen).

OpenAPI config must be saved to [jira-rest-client/jira-v2-open-api-v3-spec.json](../../../jira-rest-client/jira-v2-open-api-v3-spec.json). This can be changed via [jira-rest-client/pom.xml](../../../jira-rest-client/pom.xml) under `build > plugins > plugin > swagger-codegen-maven-plugin > inputSpec`.

```xml
 <plugin>
    <groupId>io.swagger.codegen.v3</groupId>
    <artifactId>swagger-codegen-maven-plugin</artifactId>
    <version>${swagger.codegen.version}</version>
    <!-- other fields omitted for brevity -->
    <executions>
        <execution>
        <configuration>
            <inputSpec>${project.basedir}/jira-v2-open-api-v3-spec.json</inputSpec>
            <!-- other config -->
        </configuration>
        </execution>
    </executions>
</plugin>

```

Code is generated via

```bash
$ mvn clean compile -pl jira-rest-client
```

In order to allow the `application` module access to this library, you must run up to the `install` phase.

```bash
$ mvn clean install -pl jira-rest-client
```

Note: we do not generate the client API code as this includes HTTP dependencies.

## Consequences

- Not generating client code - we will be responsible for transforming API requests/responses, handling error statuses, and forming API uris. This complexity seems worth not having to maintain addition HTTP libraries and transitive dependency conflicts with spring boot.
- Library relies on Jackson - we will have to maintain Jackson compatibility between this library and our host app. If this becomes a problem, we might consider scrapping all of this code generating and manually creating these models ourselves
- Bug in OpenAPI file - we have to manually edit the OpenAPI file for the codegen to work properly. I've opened a [bug with Jira](https://ecosystem.atlassian.net/servicedesk/customer/portal/34/ECOHELP-2588). Eventually we won't have to worry about this.
