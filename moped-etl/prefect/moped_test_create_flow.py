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
from prefect.run_configs import UniversalRun

# import prefect components
from prefect import Flow, task, Parameter

import tasks.ecs as ecs
import tasks.api as api
import tasks.database as db
import tasks.netlify as netlify
import tasks.activity_log as activity_log
from subsystem_flows import * # this import will be deprecated at some point

hostname = platform.node()

# setup some global variables from secrets. presently these are coming out of the environment,
# but this will be modified to the prefect KV store system when they are set in stone.

# AWS credentials
AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
GIT_REPOSITORY = os.environ["GIT_REPOSITORY"]

# set up the prefect logging system
logger = prefect.context.get("logger")

@task(Name="Slug branch name")
def slug_branch_name(basename):
    underscore_basename = basename.replace("-", "_")
    database = re.search(
        "^[\d_]*(.*)", underscore_basename
    ).group(
        1
    )  # remove leading numbers
    internal_number_free_underscore_basename = "".join(
        [i for i in database if not i.isdigit()]
    )
    awslambda = internal_number_free_underscore_basename[
        0:16
    ]  
    return basename, database, awslambda




with Flow(
    "Moped Test ECS Decommission",
    # Observation! The hex key of the container is from the build context!!
    # You can use this as a userful key to associate a state of the code and an environmental state!
    run_config=UniversalRun(labels=["moped", hostname]),
) as ecs_decommission:

    basename = Parameter("basename")

    set_count_at_zero = ecs.set_desired_count_for_service(basename=basename, count=0)

    tasks = ecs.list_tasks_for_service(basename=basename)

    stop_token = ecs.stop_tasks_for_service(
        basename=basename, tasks=tasks, zero_count_token=set_count_at_zero
    )

    drained_service = ecs.wait_for_service_to_be_drained(
        basename=basename, stop_token=stop_token
    )

    no_listeners = ecs.remove_all_listeners(basename=basename)

    no_target_group = ecs.remove_target_group(
        basename=basename, no_listener_token=no_listeners
    )

    no_service = ecs.delete_service(
        basename=basename,
        drained_token=drained_service,
        no_target_group_token=no_target_group,
    )

    no_cluster = ecs.remove_ecs_cluster(basename=basename, no_service_token=no_service)

    removed_load_balancer = ecs.remove_load_balancer(
        basename=basename, no_cluster_token=no_cluster
    )

    removed_hostname = ecs.remove_route53_cname(
        basename=basename, removed_load_balancer_token=removed_load_balancer
    )

    removed_certificate = ecs.remove_certificate(
        basename=basename, removed_hostname_token=removed_hostname
    )


with Flow(
    "Moped Test Database Commission",
    run_config=UniversalRun(labels=["moped", hostname]),
) as database_commission:

    basename = Parameter("basename")
    stage = Parameter("stage")

    create_database = db.create_database(basename=basename)
    populate_database_command = db.populate_database_with_data_command(
        basename=basename, stage=stage, upstream_tasks=[create_database]
    )
    populate_database = db.populate_database_with_data_task(
        command=populate_database_command
    )


with Flow(
    "Moped Test API Commission", run_config=UniversalRun(labels=["moped", hostname])
) as api_commission:

    basename = Parameter("basename")

    create_api_config_secret_arn = api.create_moped_api_secrets_entry(basename=basename)

    commission_api_command = api.create_moped_api_deploy_command(
        basename=basename, config_secret_arn=create_api_config_secret_arn
    )
    deploy_api = api.create_api_task(command=commission_api_command)
    endpoint = api.get_endpoint_from_deploy_output(deploy_api)

with Flow(
    "Moped Test Database Decommission",
    run_config=UniversalRun(labels=["moped", hostname]),
) as database_decommission:

    basename = Parameter("basename")

    remove_database = db.remove_database(basename=basename)


with Flow(
    "Moped Test API Decommission", run_config=UniversalRun(labels=["moped", hostname])
) as api_decommission:

    basename = Parameter("basename")

    remove_api_config_secret_arn = api.remove_moped_api_secrets_entry(basename=basename)

    decommission_api_command = api.create_moped_api_undeploy_command(
        basename=basename, config_secret_arn=remove_api_config_secret_arn
    )
    undeploy_api = api.remove_api_task(command=decommission_api_command)

with Flow(
    "Moped Netlify Commission", run_config=UniversalRun(labels=["moped", hostname])
) as netlify_commission:

    basename = Parameter("basename")
    api_endpoint_url = Parameter("api_endpoint_url")

    build = netlify.trigger_netlify_build(
        branch=basename, api_endpoint_url=api_endpoint_url
    )
    is_ready = netlify.netlify_check_build(branch=basename, build_token=build)


with Flow(
    "Moped Test Activity Log Commission",
    run_config=UniversalRun(labels=["moped", hostname]),
) as activity_log_commission:

    basename = Parameter("basename")

    commission_activity_log_command = activity_log.create_activity_log_command(
        basename=basename
    )
    deploy_activity_log = activity_log.create_activity_log_task(
        command=commission_activity_log_command
    )

with Flow(
    "Moped Test Activity Log Decommission",
    run_config=UniversalRun(labels=["moped", hostname]),
) as activity_log_decommission:

    basename = Parameter("basename")

    remove_activity_log_sqs = activity_log.remove_activity_log_sqs(basename=basename)
    remove_activity_log_lambda = activity_log.remove_activity_log_lambda(
        basename=basename, upstream_tasks=[remove_activity_log_sqs]
    )

with Flow("Apply Database Migrations") as apply_database_migrations:

    basename = Parameter("basename")

    graphql_endpoint = "https://" + ecs.get_graphql_engine_hostname(basename=basename)
    access_key = ecs.get_graphql_engine_access_key(basename=basename)

    rm_clone = "rm -fr /tmp/atd-moped"
    cleaned = ecs.shell_task(command=rm_clone)
    git_clone = "git clone " + GIT_REPOSITORY + " /tmp/atd-moped"
    cloned = ecs.shell_task(command=git_clone, upstream_tasks=[cleaned])
    checkout_branch = "git -C /tmp/atd-moped/ checkout " + basename
    checked_out = ecs.shell_task(command=checkout_branch, upstream_tasks=[cloned])

    metadata = "metadata"

    config = ecs.create_graphql_engine_config_contents(
        graphql_endpoint=graphql_endpoint,
        access_key=access_key,
        metadata=metadata,
        checked_out_token=checked_out,
    )

    migrate_cmd = (
        "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check migrate apply;)"
    )
    migrate = ecs.shell_task(command=migrate_cmd, upstream_tasks=[config])

    metadata_cmd = (
        "(cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata apply;)"
    )
    metadata = ecs.shell_task(command=metadata_cmd, upstream_tasks=[config])


if __name__ == "__main__":
    basename = "main"
    underscore_basename = basename.replace("-", "_")
    number_free_underscore_basename = re.search(
        "^[\d_]*(.*)", underscore_basename
    ).group(
        1
    )  # remove leading numbers
    internal_number_free_underscore_basename = "".join(
        [i for i in number_free_underscore_basename if not i.isdigit()]
    )
    short_internal_number_free_underscore_basename = internal_number_free_underscore_basename[
        0:16
    ]  # this is getting very short because of the other things which are padded onto the 64 char max lambda names

    database_data_stage = "staging"

    if False:
        print("\n🍄 Comissioning Database\n")
        database_commission.run(
            basename=number_free_underscore_basename, stage=database_data_stage
        )

        print("\n🚀 Comissioning API\n")
        api_commission_state = api_commission.run(
            parameters=dict(basename=short_internal_number_free_underscore_basename)
        )
        api_endpoint = api_commission_state.result[endpoint].result
        print("🚀 API Endpoint: " + api_endpoint)

        print("\n🤖 Comissioning ECS\n")
        ecs_commission.run(
            parameters=dict(
                basename=basename,
                database=number_free_underscore_basename,
                api_endpoint=api_endpoint,
            )
        )

        print("\n💡 Comissioning Netlify Build & Deploy\n")
        netlify_commission.run(
            parameters=dict(basename=basename, api_endpoint_url=api_endpoint)
        )
        print("\n🎯 Comissioning Activity Log\n")
        activity_log_commission.run(parameters=dict(basename=basename))

        print("\n🌱 Applying database migrations\n")
        apply_database_migrations.run(parameters=dict(basename=basename))

    if False:
        print("\n🎯 Decomissioning Activity Log\n")
        activity_log_decommission.run(parameters=dict(basename=basename))

        print("\n🤖 Decomissioning ECS\n")
        ecs_decommission.run(parameters=dict(basename=basename))

        print("\n🚀 Decomissioning API\n")
        api_decommission.run(
            parameters=dict(basename=short_internal_number_free_underscore_basename)
        )

        print("\n🍄 Decomissioning Database\n")
        database_decommission.run(basename=number_free_underscore_basename)
