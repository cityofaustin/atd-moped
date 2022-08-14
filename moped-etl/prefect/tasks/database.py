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
def create_database(slug):
    basename = slug["database"]
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
def remove_database(slug):
    basename = slug["database"]
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
    name="Run populate DB with data bash command", stream_output=True
)


@task(name="Create populate database with data bash command")
def populate_database_with_data_command(slug, stage="staging"):
    basename = slug["database"]
    logger.info(f"Creating populate with {stage} data command for database {basename}")

    # Get Moped read replica details together
    replica_db_name = "atd_moped" if stage == "production" else "atd_moped_staging"
    replica_user = MOPED_READ_REPLICA_USER
    replica_password = MOPED_READ_REPLICA_PASSWORD
    replica_host = MOPED_READ_REPLICA_HOST
    dump_conn_string = f"postgres://{replica_user}:{replica_password}@{replica_host}:5432/{replica_db_name}"

    # Get the Moped test database details together
    test_user = DATABASE_USER
    test_password = DATABASE_PASSWORD
    test_host = DATABASE_HOST
    psql_conn_string = (
        f"postgres://{test_user}:{test_password}@{test_host}:5432/{basename}"
    )

    # Set up for the commands
    postgres_version = "12-alpine"

    dump_command = f"pg_dump -d {dump_conn_string} \
    --no-owner --no-privileges --verbose"

    psql_command = f"psql -d {psql_conn_string}"

    command = f"""
        docker pull postgres:{postgres_version}  &&
        docker run --rm postgres {dump_command} | docker run --rm -i postgres {psql_command}
    """

    return command


@task(name="Check if database exists")
def database_exists(slug):
    basename = slug["database"]

    logger.info(f"Checking if database {basename} exists")

    (pg, cursor) = connect_to_db_server()

    database_exists_sql = (
        f"SELECT EXISTS (SELECT FROM pg_database WHERE datname = '{basename}')"
    )
    cursor.execute(database_exists_sql)
    exists = cursor.fetchone()[0]

    # Commit changes and close connections
    cursor.close()
    pg.close()

    return exists
