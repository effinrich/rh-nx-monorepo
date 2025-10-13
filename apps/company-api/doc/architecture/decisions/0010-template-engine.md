# 10. template engine

Date: 2022-11-10

## Status

Accepted

## Context

We have use cases for generating emails, attachments, and Jira tickets. We'd like to introduce a templating system
to

- ease contextualization of what a template represents (working in HTML vs. raw Strings)
- inject Java objects into templates

## Decision

I'd like to move forward with [Thymeleaf](https://www.thymeleaf.org). A study was done on
the [pros and cons of Thymeleaf, Freemarker, Mustache, and Groovy's templating language](https://springhow.com/spring-boot-template-engines-comparison/).
Thymeleaf had a good balance of performance, memory footprint, and documentation. I like that it also had
intellisense support between Java code and Thymeleaf templates.

## Consequences

Bootstrapping a templating library does increase our build time and memory footprint. Current builds are at 3.5 seconds.