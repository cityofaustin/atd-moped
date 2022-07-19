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


# Create a database in the test RDS
@task
def create_database(database_name):
    logger.info(f"Creating database {database_name}")
    (pg, cursor) = connect_to_db_server()

    create_database_sql = f"CREATE DATABASE {database_name}".format(database_name)
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
        database=database_name,
    )
    db_cursor = db_pg.cursor()

    # Add Postgis extension
    create_postgis_extension_sql = "CREATE EXTENSION postgis"

    db_cursor.execute(create_postgis_extension_sql)

    # Commit changes and close connections
    db_pg.commit()
    db_cursor.close()
    db_pg.close()


# Remove database when we are done
@task
def remove_database(database_name):
    logger.info(f"Removing database {database_name}".format(database_name))
    (pg, cursor) = connect_to_db_server()

    drop_database_sql = f"DROP DATABASE IF EXISTS {database_name}".format(database_name)
    cursor.execute(drop_database_sql)

    # Commit changes and close connections
    pg.commit()
    cursor.close()
    pg.close()


# pg_dump command
# pg_restore command
# Use Shell task, docker pg image and run psql
@task
def populate_database_with_production_data(database_name):
    logger.info(
        f"Populating {database_name} with production data".format(database_name)
    )
