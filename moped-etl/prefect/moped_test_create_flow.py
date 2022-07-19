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
from prefect.run_configs import UniversalRun


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
parser.add_argument("-p", "--provision", help="Provision", action="store_true")
parser.add_argument("-d", "--decomission", help="Decomission", action="store_true")
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


with Flow(
    "Moped Test ECS Decommission",
    # Observation! The hex key of the container is from the build context!!
    # You can use this as a userful key to associate a state of the code and an environmental state!
    run_config=UniversalRun(labels=["moped", "86abb570f4c3"]),
) as ecs_decommission:

    basename = "flh-test-ecs-cluster"

    set_count_at_zero = set_desired_count_for_service(basename=basename, count=0)

    tasks = list_tasks_for_service(basename=basename)

    stop_token = stop_tasks_for_service(
        basename=basename, tasks=tasks, zero_count_token=set_count_at_zero
    )

    drained_service = wait_for_service_to_be_drained(
        basename=basename, stop_token=stop_token
    )

    no_listeners = remove_all_listeners(basename=basename)

    no_target_group = remove_target_group(
        basename=basename, no_listener_token=no_listeners
    )

    no_service = delete_service(
        basename=basename,
        drained_token=drained_service,
        no_target_group_token=no_target_group,
    )

    no_cluster = remove_ecs_cluster(basename=basename, no_service_token=no_service)

    removed_load_balancer = remove_load_balancer(
        basename=basename, no_cluster_token=no_cluster
    )

    removed_hostname = remove_route53_cname(
        basename=basename, removed_load_balancer_token=removed_load_balancer
    )

    removed_certificate = remove_certificate(
        basename=basename, removed_hostname_token=removed_hostname
    )


with Flow(
    "Moped Test ECS Commission",
    run_config=UniversalRun(labels=["moped", "86abb570f4c3"]),
) as ecs_commission:

    basename = "flh-test-ecs-cluster"

    cluster = create_ecs_cluster(basename=basename)

    load_balancer = create_load_balancer(basename=basename)

    target_group = create_target_group(basename=basename)

    dns_request = create_route53_cname(basename=basename, load_balancer=load_balancer)

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

    removed_cname = remove_route53_cname_for_validation(
        validation_record, issued_certificate
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
        target_group=target_group,
        listeners_token=listeners,
        cluster_token=cluster,
    )

if __name__ == "__main__":
    # ecs_decommission.run()
    # ecs_commission.run()

    ecs_decommission.register(project_name="Moped")
    ecs_commission.register(project_name="Moped")
