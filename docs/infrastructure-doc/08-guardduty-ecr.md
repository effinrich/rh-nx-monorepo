# Guard Duty - ECR

This section describes the Guard Duty module and the Elastic Container Registry (ECR) module.

* The Guard Duty module deploys the Amazon Guard Duty service which manages threat detection. It monitors all resources and detects any malicious traffic coming into the account and reports the findings for visibility purposes. The module also includes a lambda function that takes remedial action, such as blocking malicious IPs and adding them to the IP set blocklist.
* The ECR module sets up a repository where Docker images can be pushed and pulled for deployment purposes. The ECR module is simple and involves setting up a repository, replication across regions, and a lifecycle policy for expiring older images.

## Video

<div style="padding:64.9% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861388812?h=79084e3dc8&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="GuardDuty - ECR Modules">

## Architecture

The following diagram illustrates the configuration managed by the GuardDuty module.

* The GuardDuty module activates the GuardDuty service.
* CloudWatch includes triggers based on threat severity levels.
* If high-threat incidents is detected, a Lambda function is triggered and initiates actions.
* The malicious IP is blocked at the network ingress point using NACL.
* IP is added the WAF filtering rules to prevent it from accessing the account and load balancers.
* Amazon Simple Notification Service (SNS) sends email alerts on malicious findings.
* Amazon DynamoDB stores malicious IPs in its database to enable tracking and analysis.

![Diagram of GuardDuty module](https://assets.redesignhealth.com/O0B7OS43cf86Oh0LO1sqaNCbvVskpIbOrXKDt8Vh/guard-duty-module.png)



## High-Level Process

This section provides a high-level overview of the steps for deploying the GuardDuty and ECS modules. Review the video and the **tf-modules** and **tf-infrastructure** for more information.

### Working with the Guard Duty module

1. Review **tf-modules/guardduty/guardduty.tf** file. Within the detector resources, you enable protection for such things as S3 logs, Kubernetes, and malware. It also sets up logic for adding member accounts.
2. Use `terraform init` and `terraform apply` to deploy the module to both **core** and **dev** account.
3. Review **tf-modules/guardduty/lambda.tf** file. It includes references to different lamdba logic in python files in **the tf-modules/guardduty/lambda** folder. It contains the logic to manage block lists.

### Working with the ECR Module

#### Set up the logic

1. Review **tf-modules/ecr/main.tf** file. Within this file, you specify where you can push your Docker images and pull them from whether locally or from centralized container platforms.
2. Review **tf-modles/ecr/lifecycle.tf** to set up the logic for your lifecycle management and the length of times before images expire.

#### Set up specific values

1. Review **tf-infrastructure/ecr/main.tf**. Update the project name you are working on and the team that is working on that project. The value is comma-delimited so you can add multiple projects.
2. Use `terraform init` and `terraform apply` to deploy the module to both **core** and **dev** account.

### Working with the S3 module

1. Review **tf-modules/s3/main.tf** file to set up S3 bucket resources.
2. Review **tf-infrastructure/dev/s3/main.tf** to set up values for a particular bucket.


## Related Information

* [Amazon GuardDuty](https://www.amazonaws.cn/en/guardduty/)
* [Amazon Elastic Container Registry (ECR)](https://aws.amazon.com/ecr/)

