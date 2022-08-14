#!/usr/bin/env python

"""
Name: Moped Editor Test Instance Deployment
Description: Build and deploy the resources needed to test
    a feature branch of the Moped Editor application
"""

# import python standard library packages
import time
import os
import platform
import re

# import pypi packages
import prefect

# import prefect components
from prefect import Flow, task, Parameter, case
from prefect.tasks.control_flow import merge

import tasks.ecs as ecs
import tasks.api as api
import tasks.database as db
import tasks.netlify as netlify
import tasks.activity_log as activity_log
import tasks.migrations as migrations

hostname = platform.node()

# setup some global variables from secrets. presently these are coming out of the environment,
# but this will be modified to the prefect KV store system when they are set in stone.

# AWS credentials
AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
GIT_REPOSITORY = os.environ["GIT_REPOSITORY"]

# set up the prefect logging system
logger = prefect.context.get("logger")


@task(name="Slug branch name")
def slug_branch_name(basename):
    underscore_basename = basename.replace("-", "_")
    database = re.search("^[\d_]*(.*)", underscore_basename).group(
        1
    )  # remove leading numbers
    internal_number_free_underscore_basename = "".join(
        [i for i in database if not i.isdigit()]
    )
    awslambda = internal_number_free_underscore_basename[0:16]

    slug = {"basename": basename, "database": database, "awslambda": awslambda}
    return slug


with Flow("Moped Test Instance Commission") as test_commission:
    branch = Parameter("branch")
    database_seed_source = Parameter("database_seed_source")

    slug = slug_branch_name(branch)

    ## Commission the database

    database_exists = db.database_exists(slug)

    with case(database_exists, True):
        remove_database = db.remove_database(slug=slug)

    ready_to_commission = merge(remove_database)

    create_database = db.create_database(
        slug=slug, upstream_tasks=[ready_to_commission]
    )

    populate_database_command = db.populate_database_with_data_command(
        slug=slug, stage=database_seed_source, upstream_tasks=[create_database]
    )

    populate_database = db.populate_database_with_data_task(
        command=populate_database_command
    )

    ## Commission the API

    # TODO: This needs to check to see if the api is deployed, and if so, reap it and redeploy
    secret_exists = api.check_secret_exists(slug=slug)

    with case(secret_exists, True):
        remove_api_config_secret_arn = api.remove_moped_api_secrets_entry(slug=slug)
    ready_for_secret = merge(remove_api_config_secret_arn)

    create_api_config_secret_arn = api.create_moped_api_secrets_entry(
        slug=slug, ready_for_secret=ready_for_secret
    )

    commission_api_command = api.create_moped_api_deploy_command(
        slug=slug, config_secret_arn=create_api_config_secret_arn
    )
    deploy_api = api.create_api_task(command=commission_api_command)

    api_endpoint = api.get_endpoint_from_deploy_output(deploy_api)

    ## Commission the ECS cluster
    # TODO: This needs to check, reap if needed, redeploy

    cluster = ecs.create_ecs_cluster(slug=slug)

    load_balancer = ecs.create_load_balancer(slug)

    target_group = ecs.create_target_group(slug)

    dns_request = ecs.create_route53_cname(slug=slug, load_balancer=load_balancer)

    dns_status = ecs.check_dns_status(dns_request=dns_request)

    tls_certificate = ecs.create_certificate(slug=slug, dns_status=dns_status)

    certificate_validation_parameters = ecs.get_certificate_validation_parameters(
        tls_certificate=tls_certificate
    )

    validation_record = ecs.add_cname_for_certificate_validation(
        parameters=certificate_validation_parameters
    )

    issued_certificate = ecs.wait_for_valid_certificate(
        validation_record=validation_record, tls_certificate=tls_certificate
    )

    removed_cname = ecs.remove_route53_cname_for_validation(
        validation_record, issued_certificate
    )

    has_listeners = ecs.count_existing_listeners(slug=slug, load_balancer=load_balancer)
    with case(has_listeners, False):
        no_listeners = ecs.remove_all_listeners(slug=slug)
    ready_for_listeners = merge(no_listeners)

    listeners = ecs.create_load_balancer_listener(
        load_balancer=load_balancer,
        target_group=target_group,
        certificate=issued_certificate,
        ready_for_listeners=ready_for_listeners,
    )

    task_definition = ecs.create_task_definition(slug=slug, api_endpoint=api_endpoint)

    graphql_engine_service = ecs.create_service(
        slug=slug,
        load_balancer=load_balancer,
        task_definition=task_definition,
        target_group=target_group,
        listeners_token=listeners,
        cluster_token=cluster,
    )

    graphql_endpoint_ready = ecs.check_graphql_endpoint_status(
        slug=slug, graphql_engine_service=graphql_engine_service
    )

    ## Commission the Netlify site

    build = netlify.trigger_netlify_build(slug=slug, api_endpoint_url=api_endpoint)
    netlify_is_ready = netlify.netlify_check_build(slug=slug, build_token=build)

    ## Commission the Activity Log

    commission_activity_log_command = activity_log.create_activity_log_command(
        slug=slug
    )
    deploy_activity_log = activity_log.create_activity_log_task(
        command=commission_activity_log_command
    )

    ## Apply migrations

    graphql_endpoint = "https://" + migrations.get_graphql_engine_hostname(slug=slug)

    access_key = migrations.get_graphql_engine_access_key(slug=slug)

    rm_clone = "rm -fr /tmp/atd-moped"
    cleaned = migrations.remove_moped_checkout(command=rm_clone)

    git_clone = f"git clone {GIT_REPOSITORY} /tmp/atd-moped"
    cloned = migrations.clone_moped_repo(command=git_clone, upstream_tasks=[cleaned])

    checkout_branch = migrations.get_git_checkout_command(slug=slug)
    checked_out = migrations.checkout_target_branch(
        command=checkout_branch, upstream_tasks=[cloned]
    )

    metadata = "metadata"

    config = migrations.create_graphql_engine_config_contents(
        graphql_endpoint=graphql_endpoint,
        access_key=access_key,
        metadata=metadata,
        checked_out_token=checked_out,
    )

    migrate_cmd = (
        "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check migrate apply;)"
    )
    migrate = migrations.migrate_db(
        command=migrate_cmd, upstream_tasks=[config, graphql_endpoint_ready]
    )

    metadata_cmd = (
        "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata apply;)"
    )
    metadata = migrations.apply_metadata(
        command=metadata_cmd, upstream_tasks=[migrate, graphql_endpoint_ready]
    )


with Flow("Moped Test Instance Decommission") as test_decommission:
    branch = Parameter("branch")
    slug = slug_branch_name(branch)

    # Reap Activity Log

    remove_activity_log_sqs = activity_log.remove_activity_log_sqs(slug=slug)

    remove_activity_log_lambda = activity_log.remove_activity_log_lambda(
        slug=slug, upstream_tasks=[remove_activity_log_sqs]
    )

    # Reap ECS

    set_count_at_zero = ecs.set_desired_count_for_service(slug=slug, count=0)

    tasks = ecs.list_tasks_for_service(slug=slug)

    stop_token = ecs.stop_tasks_for_service(
        slug=slug, tasks=tasks, zero_count_token=set_count_at_zero
    )

    drained_service = ecs.wait_for_service_to_be_drained(
        slug=slug, stop_token=stop_token
    )

    no_listeners = ecs.remove_all_listeners(slug=slug)

    no_target_group = ecs.remove_target_group(slug=slug, no_listener_token=no_listeners)

    no_service = ecs.delete_service(
        slug=slug, drained_token=drained_service, no_target_group_token=no_target_group
    )

    no_cluster = ecs.remove_ecs_cluster(slug=slug, no_service_token=no_service)

    removed_load_balancer = ecs.remove_load_balancer(
        slug=slug, no_cluster_token=no_cluster
    )

    removed_hostname = ecs.remove_route53_cname(
        slug=slug, removed_load_balancer_token=removed_load_balancer
    )

    removed_certificate = ecs.remove_certificate(
        slug=slug, removed_hostname_token=removed_hostname
    )

    # Reap API

    remove_api_config_secret_arn = api.remove_moped_api_secrets_entry(slug=slug)

    decommission_api_command = api.create_moped_api_undeploy_command(
        slug=slug, config_secret_arn=remove_api_config_secret_arn
    )
    undeploy_api = api.remove_api_task(command=decommission_api_command)

    # Reap Database

    database_exists = db.database_exists(slug)

    # be sure that the graphql-engine instance is shut down so it can't hold this resource open via a connection
    with case(database_exists, True):
        remove_database = db.remove_database(slug)


if __name__ == "__main__":
    branch = "unify-flows"

    test_commission.register(project_name="Moped")
    test_decommission.register(project_name="Moped")
    # test_commission.run(branch=branch, database_seed_source="production")
    # test_decommission.run(branch=branch)
