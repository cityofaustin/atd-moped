#!/bin/sh

docker-compose -f ../../moped-database/docker-compose.yml -f ../../moped-database/docker-compose.arm64.yml stop hasura
echo "drop database moped;" | docker exec -i moped-database_moped-pgsql_1 psql -U moped postgres
echo "create database moped;" | docker exec -i moped-database_moped-pgsql_1 psql -U moped postgres
echo "create extension postgis;" | docker exec -i moped-database_moped-pgsql_1 psql -U moped moped

cat $1 | docker exec -i moped-database_moped-pgsql_1 psql -U moped moped
docker-compose -f ../../moped-database/docker-compose.yml -f ../../moped-database/docker-compose.arm64.yml up -d hasura
