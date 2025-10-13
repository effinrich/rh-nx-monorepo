# Prometheus Server

This server is meant to work in concert with [AWS Managed Prometheus](https://docs.aws.amazon.com/prometheus/latest/userguide/AMP-onboard-ingest-metrics.html).

AWS Managed Prometheus requires us to have our own Prometheus server that [remote writes](https://prometheus.io/docs/practices/remote_write/) to
AWS Managed Prometheus.

## Running Locally

### Requirements

- Docker
- Your AWS Credentials must allow for Remote Write to AWS Managed Prometheus

### Generate a template

We have scripts per AWS Managed Prometheus. Currently we are looking to have one per AWS
account but this may change. Each command generates a `prometheus.yml` file with
the services we are looking to pull metrics from and remote write to.

> Prometheus does not support environment variables in their configuration files. If that was allowed, we could remove these scripts.

Use the nx `build:AWS_ACCOUNT` target to genereate a `prometheus.yml`, where `AWS_ACCOUNT` represents `core`, `dev`, `prod` etc.

```bash
$ npx nx build:core prometheus
```

### Build Docker Image

```bash
$ docker build -t prometheus .
```

### Run

```bash
$ docker run -p 9090:9090 prometheus
```
