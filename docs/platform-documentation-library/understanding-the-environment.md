---
cardTitle: Understanding Environments
description: Describes the environments that are created via the Platform.
tableOfContents: true
sectionOrder:
  - service-infrastructure-overview
  - telemetry-and-data-infrastructure-overview
labels:
  - environment
---

# Understanding Enviroments

When you stand up an environment through the Platform, the environment includes:

* Fully fledged Virtual Private Cloud (VPC)
     - 2 NATs (private&lt;&gt;public internet) / 2 VPC endpoints (intranet)
     - 1 region, one subnet per az (a,b,c,d) for HA

* Four fully fledged environments

     - Dev
     - Staging
     - Prod
     - Core

* AWS Access Accounts:

     - Security OU: Audit and Logging accounts
     - Dev OU: Dev account (Development Sandbox)
     - Staging OU: Staging account (QA/stage releases)
     - Prod OU: Prod account (Prod services/apps only)
     - Core Ou: Core account (Shared core services)

* Security (IAM Roles/Permissions):
     - AWS (Iam, Config, AWS Security Hub, GuardDuty/Lambda NACL Blacklist, WAF)
     - Terrascan, tfsec
     - VPN - provide secure encrypted tunnel to access private networks

