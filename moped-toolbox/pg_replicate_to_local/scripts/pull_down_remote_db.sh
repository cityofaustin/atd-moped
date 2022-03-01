#!/bin/sh

echo "Downloading remote DB"
pg_dump --verbose --no-owner > /root/workspace/heroku_db.sql
