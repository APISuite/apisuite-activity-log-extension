# API Suite - Activity Log Extension

This repository contains an extension to APISuite Core that provides a backend for the activity log feature.

Simply put, this is a Node.js app that listens to some events 
published in the APISuite Core's message queue and stores them in a configurable data store.

A (read only) REST API will be available for querying such logs. 

## Requirements

### Database

A database will be used to store events/logs. Support for multiple databases will be gradually added.

#### PostgreSQL

Required schema for the activity log:

```
CREATE TABLE logs (
    user_id TEXT,
    app_id TEXT,
    organization_id TEXT,
    log TEXT,
    timestamp TIMESTAMP
);

CREATE INDEX idx_logs_user_id ON logs (user_id);
CREATE INDEX idx_logs_app_id ON logs (app_id);
CREATE INDEX idx_logs_organization_id ON logs (organization_id);
CREATE INDEX idx_logs_timestamp ON logs (timestamp asc);
```