#!/bin/sh

PLATFORM=$(uname -a | rev | cut -d " " -f1 | rev);

# bring down local graphql-engine service
docker-compose -f ../../moped-database/docker-compose.yml -f ../../moped-database/docker-compose.${PLATFORM}.yml stop hasura;

# use docker utility image to download remote DB
docker-compose up

echo "DROP DATABASE moped" | docker exec -i moped-database-moped-pgsql-1 psql -U moped postgres;
echo "CREATE DATABASE moped" | docker exec -i moped-database-moped-pgsql-1 psql -U moped postgres;
echo "CREATE EXTENSION postgis" | docker exec -i moped-database-moped-pgsql-1 psql -U moped moped;

# upgrading to pg v.13 provides the gen_random_uuid() function,
# otherwise, you need the following line and to cast the UUIDs into ::text in the exported SQL
#echo "CREATE EXTENSION pgcrypto" | docker exec -i moped-database-moped-pgsql-1 psql -U moped moped;

cat workspace/db.sql | docker exec -i moped-database-moped-pgsql-1 psql -U moped -v ON_ERROR_STOP=ON moped;
docker-compose -f ../../moped-database/docker-compose.yml -f ../../moped-database/docker-compose.${PLATFORM}.yml up -d hasura;
