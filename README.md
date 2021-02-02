# API Suite - Activity Log Extension

This repository contains an extension to APISuite Core that provides a backend for the activity log feature.

Simply put, this is a Node.js app that listens to some events 
published in the APISuite Core's message queue and stores them in a configurable data store.

A (read only) REST API will be available for querying such logs. 

## Requirements

### Database

A database will be used to store events/logs. Support for multiple databases will be gradually added.