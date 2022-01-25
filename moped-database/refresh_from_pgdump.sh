#!/bin/sh

docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml stop;
docker container prune -f;
docker volume rm moped-database_moped-db-vol -f;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml up -d moped-pgsql;
sleep 15;
docker exec -i moped-database_moped-pgsql_1 psql -U moped < ./moped_dump.sql;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml up -d hasura;
sleep 15;
hasura console;