---
description: The infrastructure is built using terraform modules that install and configure various components that constitute the infrastructure.
---

# Getting Started

This section provides an overview of the infrastructure components and set up. It includes a description of:

* the details about the infratructure offering
* the components included in the tech stack
* an overview of the Terraform modules used to deploy the infrastructure
* a high-level overview of the steps required

## Infrastructure offering

Redesign Health provides infrastructure to companies as a tailored offering to meet initial development needs with the ability to grow and pivot as companies evolve.

As part of the onboarding process, you will complete two questionnaires:

* Tech Stack questionnaire - The member of your team who will manage the technical infrastructure should complete this survey and identify the infrastructure components that you want to use as part of your tech stack.
* Privacy questionnaire - Complete this survey to identify the types of data your company will be accessing or storing.

The Innovation Platform team collaborates with your company to configure a technical infrastructure based on the options you selected and in the specific context of your company technical and privacy requirements. The Platform team provides a high-level analysis as needed and compares that to Redesign offerings to ensure that your company gets an infrastructure that works for you.

This infrastructure can include multiple environments and tools to allow your company to begin development as soon as it has an engineering team.

AWS Credit procurement for cloud services is available (no matter what infrastructure your company chooses).

## Tech Stack Components

The following table lists the different components of the tech stack that the Platform infrastructure uses.


| **Category**              | **Service**                                                  | Description                                                  |
| ------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Artifactory               | [Amazon Elastic Container Registry (AWS ECR)](https://docs.aws.amazon.com/AmazonECR/latest/userguide/what-is-ecr.html) | ECR is a fully managed Docker container registry service is designed to securely store, manage, and deploy Docker container images, which are used to package and distribute applications along with their dependencies. |
| CI                        | [GitHub Action](https://docs.github.com/en/actions)          | GitHub Actions is a powerful automation and workflow automation platform provided by GitHub. |
| Code Repository           | [GitHub](https://docs.github.com/en/get-started)             | GitHub is a web-based platform that provides version control and collaboration for software development projects. |
| Secured KV                | [HashiCorp - Vault](https://www.vaultproject.io/)            | HashiCorp Vault provides secure, store and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets and other sensitive data using a UI, CLI, or HTTP API. |
| DNS                       | [Amazon Route 53](https://aws.amazon.com/route53/)           | Amazon Route 53 is a highly available and scalable Domain Name System (DNS) web service. Route 53 connects user requests to internet applications running on AWS or on-premises. |
| DDOS Protection           | [Amazon Web Services Web Application Firewall (AWS WAF)](https://aws.amazon.com/waf/getting-started/) | AWS Web Application Firewall (WAF) is a web application firewall that helps protect your web applications and APIs against common web exploits and bots that can affect availability, compromise security, or consume excessive resources. |
| API Gateway               | [NGINX](https://www.nginx.com/)                              | NGINX is open source software for web serving, reverse proxying, caching, load balancing, media streaming, and more. |
| CIAM (Internal)           | Google + [Amazon Cognito](https://aws.amazon.com/cognito/getting-started/) | Google provides a no cost initial entry to getting authentication into the infra and platform resources.  You can elect to migrate to Okta. |
| Config Management Infra   | [HashiCorp Terraform](https://developer.hashicorp.com/terraform/intro) | HashiCorp Terraform is an open-source **infrastructure as code**software tool that enables you to safely and predictably create, change, and improve infrastructure. |
| Config Management Dynamic | [HashiCorp Vault](https://www.vaultproject.io)               | HashiCorp Vault provides secure, store and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets and other sensitive data using a UI, CLI, or HTTP API. |
| Image Orchestration       | [Amazon Elastic Container Service (ECS)](https://aws.amazon.com/ecs/getting-started/) | Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that helps you easily deploy, manage, and scale containerized applications. |
| Storage                   | [Amazon Simple Storage Service (S3)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) | Amazon Simple Storage Service (Amazon S3) is an object storage service offering industry-leading scalability, data availability, security, and performance. |
| Content Delivery Network  | [Amazon CloudFront](https://aws.amazon.com/cloudfront/getting-started) | Amazon CloudFront is a CDN service provided by AWS to help distribute and deliver web content, including static and dynamic assets. |

## Terraform Modules

Based on the components that you selected, the Platform provides Github repositories that contain a series of terraform modules that allow you to configure and set up your different environments.

Terraform modules are reusable, self-contained packages of Terraform configuration that are designed to be easily shared, versioned, and managed.

A Terraform module can be thought of as a set of Terraform resources that are grouped together into a single logical unit, with well-defined inputs and outputs. Modules are used to encapsulate infrastructure logic and make it easier to manage and reuse infrastructure code across different projects and teams.

Redesign Health modules provides these modules through GitHub repositories created for your company. You can update or modify these modules to meet your specific use case.

- The **tf-modules** repository includes reusable components that can be individually modified.
- The **tf-infrastructure** repository includes parent terraforms scripts.

Access to these repositories is provided based on the Git information provided during the onboarding process.

Using the Terraform modules, you can create different environments such as core, staging, dev, and production. This guide will walk you through the process of using these modules. Each step is accompanied by a video tutorial.

## Steps for Setting up your Infrastructure

The following table provides a high-level overview of the different modules and steps that you complete to set up your infrastructure. Documentation for each of these steps includes a video that will provide a detailed walkthrough of setting up that component.

| #   | Step                                                                                                                                                           | Modules                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 1   | [Create your AWS accounts for different environments.](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/xh989SrZ)                                                                                   | N/A                                      |
| 2   | [Deploy terraform modules within each environment.](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/WFViPHxJ)                                                                                     | **tf-remote-state** module               |
| 3   | [Set up the IAM module to configure AWS Identity and Access Management (IAM).](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/fmsF9lWw)                                                                      | **iam** module                           |
| 4   | [Use the VPC module to set up virtual private cloud (VPC) endpoints and configure your network environment.](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/4RcDCDGM)                                    | **network** module<br />**vpc** module   |
| 5   | [Use the WAF module to set up a web application firewall (WAF)](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/GskXDtks)                                                                                     | **wafv2** module                         |
| 6   | [Set up and configure the Domain Naming Service (DNS) module and AWS Certification Management (ACM) modules.](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/qmGleoei)                                   | **dns** module<br />**acm** module       |
| 7   | [Use the VPN module to set up a VPN server with OpenVPN.](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/TVo2zukU)                                                                                           | **vpn** module                           |
| 8   | [Use the GuardDuty module and ECR module to set up threat detection and container systems.](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/yaJbkSiq)                                               | **guardduty** module<br />**ecr** module |
| 9   | [Use the RDS module to create and deploy your Amazon Database Service (RDS database) and the ECS module to manage containerized applications. ](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/tSuwvynP) | **rds** module<br />**ecs** module       |
| 10  | [Use the Vault module to secure secrets, such as API keys, credentials, and tokens and integrate that with an EC2 instance. ](https://platform.redesignhealth.com/dev-library/Y7qLgY6C/module/QPyzDO8i)                     | **vault** module                         |

## Related Information

- [Terraform Documentation](https://developer.hashicorp.com/terraform/docs)
- [Amazon Console](https://aws.amazon.com/console/)
