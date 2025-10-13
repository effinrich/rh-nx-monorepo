# 3. Google Code Style

Date: 2022-09-22

## Status

Accepted

## Context

We currently don't have a standard for backend code style.

## Decision

We will use [Google's Java Style Guide](https://google.github.io/styleguide/javaguide.html). It is the most well known style guide for Java. Spotify's plugin implementation for enforcing that style ([fmt-maven-plugin](https://github.com/spotify/fmt-maven-plugin)) will allow us to have consistent styles across developers without much lift. The formatter will be run during [process-sources](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html#lifecycle-reference).

## Consequences

This may cause developers pain if the formatter makes code look worse. We can re-evaluate this decision if that occurs.

Code style isn't being verfied yet. We will need to add that to have code formatted before it is merged into *main*.