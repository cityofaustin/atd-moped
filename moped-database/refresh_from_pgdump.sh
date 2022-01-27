
# restore to pre-work state
./hasura-cluster stop;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml stop;
docker container prune -f;
docker volume rm moped-database_moped-db-vol -f;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml up -d moped-pgsql;
sleep 5;
docker exec -i moped-database_moped-pgsql_1 psql -U moped < ./staging_moped_dump.sql;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml up -d hasura;
sleep 15;
echo -ne '\007'; # beep
hasura console;




# find problems in seed file technique
./hasura-cluster stop;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml stop;
docker container prune -f;
docker volume rm moped-database_moped-db-vol -f;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml up -d moped-pgsql;
sleep 5;
docker-compose -f ./docker-compose.yml -f docker-compose.arm64.yml up -d hasura;
sleep 15;
hasura migrate apply;
hasura metadata apply;
docker exec -i moped-database_moped-pgsql_1 psql -v ON_ERROR_STOP=1 -U moped < ./seeds/1602292389297_initial_seed_staging.sql
echo -ne '\007'; # beep