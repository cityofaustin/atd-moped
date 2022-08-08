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

hostname = platform.node()

# setup some global variables from secrets. presently these are coming out of the environment,
# but this will be modified to the prefect KV store system when they are set in stone.

# AWS credentials
AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]

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


with Flow(
    "Moped Test ECS Commission", run_config=UniversalRun(labels=["moped", hostname])
) as ecs_commission:

    basename = Parameter("basename")
    database = Parameter("database")

    graphql_access_key = ecs.generate_access_key(basename=basename)

    cluster = ecs.create_ecs_cluster(basename=basename)

    load_balancer = ecs.create_load_balancer(basename=basename)

    target_group = ecs.create_target_group(basename=basename)

    dns_request = ecs.create_route53_cname(
        basename=basename, load_balancer=load_balancer
    )

    dns_status = ecs.check_dns_status(dns_request=dns_request)

    tls_certificate = ecs.create_certificate(basename=basename, dns_status=dns_status)

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

    listeners = ecs.create_load_balancer_listener(
        load_balancer=load_balancer,
        target_group=target_group,
        certificate=issued_certificate,
    )

    task_definition = ecs.create_task_definition(
        basename=basename, database=database, graphql_access_key=graphql_access_key
    )

    service = ecs.create_service(
        basename=basename,
        load_balancer=load_balancer,
        task_definition=task_definition,
        target_group=target_group,
        listeners_token=listeners,
        cluster_token=cluster,
    )


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

    graphql_engine_api_key = api.generate_access_key(basename=basename)

    create_api_config_secret_arn = api.create_moped_api_secrets_entry(
        basename=basename, graphql_engine_api_key=graphql_engine_api_key
    )

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

    build = netlify.trigger_netlify_build(branch=basename)
    is_ready = netlify.netlify_check_build(branch=basename, build_token=build)


with Flow(
    "Moped Test Activity Log Commission",
    run_config=UniversalRun(labels=["moped", hostname]),
) as activity_log_commission:

    basename = Parameter("basename")
    graphql_engine_api_key = activity_log.generate_access_key(basename=basename)

    commission_activity_log_command = activity_log.create_activity_log_command(
        basename=basename, graphql_engine_api_key=graphql_engine_api_key
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


if __name__ == "__main__":
    basename = "integration-test"
    database = basename.replace("-", "_")
    database_data_stage = "staging"

    if True:
        print("\n🍄 Comissioning Database\n")
        # database_commission.run(basename=database, stage=database_data_stage)

        print("\n️🚀 Comissioning API\n")
        #api_commission_state = api_commission.run(parameters=dict(basename=basename))
        #api_endpoint = api_commission_state.result[endpoint].result
        print("🚀 API Endpoint: " + api_endpoint)

        print("\n🤖 Comissioning ECS\n")
        # ecs_commission.run(parameters=dict(basename=basename, database=database))

        print("\n💡 Comissioning Netlify Build & Deploy\n")
        # netlify_commission.run(parameters=dict(basename=basename))

        print("\n🎯 Comissioning Activity Log\n")
        # activity_log_commission.run(parameters=dict(basename=basename))

    else:
        print("\n🚀 Decomissioning API\n")
        # api_decommission.run(parameters=dict(basename=basename))

        print("\n🍄 Decomissioning Database\n")
        # database_decommission.run(basename=database)

        print("\n🤖 Decomissioning ECS\n")
        # ecs_decommission.run(parameters=dict(basename=basename))

        print("\n🎯 Decomissioning Activity Log\n")
        # activity_log_decommission.run(parameters=dict(basename=basename))
