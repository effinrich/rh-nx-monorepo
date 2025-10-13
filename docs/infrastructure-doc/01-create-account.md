# Account Creation

This section describes how to use the AWS Control Tower to create an organization unit (OU) and an account for that OU.

Amazon Control Tower is a service provided by AWS that allows for centralized management of multiple AWS accounts. The video for this section demonstrates how to create a new OU called "production" and how to create a new account underneath it.

It also explains how to use plus addressing for each account to centrally manage all the accounts and the importance of setting up MFA for the root user login and how to add new accounts to the Control Tower management.

Pre-populated OUs include one for core shared services, development, staging, QA, production, and default security accounts for logging, governance, and auditing.

## Video

<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/861331986?h=50ab086f94&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="AWS Account Creation"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>

## Steps

AWS Control Tower is a powerful tool that enables centralized management of multiple AWS accounts.

Pre-populated OUs can include one for:

* core shared services
* development
* staging
* QA
* production

It also includes default security accounts for logging, governance, and auditing. These pre-populated OUs help you get started quickly and provide a solid foundation for your AWS environment. By following these steps, you can create an OU and an account for that OU in AWS Control Tower, allowing for centralized management of multiple AWS accounts.

1. Log in to the AWS Management Console and navigate to the AWS Control Tower dashboard.
2. In the left-hand navigation pane, click **Organizational units**.
3. Click on the **Create organizational unit** button.
4. Enter a name for the OU (for example, **production**).
5. Click **Create** to create the new OU.
6. After the OU is created, click on it to view its details.
7. Click on the **Accounts** tab.
8. Click on the **Create account** button.
9. Fill out the form to create a new account. You will need to provide information such as the account name, email address, and password.
10. Use plus addressing for each account to centrally manage all the accounts. For example, you could create email aliases like **account1+production@mycompany.com** and **account2+production@mycompany.com** to differentiate between accounts.
11. Make sure to set up multi-factor authentication (MFA) for the root user login to ensure the security of your AWS environment.
12. After the new account is created, it will be automatically added to the Control Tower management.

## Related Information

* [Amazon Control Tower](https://aws.amazon.com/controltower/?)



