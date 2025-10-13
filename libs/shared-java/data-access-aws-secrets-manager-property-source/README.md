# AWS Secrets Manager PropertySource
This library provides a way to access AWS secrets the same way you'd access any property in Spring.

```java
@Value("${spring.datasource.password}")
private String databasePassword;
```

## Installing

### Authenticating with GitHub Packages
This package lives in [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages).
You'll need to [generate a personal access token (classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token#creating-a-personal-access-token-classic) with the `read:packages` scope and update your `~/.m2/settings.xml` file to search GitHub for this package.

Example `settings.xml` file:

```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                      http://maven.apache.org/xsd/settings-1.0.0.xsd">

  <activeProfiles>
    <activeProfile>github</activeProfile>
  </activeProfiles>

  <profiles>
    <profile>
      <id>github</id>
      <repositories>
        <repository>
          <id>central</id>
          <url>https://repo1.maven.org/maven2</url>
        </repository>
        <repository>
          <id>rh-design-library</id>
          <url>https://maven.pkg.github.com/redesignhealth/rh-design-library</url>
          <snapshots>
            <enabled>true</enabled>
          </snapshots>
        </repository>
      </repositories>
    </profile>
  </profiles>

  <servers>
    <server>
      <id>github</id>
      <username>USERNAME</username>
      <password>ACCESS_CODE</password>
    </server>
  </servers>
</settings>
```
- Replace `USERNAME` with your GitHub username
- Replace `ACCESS_CODE` with the generated personal access token

More info here: [Working with the apache maven registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-apache-maven-registry)

### Update pom.xml

Add the following to your `<dependencies>`
```xml
<dependency>
  <groupId>com.redesignhealth</groupId>
  <artifactId>aws-secrets-manager-property-source</artifactId>
  <version>1.0.0</version>
</dependency>
```

### Update to support GitHub Actions
You'll need to authenticate and inform GitHub Actions where to download this dependency from. There are many ways to do this but here is the simplest way I've found.

Add the following to your `<project>` in `pom.xml`

> This tells GitHub actions where to download the dependency from

```xml
<repositories>
  <repository>
    <id>github</id>
    <name>GitHub Packages from rh-design-library</name>
    <url>https://maven.pkg.github.com/redesignhealth/rh-design-system</url>
  </repository>
</repositories>
```

Before each `mvn` command that downloads dependencies, inject your `GITHUB_TOKEN`

```yml
- name: Build Project
  env:
    GITHUB_TOKEN: ${{ github.token }}
  run: mvn clean install
```

## AWS Configuration
Next, you'll create a secret in AWS Secret Manager. The secret will hold all the key/value that will map to Spring property key/values.

For instance, you can have a secret named `dev/company-api` with key values

| Key | Value |
|-----|-------|
| spring.datasource.password | secret_value |
| jira.apiKey | secret_value |


## Registering the PropertySource
Next, you'll register the PropertySource on app startup.

You'll need to provide the constructor with the following:
* `secret` - in this case `dev/company-api`
* `awsRegion` - the region you created the secret in
* `objectMapper` - you can either use an already defined objectMapper or create one yourself

```java
@SpringBootApplication
public class Application {
  public static void main(String[] args) {
      new SpringApplicationBuilder()
              .sources(Application.class)
              .initializers(
                      context -> {
                          // initialize secret properties before beans are initialized
                          var env = context.getEnvironment();
                          var secretId = env.getProperty("aws.secret.name");
                          var region = env.getProperty("aws.region", "us-east-1");
                          AwsSecretsManagerPropertySource propertySource =
                                  new AwsSecretsManagerPropertySource(
                                          secretId, Region.of(region), new ObjectMapper());
                          env.getPropertySources().addLast(propertySource);
                      })
              .run(args);
  }
}
```

## Troubleshooting
You might receive some of the following issues on startup

> Unable to retrieve secrets from AWS Secrets Manager. Secrets Manager can't find the specified secret. (Service: SecretsManager, Status Code: 400, Request ID: d97885f4-5165-4799-92cd-b12b39486307)

This means the `secret` you provided didn't match one in Secrets Manager. You might have provided the wrong `secret` or `awsRegion`

>  Unable to retrieve secrets from AWS Secrets Manager. The security token included in the request is invalid. (Service: SecretsManager, Status Code: 400, Request ID: ce56b1e5-a3c6-41c6-aa6c-16cc46cbcb78)

Your credentials in `~/.aws/credentials` are invalid. You might have forgotten to put your credentials under the `[default]` profile or your credentials expired.


## Releases

When making a PR, update the following
1. pom.xml
```bash
$ mvn versions:set -DnewVersion=VERSION
```
2. README.md under [Update pom.xml](#update-pomxml)
```xml
<dependency>
  <groupId>com.redesignhealth</groupId>
  <artifactId>aws-secrets-manager-property-source</artifactId>
  <version>VERSION</version>
</dependency>
```
