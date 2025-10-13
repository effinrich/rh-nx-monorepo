# RDS-ECS

You use the RDS and ECS modules to set up and manage the Amazon Relational Database Service (RDS) and the Amazon Elastic Container Registry (ECR) in AWS.

* The RDS module streamlines the configuration of a fully-managed database service on AWS. It includes attributes like instance settings, parameter groups, subnet groups, and main user credentials. Additionally, the module supports the creation of a CNAME record to facilitate database connections.

* The ECS module manages Docker container images in ECS. The ECS is a highly available and scalable platform for storing and deploying these images. The ECS module consists of cluster and task definition sub-modules.

 This section covers deploying RDS and ECS in a dev account and ensuring a unique RDS name for each infrastructure deployment.

## Video

<div style="padding:62.57% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861439818?h=72c65e11b0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="RDS and ECM Module"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Architecture

The following diagram illustrates what the ECS module manages.

In a high-level view, an incoming front-end request from a domain like example.com travels through ingress (Route 53) to reach a load balancer. This load balancer, with security measures  (WAF) in place, forwards the request to the appropriate ports of the container. Behind this setup, an ECS Fargate cluster manages services, and within these services, multiple task definitions can be configured. Task definitions can include various tasks and are equipped with CloudWatch insights and blocks for monitoring CPU memory utilization and container logs.

![Diagram of ECS Module Architecture](https://assets.redesignhealth.com/40OE7lNDjrFXbVsvukrt7tFCU9CRtmag2KtkuRyM/ecs-module.png)

## High-Level Process

This section provides a high-level overview of deploying the RDS and ECS modules. Review the video and the **tf-modules** and **tf-infrastructure** for more information.

### Working with the RDS module

1. Review **tf-modules/rds/rds.tf** file. This file contains the values you typically would complete if creating an RDS database through the console. Modify these values as needed.

2. Update and deploy the RDS database to the **dev** account.

    1. Review the **tf-infrastructure/rds/test-db/main.tf** file. Modify it as needed for the dev account. This file includes RDS database-specific values, such as the engine, engine version, allocated storage, max allocated storage, back-up retention period and so on.  <br/><br/>**Note:** For each database you want to deploy, you will need to copy the **test-db** folder, give it a new unique name, and update the **rds_name** value and the associated backend key value in that folder's **main.tf** file. This ensures that you have isolated state files.
    2. Update values as necessary for your use case.
    3. Deploy the database by using the `terraform init` and `terraform apply` commands. This action can take several minutes to complete.

3. View the hosted zone in the AWS Console.

    1. Log in to your AWS Management Console and navigate to the Route 53 service.
    2. In the left navigation pane, select **Hosted zones** to display a list of your hosted zones.
    3. Find the hosted zone that you want to view and click on its name.
    4. In the right-hand pane, you should see the details of the hosted zone, including its record sets.


### Working with the ECS Module

The ECS module has two submodules: clusters and task-definition.

#### Update the clusters and task-definition submodules in the tf-modules repository

1. Work with the **clusters** submodule.
   1. Review the **tf-modules/ecs/cluster/main.tf**. Update the file as necessary.
   2. Review the **tf-infrastructures/dev-cluster/main.tf** file. This file specifies both the cluster values, as well as a task definition. For ECS, you first define the cluster itself to define the capacity provider, and then you use the task-definition you want to deploy inside the cluster. Update as necessary.
2. Work with the **task-definition** submodule.
   1. Review the **tf-modules/ecs/task-definition/main.tf** file. This file defines the structure of the service. This includes the load balancer.
   2. Review the load balancer definition in **tf-modules/task-definition/lb.tf**. Note that you can have a public and private load balancer. You set up listeners for each load balancer (for example, one cluster with two load balancers). Within each load balancer, add rules that define your application and point to the relevant target for your application.
   3. Review the **tf-modules/task-definition/auto-scale.tf** file for autoscaling thresholds.

#### Update the clusters and task-definition submodules in the tf-infrastructure repository

3. Work with the **clusters** submodule.
    1. Review the **tf-infrastructure/dev/ecs/dev-cluster/main.tf** file. Update the task policy to set up permissions, ingress ports, target values, and S3 terraform values.
    2. Deploy the cluster database by using the `terraform init` and `terraform apply` commands. This action can take several minutes to complete. Note that this deploys an empty cluster. Continue to the next step to determine how to integrate with an example application.
3. Review an example application in the **tf-infrastructure** repository.
    1. Open the **tf-infrastructure/dev/ecs/task-definition-example/main.tf** file. Update the configuration values as needed. These values include such things as whether the application is internal, whether it uses Vault, any custom applicable task policies, applicable ingress ports, task definitions, service details, target group, tags, and Terraform parameters.
    2. Deploy the application to the dev account by issuing the `terraform.init` and `terraform.deploy` commands.

**Note:** The same cluster and load balancer can be used with different applications. There is a many-to-one relationship when integrating applications with clusters and load balancers.

### Setting up your application-specific Terraform code

You should define separate repositories for your application and your application-specific Terraform source code.

**Note:** Although the **tf-infrastructure** repository includes an example of an application, you should create a dedicated repository for your source code that is separate from the provided Terraform repositories. The **tf-applications** repository provides an example of doing so. This repository includes different environments for **core**, **dev**, **prod**, and **staging**.<br/><br/>You can subdivide the code by user group (for example, devs, data, devops, and so on).

1. Generate a Docker image for your application.
2. Generate a token and add a secret in GitHub.
3. Setup Terraform.
4. Deploy the application. Specify a variable to identify the image.


## Related Information

* [Amazon Relational Database Service (RDS)](https://aws.amazon.com/rds/)
* [Amazon Elastic Cluster Registry (ECR)](https://aws.amazon.com/ecr/)
* [AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html)
* [Docker](https://www.docker.com/)
