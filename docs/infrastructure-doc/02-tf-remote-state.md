# Terraform Remote State

This module explains how to use Terraform to start deploying your infrastructure.

Terraform is an open-source **infrastructure as code** software tool created by HashiCorp. It allows users to define and provision infrastructure for their applications and services using a high-level configuration language. With Terraform, you can create, modify, and delete infrastructure resources such as virtual machines, networks, databases, and more across multiple cloud providers and on-premise environments. Terraform also provides a way to manage and version infrastructure code, making it easy to collaborate with others and automate deployments.

The Terraform modules needed to deploy your infrastructure are provided in Git repositories to your company.

The first module (**tf-remote-state**)  you will deploy sets up an S3 bucket with encryption. It provides a locking mechanism by using the Amazon DynamoDB to store lock state each time a deployment is triggered.

## Structure of the Terraform Repositories

To deploy the infrastructure using Terraform, you will use the following repositories:

* The **tf-modules** repository includes reusable modules. These modules include no hardcoded or static values. You can reference these modules and deploy them in your account as needed.
* The **tf-infrastructure** repository acts as the parent repository and include scripts for each of the four environments.

**Note:** The repositories use semantic versioning for components.

### Working with the tf-modules repository

**Note:** Nothing is hardcoded in the terraform scripts in the **tf-modules** repositories. You can reference them from any environment. They are reusable modules.

### Working with the tf-instructure repository

The structure of the **tf-infrastructure** repository mirrors the setup of the OUs in AWS where there are accounts for each of these environments.

```
tf-infrastructure
  - core
  - dev
  - prod
  - staging
```

Within each environment folder, there are subfolders for each of the tf-modules. Within each module subfolder, there is **main.tf** script that contains resource values for that module for that specific environment.

```
tf-infrastrcture
   - prod
      - acm
        - main.tf
      - dns
        - main.tf
(and so on)
```

For example, consider the following script as an example. This script is for the Terraform Remote State module for the core environment.

It identifies:

* the source of the reuable module in **tf-modules** to reference (including the semantic version number)
* specific values to use for that module
* metadata tags you can use to organize your AWS resources
* the terraform backend
* the terraform output value

```
module "tf-state" {
  source = "git@github.com:placeholder/tf-modules.git//tf-remote-state?ref=tf-state-0.2.0"

  company_name   = "placeholder"
  s3_bucket_name = "placeholder-${module.tf-state.tags.Environment}-terraform-remote-state"
  dynamodb_name  = "placeholder-${module.tf-state.tags.Environment}-terraform-lock-state"

  tags = {
    Name        = "tf-state"
    Environment = "core"
    Project     = "baseline"
    Team        = "devops"
    Managed     = "terraform"
    OwnerEmail  = "devops@placeholder.com"
    CostCenter  = "core"
    LastReview  = "2022-11-16"
    Ticket      = "DOS-x"
  }
}

terraform {
  backend "local" {
    path = "./terraform.tfstate"
  }
}

output "tf-state" {
  value = module.tf-state
}
```

## Video

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861291594?h=dccf3c64c9&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Terraform Module"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Architecture

 The following diagram illustrates the architecture of what the Terraform State module configures.

The terraform module deploys the S3 backend. The backend will be fully encrypted and versioned. The Amazon DynamoDB allows state locking so that a terraform module is locked for other users while it is being deployed.

 ![Diagram of Terraform State Module Architecture](https://assets.redesignhealth.com/ibTE0lXXzTb611mWAlCglVnrAke0Ne1ErUnhSyy7/tf-remote-architecture.png)



## Steps

1. In the **tf-module** repository, review the following reusable files  in the **tf-remote-state** module.

    - **tf-remote-state/dynamo.tf** -  resource definitions for for a DynamoDB table for state locking.
    - **tf-remote-state/s3.tf**  - resource definitions for the S3 remote state bucket.
    - **tf-remote-state/data.tf** - resource definitions for S3 bucket policies

2. In the **tf-infrastrcture** repository, update the **core/tf-remote-state/main.tf** file with the appropriate values for your environment.

3. Deploy the terraform script for core by issuing the `terraform init` and then the `terraform apply` commands.

4. Review the results of the deploy in the Amazon console.

    - To view the S3 buckets go to **Amazon S3 > Buckets**.
    - To view the DynamoDB , go to **DynamoDB > Items**.

**Note:** In other modules, you will specify this S3 bucket as the backend.

```
terraform {
  backend "s3" {
    bucket         = "placeholder-core-terraform-remote-state"
    encrypt        = true
    key            = "devops/infrastructure/vpn" #Path in repository
    region         = "us-east-1"
    dynamodb_table = "placeholder-core-terraform-lock-state"
  }
}
```
The key value needs to be unique across all modules and environments. A suggested naming convention is ***team-name*/infrastructure/*module-name***.

## Related Information

* [Terraform](https://www.terraform.io/)
* [Amazon DynamoDB](https://aws.amazon.com/dynamodb/)
* [Amazon S3](https://aws.amazon.com/s3/)
