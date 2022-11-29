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
import pprint

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

from prefect.executors import DaskExecutor

executor = DaskExecutor(address="tcp://172.25.0.2:8786")


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

    graphql_endpoint = (
        basename.replace("_", "-").replace(".", "-").strip("0123456789-_")
    )
    short_tls_basename = graphql_endpoint[0:27]
    elb_basename = basename[0:32].replace("_", "-").strip("0123456789-_.")
    activity_log_slug = basename[0:34].replace("_", "-").strip("0123456789-_")
    database = basename[0:63].replace("-", "_").strip("0123456789-_.")
    awslambda = re.sub(
        r"[^a-zA-Z0-9-]", "", basename[0:16].replace("_", "-").strip("0123456789-_")
    )
    ecs_cluster_name = basename.strip("0123456789-_.")
    # zappa_stage_name = re.sub(r"[^a-zA-Z0-9]", "", basename)

    slug = {
        "basename": basename,
        "database": database,
        "graphql_endpoint": graphql_endpoint,
        "activity_log_slug": activity_log_slug,
        "awslambda": awslambda,
        "short_tls_basename": short_tls_basename,
        "elb_basename": elb_basename,
        "ecs_cluster_name": ecs_cluster_name,
        # "zappa_stage_name": zappa_stage_name,
    }

    pp = pprint.PrettyPrinter(width=41, compact=True)
    logger.info(pp.pformat(slug))
    return slug


def drain_service(slug):
    set_count_at_zero = ecs.set_desired_count_for_service(slug=slug, count=0)

    tasks = ecs.list_tasks_for_service(slug=slug)

    stop_token = ecs.stop_tasks_for_service(
        slug=slug, tasks=tasks, zero_count_token=set_count_at_zero
    )

    drained_service = ecs.wait_for_service_to_be_drained(
        slug=slug, stop_token=stop_token
    )

    return drained_service


# change the Flow's name below when testing, otherwise registering your test flow
# will overwrite the production flow
# with Flow("Moped Test Instance Commission") as test_commission:
with Flow("Moped Test Instance Commission test") as test_commission:
    branch = Parameter("branch", default="feature-branch-name", required=True)
    database_seed_source = Parameter(
        "database_seed_source", default="seed", required=True
    )
    do_migrations = Parameter("do_migrations", default=True, required=True)

    slug = slug_branch_name(branch)

    ## Get github checkout

    rm_clone = "rm -fr /tmp/atd-moped"
    cleaned = migrations.remove_moped_checkout(command=rm_clone)

    git_clone = f"git clone {GIT_REPOSITORY} /tmp/atd-moped"
    cloned = migrations.clone_moped_repo(command=git_clone, upstream_tasks=[cleaned])

    checkout_branch = migrations.get_git_checkout_command(slug=slug)
    git_repo_checked_out = migrations.checkout_target_branch(
        command=checkout_branch, upstream_tasks=[cloned]
    )

    ## Commission the database

    database_exists = db.database_exists(slug)

    use_seed_data = migrations.use_seed_data(database_seed_source)

    with case(database_exists, True):

        running_tasks = ecs.check_count_running_ecs_tasks(slug=slug)
        with case(running_tasks, True):
            drained_service = drain_service(slug)
        ready_to_drop_db = merge(drained_service, running_tasks)

        remove_database = db.remove_database(
            slug=slug, ready_to_drop_db=ready_to_drop_db
        )

    ready_to_commission = merge(remove_database, database_exists)

    create_database = db.create_database(
        slug=slug, upstream_tasks=[ready_to_commission]
    )

    with case(use_seed_data, False):
        replicate_database_command = db.populate_database_with_data_command(
            slug=slug, stage=database_seed_source, upstream_tasks=[create_database]
        )
        replicate_database = db.populate_database_with_data_task(
            command=replicate_database_command
        )

    populate_database = merge(create_database, replicate_database)

    ## Commission the API

    secret_exists = api.check_secret_exists(slug=slug)

    with case(secret_exists, True):
        remove_api_config_secret_arn = api.remove_moped_api_secrets_entry(slug=slug)

    ready_for_secret = merge(remove_api_config_secret_arn, secret_exists)

    create_api_config_secret_arn = api.create_moped_api_secrets_entry(
        slug=slug, ready_for_secret=ready_for_secret
    )

    # test if api is deployed, remove if so
    is_deployed = api.check_if_api_is_deployed(slug=slug)
    with case(is_deployed, True):
        decommission_api_command = api.create_moped_api_undeploy_command(
            slug=slug,
            config_secret_arn=remove_api_config_secret_arn,
            upstream_tasks=[git_repo_checked_out],
        )
        undeploy_api = api.remove_api_task(command=decommission_api_command)
    ready_for_api_deployment = merge(is_deployed, undeploy_api)

    commission_api_command = api.create_moped_api_deploy_command(
        slug=slug,
        config_secret_arn=create_api_config_secret_arn,
        ready_for_api_deployment=ready_for_api_deployment,
        upstream_tasks=[git_repo_checked_out],
    )

    deploy_api = api.create_api_task(command=commission_api_command)
    api_endpoint = api.get_endpoint_from_deploy_output(deploy_api)

    ## Commission the ECS cluster

    cluster = ecs.create_ecs_cluster(slug=slug)

    load_balancer = ecs.create_load_balancer(slug)

    target_group = ecs.create_target_group(slug)

    dns_request = ecs.create_route53_cname(slug=slug, load_balancer=load_balancer)

    dns_status = ecs.check_dns_status(dns_request=dns_request)

    tls_certificate = ecs.create_certificate(slug=slug, dns_status=dns_status)

    certificate_validation_parameters = ecs.get_certificate_validation_parameters(
        tls_certificate=tls_certificate
    )

    # this is now returning an iterable of the results of adding the cnames
    validation_record = ecs.add_cname_for_certificate_validation.map(
        certificate_validation_parameters
    )

    issued_certificate = ecs.wait_for_valid_certificate(
        tls_certificate=tls_certificate, upstream_tasks=[validation_record]
    )

    # this should map into two tasks, and run after the certificate is issued
    # FIXME this has some key error in it
    # removed_cname = ecs.remove_route53_cname_for_validation.map(
    # certificate_validation_parameters, upstream_tasks=[issued_certificate]
    # )

    has_listeners = ecs.count_existing_listeners(slug=slug, load_balancer=load_balancer)
    with case(has_listeners, False):
        no_listeners = ecs.remove_all_listeners(slug=slug)
    ready_for_listeners = merge(no_listeners, has_listeners)

    listeners = ecs.create_load_balancer_listener(
        load_balancer=load_balancer,
        target_group=target_group,
        certificate=issued_certificate,
        ready_for_listeners=ready_for_listeners,
    )

    task_definition = ecs.create_task_definition(slug=slug, api_endpoint=api_endpoint)

    graphql_engine_service_created = ecs.create_service(
        slug=slug,
        load_balancer=load_balancer,
        task_definition=task_definition,
        target_group=target_group,
        listeners_token=listeners,
        cluster_token=cluster,
        upstream_tasks=[populate_database],
    )

    with case(graphql_engine_service_created, False):
        graphql_engine_service_updated = ecs.update_service(
            slug=slug,
            load_balancer=load_balancer,
            task_definition=task_definition,
            target_group=target_group,
            listeners_token=listeners,
            cluster_token=cluster,
        )

    graphql_engine_service_deployed = merge(
        graphql_engine_service_updated, graphql_engine_service_created
    )

    graphql_endpoint_ready = ecs.check_graphql_endpoint_status(
        slug=slug, graphql_engine_service=graphql_engine_service_deployed
    )

    ## Commission the Netlify site

    build = netlify.trigger_netlify_build(slug=slug, api_endpoint_url=api_endpoint)
    netlify_is_ready = netlify.netlify_check_build(slug=slug, build_token=build)

    ## Commission the Activity Log

    # commission_activity_log_command = activity_log.create_activity_log_command(
    #     slug=slug, upstream_tasks=[git_repo_checked_out]
    # )
    # deploy_activity_log = activity_log.create_activity_log_task(
    #     command=commission_activity_log_command
    # )

    ## Apply Migrations, metadata and optional seed data
    graphql_endpoint = "https://" + migrations.get_graphql_engine_hostname(slug=slug)

    access_key = migrations.get_graphql_engine_access_key(slug=slug)

    metadata = "metadata"

    config = migrations.create_graphql_engine_config_contents(
        graphql_endpoint=graphql_endpoint,
        access_key=access_key,
        metadata=metadata,
        checked_out_token=git_repo_checked_out,
    )

    with case(do_migrations, True):
        # what are these parentheses doing?
        migrate_cmd = "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check migrate apply; sleep 15;)"
        migrate = migrations.migrate_db(
            command=migrate_cmd, upstream_tasks=[config, graphql_endpoint_ready]
        )

        consistency_cmd = "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata inconsistency status;)"
        consistent_metadata = migrations.check_for_consistent_metadata(
            command=consistency_cmd, upstream_tasks=[migrate]
        )

        # Should this sleep come out or should the bash sleeps be done like this?
        settled_metadata = migrations.sleep_fifteen_seconds(
            consistent_metadata=consistent_metadata
        )

        metadata_cmd = "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata apply; sleep 15;)"
        metadata = migrations.apply_metadata(
            command=metadata_cmd, upstream_tasks=[migrate, settled_metadata]
        )

        with case(use_seed_data, True):
            apply_seed_cmd = "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check seed apply; sleep 15;)"
            seed_data = migrations.insert_seed_data(
                command=apply_seed_cmd, upstream_tasks=[metadata]
            )

        ready_database = merge(metadata, seed_data)

with Flow("Moped Test Instance Decommission") as test_decommission:
    branch = Parameter("branch")
    slug = slug_branch_name(branch)

    # Reap Activity Log

    remove_activity_log_sqs = activity_log.remove_activity_log_sqs(slug=slug)

    remove_activity_log_lambda = activity_log.remove_activity_log_lambda(
        slug=slug, upstream_tasks=[remove_activity_log_sqs]
    )

    # Reap ECS

    drained_service = drain_service(slug=slug)

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
        remove_database = db.remove_database(slug, ready_to_drop_db=drained_service)


if __name__ == "__main__":
    # this could be another place to change for a test flow, project_name="Moped staging"
    test_commission.register(project_name="Moped")
