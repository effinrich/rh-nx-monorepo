# 2. Java and Spring

Date: 2022-09-22

## Status

Accepted

## Context

We currently have two backend services: Searchlight (written in python) and Opcofin (written in Java/Spring).

## Decision

After talking with Matt Stephenson, the decision has been made to use a JVM-based language for backend services moving forward. Java and Spring are popular tools used by many top tech companies. They offer solutions to support
caching, monitoring, ORMs, reactive programming and more. 

## Consequences

Java has a higher amount of boilerplate than most languages. Spring gets around this by performing "magic" with its [IoC Container](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/beans.html), Bean registry, and @Annotations. Spring Boot takes this a step further by attempting to predict configuration based on what's on your classpath. This can lead to a lot of headache when troubleshooting issues and not knowing what Spring's intentions are.

This also affects recruiting and candidates interest in developing in Java. 