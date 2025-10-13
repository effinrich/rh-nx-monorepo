# DNS and ACM Modules

This section describes how to set up and configure modules for the Domain Naming Service (DNS) and AWS Certificate Management (ACM).

- The DNS module is used to set up private and public hosted zones, with subdomains such as core, dev, staging, and prod, which are associated with a top-level domain. The private hosted zone allows for split-view DNS resolution, where DNS records can be created for private applications only accessible within a VPC.

- The ACM module is used to manage SSL/TLS certificates for a domain, allowing secure communication with clients. These modules can be automated with Terraform for authorization and association between VPCs.


## Videos

<div style="padding:62.57% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861356344?h=f622e0c7c5&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="DNS and ACM Modules"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## High-Level Process

This section provides a high-level overview of the steps for deploying the DNS and ACM modules. Review the video and the **tf-modules** and **tf-infrastructure** for more information.

### Setting up your DNS module configuration

1. Review the DNS module in the **tf-modules** repository.
    1. Review the **main.tf** file in the **tf-modules/dns** folder. It deploys private and public hosted zones and the records in each zone. Note that you can create a private hosted zone for domains that you want to be accessible only within this instance of the virtual private cloud (VPC) and not externally. You must be on VPN to access things in a private hosted zone.
    2. Make changes as needed for your use case.
2. To deploy to the **core** account, navigate  the **tf-infrastructure** repository.
     1. Review the contents of the **core/dns/main.tf** file and make changes as necessary. Repeat for the dev account.
     2. Run the `terraform init` and `terraform apply` command for each environment.
3. Review the public and private hosted zones in the AWS console:
     1. Log in to your AWS account and navigate to the Route 53 console.
     2. To view public hosted zones, select **Hosted zones** from the left-hand navigation pane. This will display a list of all the public hosted zones in your account.
     3. To view private hosted zones, select **Private hosted zones** from the left-hand navigation pane. This will display a list of all the private hosted zones in your account.

**Note:** To view hosted zones in the AWS console, you need to have the necessary permissions and access to the Route 53 resources in your account. Additionally, private hosted zones are only visible within your Amazon VPC, so you need to ensure that you are logged in to the correct VPC to view them in the console.

### Setting up your ACM module configuration

You must deploy the DNS module first. The ACM module generates a certificate and then validates the certificate and the domain by creating a text record within the hosted zone itself.

1. Review the ACM module in the **tf-modules** repository.
    1. Review **acm/main.tf** file.
    2. Make changes as needed.
2. Review the ACM module in the **tf-infrastructure** repository.
    1. Review **core/acm/main.tf** to review for **core** account.
    2. Make changes as needed.
3. Deploy the core changes by issuing the `terraform init` and `terraform apply` commands on the core account.
4. Review the certificates in the AWS Console.
    1. Log in to the AWS Management Console and navigate to the ACM console.
    2. In the left navigation pane, choose **Certificates**.

         The **Certificates** page will list the certificates that have been issued or imported into ACM in your AWS account.

         Note that you can use the search bar to search for a specific certificate by entering its name, domain name, or ARN (Amazon Resource Name).

     3. To view the details of a certificate, click on the certificate name or ARN in the list. On the **Certificate Detail** page, you can see the certificate's status, validation method, domain names, expiration date, and other details.

5. Repeat steps 2 and 3 for the **dev** account.

## Related Information

* [Route 53](https://aws.amazon.com/route53/)
* [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/)

