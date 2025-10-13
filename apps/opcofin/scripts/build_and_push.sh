#!/bin/bash

# Any subsequent(*) commands which fail will cause the shell script to exit immediately
set -e

# Return exit status of last command
set -o pipefail

# Create image tag with current date up to the second
TAG=$(date +%Y%m%d%H%M%S)
REPOSITORY=082533342824.dkr.ecr.us-east-1.amazonaws.com/opcofin
BUILD_PLATFORMS=linux/amd64,linux/arm64

# Login to AWS ECR with docker
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $REPOSITORY

# Build and push amd64 and arm64 architecture
docker buildx build --platform $BUILD_PLATFORMS -t $REPOSITORY:$TAG --push .

# Tag image architecture variations, since they appear as untagged in ECR
# https://stackoverflow.com/questions/68790184/tagging-multi-platform-images-in-ecr-creates-untagged-manifests
docker buildx build --platform "linux/amd64" --tag $REPOSITORY:$TAG-amd --push  .
docker buildx build --platform "linux/arm64" --tag $REPOSITORY:$TAG-arm --push  .

# Check to see if architecture versions are present
docker buildx imagetools inspect $REPOSITORY:$TAG

echo "Image builds ($BUILD_PLATFORMS successfully built and pushed to $REPOSITORY:$TAG"
