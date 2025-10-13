---
cardTitle: Service Infrastructure Overview
description: Describes the technical stack that supports the Innovation Platform service architecture.
labels:
  - infrastructure
---
# Service Infrastructure

The following table describes components of the service infrastructure:


| **Category**              | **Service**                                                  |
| ------------------------- | ------------------------------------------------------------ |
| Artifactory               | [Amazon Elastic Container Registry (AWS ECR)](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) |
| CI                        | [GitHub Action](https://docs.github.com/en/actions)                                                |
| Code Repo                 | [GitHub](https://docs.github.com/en/get-started)                                                       |
| Secured KV                | [HashiCorp - Vault](https://www.vaultproject.io/) |
| DNS                       | [Amazon Route 53](https://aws.amazon.com/route53/)                                                     |
| DDOS Protection           | [Amazon Web Services Web Application Firewall (AWS WAF)](https://aws.amazon.com/waf/getting-started/)                                                      |
| API Gateway               | [NGINX](https://www.nginx.com/) |
| CIAM (Internal)           | Google + [Amazon Cognito](https://aws.amazon.com/cognito/getting-started/)                                             |
| Config Management Infra   | [Terraform](https://developer.hashicorp.com/terraform/intro) |
| Config Management Dynamic | [HashiCorp Vault](https://www.vaultproject.io) |
| Image Orchestration       | [Amazon Elastic Container Service (ECS)](https://aws.amazon.com/ecs/getting-started/)                                                          |
| Storage                   | [Amazon Simple Storage Service (S3)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html)                                                           |
| CDN                       | [Amazon CloudFront](https://aws.amazon.com/cloudfront/getting-started)                                                   |



