#!/bin/bash

docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml stop hasura
echo "drop database moped;" | docker exec -i moped-database_moped-pgsql_1 psql -U moped postgres
echo "create database moped;" | docker exec -i moped-database_moped-pgsql_1 psql -U moped postgres
echo "create extension postgis;" | docker exec -i moped-database_moped-pgsql_1 psql -U moped moped

cat 2022_09_14_08_26.moped.sql | docker exec -i moped-database_moped-pgsql_1 psql -U moped moped
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml stop hasura
