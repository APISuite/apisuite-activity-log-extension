# API Suite - Activity Log Extension

This repository contains an extension to APISuite Core that provides a backend for the activity log feature.

Simply put, this is a Node.js app that listens to some events 
published in the APISuite Core's message queue and stores them in a configurable data store.

A (read only) REST API will be available for querying such logs. 

## Consumer & Server

There are two main components in this project:
- consumer: listens/consumes messages from a RabbitMQ topic and writes the to a data store
- server: simple REST API served over HTTP

These are separated because one should ideally execute them in separate processes/machines/environments
to avoid performance degradation between them.

## Docker

A single Dockerfile for both components. This Dockerfile has a `npm run` entrypoint, which allows one
to choose which command to run when starting a container.

Examples:
```
docker build -t actlog .

docker run --env-file .env -p 6006:6006 --network=apisuite-net actlog start-server
docker run --env-file .env --network=apisuite-net actlog start-consumer
```

## Requirements

### Database

A database will be used to store events/logs. Support for multiple databases will be gradually added.

#### PostgreSQL

Required schema for the activity log:

```
CREATE TABLE logs (
    type TEXT,
    user_id TEXT,
    app_id TEXT,
    organization_id TEXT,
    log TEXT,
    timestamp TIMESTAMP
);

CREATE INDEX idx_logs_user_id ON logs (type);
CREATE INDEX idx_logs_user_id ON logs (user_id);
CREATE INDEX idx_logs_app_id ON logs (app_id);
CREATE INDEX idx_logs_organization_id ON logs (organization_id);
CREATE INDEX idx_logs_timestamp ON logs (timestamp asc);
```


## Development

`package.json` contains the necessary scripts and dependencies to run the components of this project.
Typescript is configured to produce source maps, which makes debugger usage possible.

Setup your database according to the instructions provided in this document.

### Environment variables

All variables used in code are documented in `src/config/schema.js`.