# OpCoFin - "The NetSuite Service" - Deprecated

## Current

- Lay the right foundation of a service platform offering
- Push Overalls data to a FiveTran webhook endpoint quickly to support an OpCo Data Science effort

## Future

- Offer Overalls data in a REST API secured by platform IAM foundations

## Prereqs

- You will need a JDK17. Our favorite is Eclipse Temurin, also used by the container images we generate in the steps below.
- You will need Apache Maven 3.

## First time setup

Run this in `apps/opcofin` to generate `mvnw`:

```
% mvn -N wrapper:wrapper
```

Install emulation support:

```
docker run --privileged --rm tonistiigi/binfmt --install all
```

Create + use builder for multi archecture images:

```
docker buildx create --name x64arm64builder --driver docker-container --bootstrap
docker buildx use x64arm64builder
```

See also: https://docs.docker.com/build/building/multi-platform/

## Nx

- This is our first Java service in Nx. Everything you need to do runs from the repo root.
- Things should just work but file a bug with Matt when they don't!
- All the details of these Nx targets are in `apps/opcofin/project.json`.

Spring Boot plugin examples:

```
% nx run opcofin:build
% nx run opcofin:run
% nx run opcofin:test
```

Custom actions:

```
% nx run opcofin:docker
% nx run opcofin:build-and-push
```

## Create Task Defintion in ECS

To use a given image tag, create a new ECS task definition

Ensure that the task definition has the ENV variable `SPRING_ACTIVE_PROFILE` set to the right environment profile (`dev` or `prod`) so that the correct application-{env}.yaml file is used.
