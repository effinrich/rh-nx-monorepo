# WAF Module

This section explains the WAF module, which is a web application firewall (WAF) service designed to protect applications and workloads at the ingress layer. It filters incoming traffic through customized rules, such as protection against common vulnerabilities like cross-site scripting and SQL injection.

The WAF module can be mapped to load balancers, CloudFront, or API gateways, and it can be customized with hundreds of rules. This section also shows how to deploy the WAF module and how to access and customize the rules.

Finally, it emphasizes the importance of monitoring logs and tweaking rules to avoid false positives and optimize the protection.

## Video

<div style="padding:64.9% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861351614?h=50ca2a83aa&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="WAF Module"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Architecture

The following diagram illustrates what is deployed through the WAF module.

WAF  filters incoming traffic before reaching load balancers, cloud front distributions, or API gateways. Various rules within WAF are designed to filter out malicious traffic, including bad bots, cross-site scripting, SQL injection, and more.

![WAF Module Architecture](https://assets.redesignhealth.com/pt3yBOlSFtYTQCNFzYU1bNJWqCkfGeIbvbBCiIgl/waf-architecture.png)

## High-Level Process

This section provides a high-level overview of the steps for deploying the WAF module. Review the video and the **tf-modules** and **tf-infrastructure** for more information.

1. Review the rules in the WAF module in the **tf-modules** repository.
    1. Open the **wafv2/main.tf** file. This includes the preliminary rules that have been set up by default to protect you against common vulnerabilities. Note that the module is using the latest version of AWS WAF (not classic) to increase the number of rules that can be added.
    2. Make changes as needed.
2. Deploy the rules to the dev and core accounts by using the `terraform init` and `terraform apply` commands.
3. Review your rules in the AWS Console.
    1. Log in to your AWS account and navigate to the **WAF & Shield** console.
    2. Select the WAF that you want to view the rules for.
    3. In the left-hand navigation pane, select **Rules**. This will display a list of all rules associated with your WAF. You can select a rule to view its details, including the conditions and actions that it applies.
4. Use CloudFront to review the logs to see the results of the rules.



## Related Information

* [AWS WAF](https://aws.amazon.com/waf/)
* [Rules](https://aws.amazon.com/waf/)
