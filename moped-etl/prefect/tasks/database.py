import os

import prefect
from prefect import task
from prefect.tasks.shell import ShellTask

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DATABASE_HOST = os.environ["MOPED_TEST_HOSTNAME"]
DATABASE_USER = os.environ["MOPED_TEST_USER"]
DATABASE_PASSWORD = os.environ["MOPED_TEST_PASSWORD"]
MOPED_READ_REPLICA_HOST = os.environ["MOPED_READ_REPLICA_HOST"]
MOPED_READ_REPLICA_USER = os.environ["MOPED_READ_REPLICA_USER"]
MOPED_READ_REPLICA_PASSWORD = os.environ["MOPED_READ_REPLICA_PASSWORD"]

MOPED_READ_REPLICA_HOST

# set up the prefect logging system
logger = prefect.context.get("logger")

# Connect to database server and return psycopg2 connection and cursor
def connect_to_db_server():
    pg = psycopg2.connect(
        host=DATABASE_HOST, user=DATABASE_USER, password=DATABASE_PASSWORD
    )
    # see https://stackoverflow.com/questions/34484066/create-a-postgres-database-using-python
    pg.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = pg.cursor()

    return (pg, cursor)


@task(name="Create database in the test RDS")
def create_database(basename):
    logger.info(f"Creating database {basename}")

    (pg, cursor) = connect_to_db_server()

    create_database_sql = f"CREATE DATABASE {basename}"
    cursor.execute(create_database_sql)

    # Commit changes and close connections
    pg.commit()
    cursor.close()
    pg.close()

    # Make a fresh connection to the new DB so we can update it
    db_pg = psycopg2.connect(
        host=DATABASE_HOST,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        database=basename,
    )
    db_cursor = db_pg.cursor()

    # Add Postgis extension
    create_postgis_extension_sql = "CREATE EXTENSION postgis"

    db_cursor.execute(create_postgis_extension_sql)

    # Commit changes and close connections
    db_pg.commit()
    db_cursor.close()
    db_pg.close()


@task(name="Remove database from the test RDS")
def remove_database(basename):
    logger.info(f"Removing database {basename}")

    (pg, cursor) = connect_to_db_server()

    disconnect_other_users_sql = f"""
    SELECT
	    pg_terminate_backend(pg_stat_activity.pid)
    FROM
	    pg_stat_activity
    WHERE
	    pg_stat_activity.datname = '{basename}'
	    AND pid <> pg_backend_pid();
    """
    cursor.execute(disconnect_other_users_sql)

    drop_database_sql = f"DROP DATABASE IF EXISTS {basename}"
    cursor.execute(drop_database_sql)

    # Commit changes and close connections
    pg.commit()
    cursor.close()
    pg.close()


populate_database_with_data_task = ShellTask(
    name="Run populate DB with data bash command", stream_output=True, return_all=True
)

# pg_dump command
# pg_restore command
# Use Shell task, docker pg image and run psql
@task
def populate_database_with_data_command(basename, stage="staging"):
    logger.info(f"Creating populate with {stage} data command for database {basename}")

    database_name = "atd_moped" if stage == "production" else "atd_moped_staging"
    user = MOPED_READ_REPLICA_USER
    password = MOPED_READ_REPLICA_PASSWORD
    host = MOPED_READ_REPLICA_HOST
    version = "12-alpine"

    dump_command = f"pg_dump -d postgres://{user}:{password}@{host}:5432/{database_name} \
    --no-owner --no-privileges --verbose > moped_{stage}.sql"

    command = f"""
        docker pull postgres:{version} &&
        docker run postgres {dump_command} &&
        ls
    """

    # pg_dump -h moped-read-replica.austinmobility.io --no-owner --no-privileges --verbose -U dilleym -d atd_moped_staging -f moped_test_staging.sql

    return command
