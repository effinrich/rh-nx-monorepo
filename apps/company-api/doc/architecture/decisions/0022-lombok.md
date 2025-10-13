# 22. Lombok

Date: 2023-04-14

## Status

Accepted

## Context

Our POJOs are starting to have a lot of boiler plate. This is especially the case with our Builders.

We have engineers that have used Lombok in the past.
## Decision

Use Lombok for all POJOs when possible.

## Consequences
* Amount of code maintained is reduced
* We'll have to retrofit POJOs with Lombok annotation
* There will be an encouragement to wholesale expose getters and/or setters. We need to be intentional about which fields we expose from our POJOs.
* We have another library to learn
* Library updates are managed by Spring Starter POM for us
