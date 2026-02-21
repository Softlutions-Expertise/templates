#!/bin/bash

# Running Migrations
echo "Running Migrations"
npm run migration:up

exec "$@"
