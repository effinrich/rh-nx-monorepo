# VPN Module

This section covers the VPN module. This module uses OpenVPN software to set up a VPN server and client activity. This enables access to private resources that are behind a private network securely.

OpenVPN provides an encrypted internal depth graduate tunnel that allows access to these resources. The VPN client allows users to connect to accounts in core, dev, and prod using a single session. The module sets up the admin username and password, enabling MFA, setting up DNS configuration session, session expiry timeout, session terminals, TLS encryption version, and advertising the core, dev, and prod networks. The host name is set up, and the VPN service is started on the server.

## Video

<div style="padding:64.95% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861387070?h=061aaf4a80&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="VPN Module"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Architecture

The following diagram illustrates the configuration managed by the WAF module.

* Web Application Firewall (WAF) safeguards against threats in front of the load balancer.
* TLS enabled for encrypted communication:
    * Encryption in transit from user entry point.
    * Encryption between load balancer and server.
* Separate TLS certificate needed for the server. Amazon Certificate Manager (ACM) is limited to load balancers and CloudFront. An external certification (such as GoDaddy or VeriSign) is used between the load balancer and the server.
* Logging implemented at multiple levels, including load balancer logs, server logs, and graph logs for identifying false positives.
* Authenticated and authorized users establish encrypted tunnels with the load balancer.
* Single client session enables access to different accounts (e.g., core, production).

![Diagram of VPN architecture](https://assets.redesignhealth.com/qUa9FMJ7laI4J8J9piz9aiBNFMmj0MUIQm6QVr89/vpn-architecture.png)



## High-Level Process

The following steps provide a high-level overview for setting up the VPN module. See the video and source code for details.

1. Review the VPN module in the **tf-modules** repository.
   1. Review the **main.tf** file to understand the resources for the VPN module.
   2. Review the **ssm.tf** file. This file includes a script to use Systems Manager (SSM). This script includes things like enabling TLS on the server side, setting up admin user and passwords, setting up ports, and so on.
   3. Deploy by using `terraform init` and `terraform apply`. As part of the deployment, the AWS secret is generated and can be accessed through AWS Security Manager. You will also need to whitelist the IP for your host.
4. Sign into Open VPN to sign up and create an account.
5. Within IAM Identity Manager, create an application for OpenVPN and configuration with OpenVPN metadata. You can also manage users for Open VPN.

**Note:** You can download the OpenVPN client and create a profile.

## Related Information

* [OpenVPN resources](https://openvpn.net/vpn-server-resources/)
* [AWS Certification Manager](https://aws.amazon.com/certificate-manager/)
* [AWS Identity Manager](https://aws.amazon.com/iam/identity-center/)
