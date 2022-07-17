#!/usr/bin/env python

"""
Name: Moped Editor Test Instance Deployment
Description: Build and deploy the resources needed to test
    a feature branch of the Moped Editor application
Schedule: TBD
Labels: TBD
"""

# import python standard library packages
import os

# import pypi packages
import prefect
import psycopg2

# import package components
from prefect import Flow, task
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

from tasks.ecs import *


# Import and setup argparse.
# This is intended to aid development and will be removed prior to PRing torward main.
import argparse

parser = argparse.ArgumentParser(
    description="Prefect flow for Moped Editor Test Instance Deployment"
)
parser.add_argument("-m", "--mike", help="Run Mike's tasks", action="store_true")
parser.add_argument("-f", "--frank", help="Run Frank's tasks", action="store_true")
args = parser.parse_args()


# setup some global variables from secrets. presently these are coming out of the environment,
# but this will be modified to the prefect KV store system when they are set in stone.

# AWS credentials
AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]

# Database connection parameters
DATABASE_HOST = os.environ["MOPED_TEST_HOSTNAME"]
DATABASE_USER = os.environ["MOPED_TEST_USER"]
DATABASE_PASSWORD = os.environ["MOPED_TEST_PASSWORD"]

# set up the prefect logging system
logger = prefect.context.get("logger")

# Database Tasks

# Frontend:
# 1. When feature PR is opened, a deploy preview spins up and is linked in PR
# 2. Env vars are available to introspect PR # and context (CONTEXT = deploy-preview)
#    https://docs.netlify.com/configure-builds/environment-variables/?utm_campaign=devex-tzm&utm_source=blog&utm_medium=blog&utm_content=env-vars&_gl=1%2agvssna%2a_gcl_aw%2aR0NMLjE2NTQ1NDAxNzcuQ2p3S0NBand5X2FVQmhBQ0Vpd0EySUhIUUFud3NXc1ltbXJybGs5SnVfWTJlazlkUF9hVmM4WVZuTjR5Zk5QR0Y2U2ZOLTMycl93ekFCb0M2Y0lRQXZEX0J3RQ..&_ga=2.210432213.1131530997.1654540177-2032963523.1654540177&_gac=1.123937528.1654540177.CjwKCAjwy_aUBhACEiwA2IHHQAnwsWsYmmrrlk9Ju_Y2ek9dP_aVc8YVnN4yfNPGF6SfN-32r_wzABoC6cIQAvD_BwE#read-only-variables

# Considerations:
# 1. Auth (use staging user pool) needs a callback URL set in the user pool. How does this work
#    for the deploy previews? (I know that we can't use SSO)
#    - Just do whatever deploy previews do for auth

# Questions:
# 1. What S3 bucket does current moped-test use for file uploads?
#    - Extend directories in S3 bucket to keep files for each preview app

# Connect to database server and return psycopg2 connection and cursor
def connect_to_db_server():
    pg = psycopg2.connect(
        host=DATABASE_HOST, user=DATABASE_USER, password=DATABASE_PASSWORD
    )
    # see https://stackoverflow.com/questions/34484066/create-a-postgres-database-using-python
    pg.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = pg.cursor()

    return (pg, cursor)


# Database and GraphQL engine tasks
@task
def create_database(database_name):
    logger.info(f"Creating database {database_name}".format(database_name))
    # Stretch goal: replicate staging data
    # Via Frank:
    # 1. Populate with seed data
    # 2. OR populate with staging data
    (pg, cursor) = connect_to_db_server()

    create_database_sql = f"CREATE DATABASE {database_name}".format(database_name)
    cursor.execute(create_database_sql)

    # Commit changes and close connections
    pg.commit()
    cursor.close()
    pg.close()

    # Connect to the new DB so we can update it
    db_pg = psycopg2.connect(
        host=DATABASE_HOST,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        database=database_name,
    )
    db_cursor = db_pg.cursor()

    # Add Postgis extension
    create_postgis_extension_sql = "CREATE EXTENSION postgis"

    # db_cursor.execute(disable_jit_sql)
    db_cursor.execute(create_postgis_extension_sql)

    # Commit changes and close connections
    db_pg.commit()
    db_cursor.close()
    db_pg.close()


# Need to set when database is removed
@task
def remove_database(database_name):
    logger.info(f"Removing database {database_name}".format(database_name))

    (pg, cursor) = connect_to_db_server()

    create_database_sql = f"DROP DATABASE IF EXISTS {database_name}".format(
        database_name
    )
    cursor.execute(create_database_sql)

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


# ECS Tasks


# Lambda & SQS tasks


@task
def create_activity_log_sqs():
    # Use boto3 to create SQS
    logger.info("creating activity log SQS")
    return True


@task
def create_activity_log_lambda():
    # Use boto3 to create activity log event lambda
    logger.info("creating activity log Lambda")
    return True


@task
def remove_activity_log_sqs():
    # Use boto3 to remove SQS
    logger.info("removing activity log SQS")
    return True


@task
def remove_activity_log_lambda():
    # Use boto3 to remove activity log event lambda
    logger.info("removing activity log Lambda")
    return True


# Moped API tasks


@task
def create_moped_api():
    # Deploy moped API using Zappa or the CloudFormation template that it generates
    logger.info("creating Moped API Lambda")
    return True


@task
def remove_moped_api():
    # Remove CloudFormation stack that create_moped_api deployed with boto3
    return True


# The Flow itself


with Flow("Create Moped Environment") as flow:
    # Calls tasks
    logger.info("Calling tasks")

    if args.mike:
        # Env var from GitHub action?
        database_name = os.environ["MOPED_TEST_DATABASE_NAME"]
        create_database(database_name)
        remove_database(database_name)

    if args.frank:
        basename = "flh-test-ecs-cluster"

        # cluster = {'cluster': {'clusterName': basename}}
        # remove_ecs_cluster(cluster)

        cluster = create_ecs_cluster(basename=basename)
        target_group = create_target_group(basename=basename)
        load_balancer = create_load_balancer(basename=basename)
        dns_request = create_route53_cname(
            basename=basename, load_balancer=load_balancer
        )
        dns_status = check_dns_status(dns_request=dns_request)
        tls_certificate = create_certificate(basename=basename, dns_status=dns_status)
        certificate_validation_parameters = get_certificate_validation_parameters(
            tls_certificate=tls_certificate
        )
        validation_record = add_cname_for_certificate_validation(
            parameters=certificate_validation_parameters
        )
        issued_certificate = wait_for_valid_certificate(
            validation_record=validation_record, tls_certificate=tls_certificate
        )
        listeners = create_load_balancer_listener(
            load_balancer=load_balancer,
            target_group=target_group,
            certificate=issued_certificate,
        )
        task_definition = create_task_definition(basename=basename)
        service = create_service(
            basename=basename,
            load_balancer=load_balancer,
            task_definition=task_definition,
        )

        # TODO: These removal tasks should each be modified to take either the response object or the name of the resource
        # remove_task_definition = remove_task_definition(task_definition)
        # remove_load_balancer(load_balancer)
        # remove_ecs_cluster(cluster)


if __name__ == "__main__":
    flow.run()
