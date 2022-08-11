import tasks.ecs as ecs
import tasks.api as api
import tasks.database as db
import tasks.netlify as netlify
import tasks.activity_log as activity_log



with Flow(
    "Moped Test ECS Commission", run_config=UniversalRun(labels=["moped", hostname])
) as ecs_commission:

    basename = Parameter("basename")
    database = Parameter("database")
    api_endpoint = Parameter("api_endpoint")

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
        basename=basename, database=database, api_endpoint=api_endpoint
    )

    service = ecs.create_service(
        basename=basename,
        load_balancer=load_balancer,
        task_definition=task_definition,
        target_group=target_group,
        listeners_token=listeners,
        cluster_token=cluster,
    )
