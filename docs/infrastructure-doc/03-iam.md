# IAM Module

In this tutorial, you will learn how to set up the IAM module to configure AWS Identity and Access Management (IAM) within your environment.

## Overview

The following sections provide an overview of AWS IAM in general and then the IAM Terraform module.

In IAM, groups are used to organize users and manage permissions. A group is a collection of IAM users, and each user can be a member of multiple groups. By organizing users into groups, it becomes easier to manage their permissions and access to AWS resources.

Permissions in IAM are assigned to users and groups using policies. Policies define what actions a user or group can perform on a particular resource. Permissions can be granted or denied, and they can be based on a variety of conditions, such as the user's location, the time of day, or the resource being accessed.

Groups and permissions work together in IAM to control access to AWS resources. For example, if you have a group of users who need access to a specific S3 bucket, you can create a policy that grants that group permissions to access the bucket. Then, any user who is a member of that group will automatically have the necessary permissions to access the bucket.

## IAM Module Overview

The IAM module is a Terraform module used to set up users and manage permissions for users and groups in their respective accounts. It consists of one-to-one and one-to-many mappings and provides three ways to define permission sets: AWS Manage Policy, customer-managed policy, and inline policy. These permission sets can be mapped to the groups and accounts that require them.

1. The IAM module is for the core account, which is the management account where user provisioning and permissions for users and groups to their respective accounts are defined.

2. The IAM module is broken down into different one-to-one and one-to-many mappings, where users and groups are mapped to permission sets, which are then mapped to accounts. For example, you can have a group for your DevOps team, while Developers might have a different permission set.

3. There are three ways to define permission sets:

    * **AWS Managed Policy**: Built-in policies created by AWS that define information for end-users.

    * **Customer Managed Policy**: Custom policies created by the customer to define permissions for specific services. Note that the IAM module includes examples of customer-managed policies in the **iam/policies** folder in the **tf-module** repository.

    * **Inline Policy:** Policies defined within the permission set for each account, which only exist within that policy and not in the account itself.

     Permission sets are mapped to groups and users and then to accounts.

## Video

<div style="padding:64.9% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861343353?h=1570d607eb&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="IAM Module"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Architecture

The following diagram illustrates what is deployed by the IAM module. The IAM module focuses on user provisioning and permissions within the core account, which serves as the management account. This module is designed to establish user access and permissions across various accounts within the organization.

![Diagram of IAM Module Architecture](https://assets.redesignhealth.com/NFlAuqCVjIkS27WUppnVOEntvl3P7bUdaf0vYfab/iam-state-module.png)

The diagram illustrates two different user groups (**devOps** and **developers**) with access to two different accounts (**Core** and **Dev**).

* The devOps group has a single permission set that grants access to the Core and Dev accounts through an AWS managed policy.
* The developrs group has different permissions for each account.
    * For the **Core** account, the permission setd efines an "AWS admin access"  read-only policies for developers.
    * For the **Dev** account, three permission sets exist that provides different policies for different services. The example includes three types of permission sets can be defined: AWS Managed Policies, Customer-Managed Policies, and Inline Policies.



## High-Level Process

This section provides a high-level overview of the steps for deploying the IAM module. Review the video and the **tf-modules** and **tf-infrastructure** for more information.

The following code samples will show examples of setting up user groups, permissions, and accounts within the IAM module.

### Setting up the reusable IAM module

Within the IAM Module in the TF-Modules Repository perform the following tasks to create the structure for your user groups, permissions, and accounts.

#### Defining the user groups

In the IAM module, the iam.tf file includes examples. This example defines:

* a group named "devops"
* specifies users
* specifies the membership of the group by associating each user with that group



```
resource "aws_identitystore_group" "devops" {
  display_name      = var.devops_group.gr_name
  description       = var.devops_group.gr_desc
  identity_store_id = tolist(data.aws_ssoadmin_instances.core.identity_store_ids)[0]
}

resource "aws_identitystore_user" "devops" {
  for_each          = var.devops
  user_name         = each.value.user_name
  display_name      = each.value.display_name
  identity_store_id = tolist(data.aws_ssoadmin_instances.core.identity_store_ids)[0]

  name {
    family_name = each.value.family_name
    given_name  = each.value.given_name
  }
  emails {
    value = each.value.email
    primary = true
  }
}

resource "aws_identitystore_group_membership" "devops" {
  for_each          = aws_identitystore_user.devops
  group_id          = aws_identitystore_group.devops.group_id
  member_id         = each.value.user_id
  identity_store_id = tolist(data.aws_ssoadmin_instances.core.identity_store_ids)[0]
}

```

#### Setting the permissions

In the **locals.tf** file, you can set the permissions for the group. This example sets a duration of four hours and an [AWS-managed policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/security-iam-awsmanpol.html) for the group.

```
permission_set = [
    {
      name                    = "AWS-DevOps"
      description             = "Permissions for DevOps"
      session_duration        = "PT4H"
      managed_policies        = ["arn:aws:iam::aws:policy/AdministratorAccess"]
      inline_policy           = ""
      customer_managed_policy = []
    }]
```

**Note:** The **permissions.tf** file provides examples of setting up a customer-managed policy, and the policy-files folders provide example policies.

#### Specifying accounts

The **locals.tf** file also includes assigning users to specific AWS accounts. In the following example, the core account is being assigned to a specific group.

```
 account_assignments = [
    {
      account             = join(",", concat([for account in local.accounts : account.id if account.name == "core"]))
      permission_set_arn  = aws_ssoadmin_permission_set.iam["AWS-DevOps"].arn
      permission_set_name = aws_ssoadmin_permission_set.iam["AWS-DevOps"].name
      principal_type      = "GROUP"
      group_name          = var.devops_group.gr_name
    }
]
```

### Deploying the Terraform module

To deploy the module, issue the following commands:

* `terraform init`
* `terraform apply`

### Setting up Users in the Parent IAM Module

In the parent IAM module in the **tf-infrastructure** repository, set up the user names for the account in the main.tf file for that environment.

### Viewing in IAM Identity Center

You can review accounts and users in the IAM Identify Center.

![image-20230425170343703](https://assets.redesignhealth.com/image/7358d97830ee355982c3d9e042d5ae9286788878.png)


## Related Information

* [AWS Identity and Access Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)



