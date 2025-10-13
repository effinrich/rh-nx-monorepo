# Vault Module

This section provides an overview of the Vault module and an example of an ECS deployment.

HashiCorp Vault is a secure way to store secrets, such as API keys, credentials, and tokens, and can be integrated into an ECS cluster by using a sidecar container. It is an open source system that is cloud agnostic.

## Overview

The Vault module includes two submodules: instance and service.

This video tutorial demonstrates the steps to set up Vault on an EC2 instance, including initializing Vault and generating keys and a token. It also explains how to configure Vault using GitHub authentication and user provisioning with GitHub teams, as well as demonstrates the policies for DevOps and developers with granular permissions for different paths.

**Note:** The Vault instance is spun up behind a private network and accessible only while on being on the VPN or accessing through apps/services on the intranet.

## Video

<div style="padding:62.57% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861443783?h=8e3f9c1a73&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Vault Module"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Architecture

The following diagram provides a high-level overview of the Vault module within the infrastructure.

![Diagram of Vault Module](https://assets.redesignhealth.com/czzFlf5FENscHVPFww1pvsW1NI4LAa3SHuoHyc1b/vault.png)



## High-Level Process

This section provides a high-level overview of the steps for deploying the Vault module. Review the video and the **tf-modules** and **tf-infrastructure** for more information.

### Configure the Vault module

1. Review the Vault module in the **tf-modules** repository.
   1. Review the **vault/instance/main.tf** file. In addition to setting up the resources needed for fault, this file contains a series of commands to set up Vault. This includes keys and secrets that you should document if needed later.
   2. Review the **vault/service/auth_github.tf** file. This file shows GitHub permissions and organization. Use GitHub authentication to log into vault.
   3. Review the **vault/service/locals.tf** file to specify the GitHub teams that have permission to interact with Vault.
   4. Review the **vault/service/policies.tf** file to view the policies for each group.
   5. Review the **vault/service/auth_aws.tf** file to view backend authentication.
2. Deploy the instance submodule by using `terraform init` and `terraform apply` commands.
3. Ensure you are on the VPN and deploy the service module by using the `terraform init` and `terraform apply` commands.

### Get a GitHub token to use with Vault

1. Log in to your GitHub account and navigate to the **Settings** page.
2. Click on the **Developer settings** option in the left sidebar.
3. From the **Developer settings** page, click on the "Personal access tokens" option.
4. Click on the **Generate new token** button to create a new token.
5. Give your token a name and select the permissions you want to grant to the token.
6. Once you have selected the appropriate permissions, click on the **Generate token** button.

**Note:** GitHub will generate a new token for you. Make sure to copy the token value and keep it somewhere safe, because you will not be able to see the token value again.

### Review secrets in Vault

1. At the Vault login page, choose to use **GitHub Authentication**.
2. In the token field, paste your GitHub token and click **Sign In**.

### Review example

The **tf-infrastructure** repository provides an example of how to set up an application to use Vault and associated secrets. Review **tf-infrastructure/ecs/task-definition-vault-example** to review the example.

The **main.tf** file in the example shows how Vault is defined in an options block, the configuration and permissions values for the Vault agent, the file name where secrets will be stored, and the template to use. The example includes two different containers. The vault-agent container establishes the secrets file and then injects them into the test application container.

The **templates/keys.ctmpl** file identifies the secret to use.

## Related Information

* [Hashicorp Vault](https://www.vaultproject.io/)
* [Amazon Elastic Container Servide](https://aws.amazon.com/ecs/)
* [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/)
