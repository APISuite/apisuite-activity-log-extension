#!/usr/bin/env bash

echo ${DOCKER_PASS} | docker login --username ${DOCKER_USER} --password-stdin

HASH=$(git rev-parse --short HEAD)

docker build \
  -t cloudokihub/apisuite-activity-log-extension:$HASH \
  -t cloudokihub/apisuite-activity-log-extension:latest .

docker push cloudokihub/apisuite-activity-log-extension:$HASH
docker push cloudokihub/apisuite-activity-log-extension:latest


if [ "$CIRCLE_BRANCH" = "main" ]; then
  VERSION=$(cat package.json | grep version | head -1 | awk -F ": " '{ print $2 }' | sed 's/[",]//g')

  docker build -t cloudokihub/apisuite-activity-log-extension:$VERSION .
  docker push cloudokihub/apisuite-activity-log-extension:$VERSION
fi
