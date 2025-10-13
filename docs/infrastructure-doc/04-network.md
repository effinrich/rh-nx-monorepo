# Network Module

This tutorial provides an overview of the Network module that is used to set up an Amazon Virtual Private Cloud (VPC) in two accounts, as well as establish peering between the two accounts using the peering module.

## Overview

The network module consists of two sub-modules, VPC and peering.

* The VPC module includes the following:
    * Multiple availability zones, each with public and private subnets
    * Public subnets have a public route table to the internet gateway
    * Private subnets have a route table entry to the NAT gateway for internet access
    * VPC endpoints are available for internal services to avoid traversing the public internet
    * VPC flow logs capture traffic for audit and analytic purposes
    * Network Access Control Lists (NACLs) are present for security but are mostly open in this setup
*  The peering module establishes peering between VPCs. Peering allows the VPCs to communicate with each other as if they were on the same network without using a public internet connection.


## Video

The video tutorial will walk you through setting up a VPC for a core and dev environment and then peering the two.

<div style="padding:64.9% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861347512?h=a888cc245a&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="Network Module"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Architecture

The following diagram illustrates what is deployed by the VPC module. The peering module connects different VPCs.

- Multiple availability zones within the VPC, each containing public and private subnets.
- A route table includes entries that directs private and public subnet traffic to the internet via the  internet gateway.
- For cost-saving purposes, some services are kept on private subnets to avoid traversing the public side. Traffic to certain AWS services through the net gateway increases cost.
- VPC endpoints provided by AWS for services like S3 avoid public endpoints and save cost. VPC flow logs enabled to capture incoming traffic for analytic and audit purposes.
- Network Access Control List (NACL) is initially open, but can be used to control access. NACL serves as an additional layer of security within the VPC setup.

![Diagram of VPC Module Architecture](https://assets.redesignhealth.com/W1yl74bpSBnMjjvSMJXlA4Vrg0IuPJSrFbEg1eXO/vpc-module.png)

-



## High-Level Process

This section provides a high-level overview of the steps for deploying the Network module. Review the video and the **tf-modules** and **tf-infrastructure** for more information.

### Setting up the VPC

1. Update the VPC reusable module in **tf-modules/network/vpc** folder as needed.
    1. Review the contents of the **main.tf** file to define options for your VPC, DHCP, HCP, default NACLs, and so on and update as necessary.
    2. Specify the number of availability zones in the **locals.tf** module.
    3. Review the **subnet.tf** file and update as necessary.
2. Deploy your changes by using the 'terraform init' and 'terraform apply' commands.
3. Update the VPC parent module in **tf-infrastructure/core/network/vpc** folder as needed.
   1. Review the contents of the **main.tf** file and update as needed to update your requestor and accessor.
   2. Update other environments (dev) as needed.


### Setting up peering

1. Update the Peering reusable module in **tf-modules/network/peering** folder as needed.
   1. Update the **main.tf** file to specify requestors or acceptors modules as needed for your use case.
   2. Deploy your changes by using the 'terraform init' and 'terraform apply' commands.
2. Update the Peering parent module in the **tf-infrastructure/dev/network/peering** folder as needed.
   1. Update the **main.tf** file to reflect your company and needs.


### Viewing peering connections

1. Open the Amazon VPC console at https://console.aws.amazon.com/vpc/.
2. In the navigation pane, choose **Peering Connections**.
3. The peering connections that are available in your account are displayed in the list.

From here, you can click on a specific peering connection to view its details, including the IDs of the VPCs involved, the status of the connection, and any route tables associated with the connection.

![Peering Connections](https://assets.redesignhealth.com/image/2d55a88d6808202aed631e468e8f0e540ed0830f.png)



## Related Information

*  [Amazon Virtual Private Cloud](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html)
*  [Peering Connections](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html)
