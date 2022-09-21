#!/bin/sh

docker-compose stop graphql-engine;
echo "drop database moped;" | docker exec -i geometry_prototype_postgis_1 psql -U moped postgres;
echo "create database moped;" | docker exec -i geometry_prototype_postgis_1 psql -U moped postgres;
echo "create extension postgis;" | docker exec -i geometry_prototype_postgis_1 psql -U moped moped;
cat create_prototype.sql | docker exec -i geometry_prototype_postgis_1 psql -U moped moped;
docker-compose start graphql-engine;
