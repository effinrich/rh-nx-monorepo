# 7. Multi Module Project

Date: 2022-10-13

## Status

Accepted

## Context

We currently have no way of building out independent libraries/modules for our java project. All the code must exist in the same `src` folder.

## Decision

We will use maven's [multi-module configuration](https://maven.apache.org/guides/mini/guide-multiple-modules.html) to enable us to separate concerns in this project. This will be useful to manage a separate library for JIRA. See [0008-jira-rest-client.md]() for more details.

## Consequences

We'll have to create helper commands/profiles to ease use with this project. Before we could simply run `mvn spring-boot:run` to run the project.
Now we'll need to do something like `mvn spring-boot:run -pl application`.
