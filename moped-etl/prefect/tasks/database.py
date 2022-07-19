import os
import prefect

from prefect import task
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

DATABASE_HOST = os.environ["MOPED_TEST_HOSTNAME"]
DATABASE_USER = os.environ["MOPED_TEST_USER"]
DATABASE_PASSWORD = os.environ["MOPED_TEST_PASSWORD"]

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

    drop_database_sql = f"DROP DATABASE IF EXISTS {basename}"
    cursor.execute(drop_database_sql)

    # Commit changes and close connections
    pg.commit()
    cursor.close()
    pg.close()


# pg_dump command
# pg_restore command
# Use Shell task, docker pg image and run psql
@task
def populate_database_with_production_data(basename):
    logger.info(f"Populating {basename} with production data")
