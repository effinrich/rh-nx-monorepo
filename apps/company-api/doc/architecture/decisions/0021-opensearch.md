# 21. OpenSearch

Date: 2023-03-17

## Status

Accepted

## Context

We need a search server to support our [Document Library](https://redesignhealth.atlassian.net/jira/polaris/projects/PD/ideas/view/1671744?selectedIssue=PD-32&issueViewSection=comments).

We do not have the resources to host this service ourselves and want to look into hosted solutions.

AWS has support for legacy [Elasticsearch](https://www.elastic.co) or [OpenSearch](https://opensearch.org). 

The difference and history between the two can be found [here](https://www.elastic.co/what-is/opensearch).

## Decision

We will move forward with OpenSearch as it matches with AWS's support strategy.

The SDKs were identical for document get, search, and indexing.

## Consequences

* Elasticsearch is the most popular search server and may have features we need in the future. 
* OpenSearch is a fork of Elasticsearch and may not have the same level of support/vision as Elasticsearch.
* Unsure about the Kibana support or 3rd party library interoperability 
