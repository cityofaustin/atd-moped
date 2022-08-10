import os

import time
from datetime import timedelta
from re import I
import boto3
import prefect
from prefect import task
import pprint as pretty_printer
import hashlib
from prefect.tasks.shell import ShellTask

import tasks.api as api
import tasks.activity_log as activity_log

# set up the prefect logging system
logger = prefect.context.get("logger")

# AWS ARN-like identifiers
R53_HOSTED_ZONE = os.environ["R53_HOSTED_ZONE"]
VPC_ID = os.environ["VPC_ID"]
VPC_SUBNET_A = os.environ["VPC_SUBNET_A"]
VPC_SUBNET_B = os.environ["VPC_SUBNET_B"]
ELB_SECURITY_GROUP = os.environ["ELB_SECURITY_GROUP"]
TASK_ROLE_ARN = os.environ["TASK_ROLE_ARN"]
ECS_TASK_SECURITY_GROUP = os.environ["ECS_TASK_SECURITY_GROUP"]
CLOUDWATCH_LOG_GROUP = os.environ["CLOUDWATCH_LOG_GROUP"]
MOPED_TEST_HOSTNAME = os.environ["MOPED_TEST_HOSTNAME"]
MOPED_TEST_USER = os.environ["MOPED_TEST_USER"]
MOPED_TEST_PASSWORD = os.environ["MOPED_TEST_PASSWORD"]
SHA_SALT = os.environ["SHA_SALT"]
GIT_REPOSITORY = os.environ["GIT_REPOSITORY"]

# MOPED_API_KEY = "Figure out how to pass this in as a parameter"


def pprint(string):
    print("")
    pp = pretty_printer.PrettyPrinter(indent=2)
    pp.pprint(string)
    print("")


@task(name="Create ECS Cluster")
def create_ecs_cluster(basename):
    logger.info("Creating ECS cluster")

    ecs = boto3.client("ecs", region_name="us-east-1")
    create_cluster_result = ecs.create_cluster(clusterName=basename)

    logger.info("Cluster ARN: " + create_cluster_result["cluster"]["clusterArn"])

    return create_cluster_result


@task(name="Create EC2 Load Balancer")
def create_load_balancer(basename):

    logger.info("Creating Load Balancer")
    elb = boto3.client("elbv2")

    create_elb_result = elb.create_load_balancer(
        Name=basename,
        Subnets=[VPC_SUBNET_A, VPC_SUBNET_B],
        SecurityGroups=[ELB_SECURITY_GROUP],
        Scheme="internet-facing",
        Tags=[{"Key": "name", "Value": basename}],
        Type="application",
        IpAddressType="ipv4",
    )

    return create_elb_result


@task(name="Create EC2 Target Group")
def create_target_group(basename):
    logger.info("Creating Target Group")

    elb = boto3.client("elbv2")

    target_group = elb.create_target_group(
        Name=basename,
        Protocol="HTTP",
        Port=8080,
        VpcId=VPC_ID,
        TargetType="ip",
        HealthCheckPath="/healthz",
        Matcher={"HttpCode": "200,302"},
    )

    return target_group


def form_hostname(basename):
    host = basename + "-graphql.moped-test.austinmobility.io"
    return host


@task(name="Get graphql-engine hostname")
def get_graphql_engine_hostname(basename):
    return form_hostname(basename)


@task(name="Create Rout53 CNAME")
def create_route53_cname(basename, load_balancer):
    logger.info("Creating Route53 CNAME")

    host = form_hostname(basename)

    target = load_balancer["LoadBalancers"][0]["DNSName"]

    route53 = boto3.client("route53")

    record = route53.change_resource_record_sets(
        HostedZoneId=R53_HOSTED_ZONE,
        ChangeBatch={
            "Changes": [
                {
                    "Action": "UPSERT",
                    "ResourceRecordSet": {
                        "Name": host,
                        "Type": "CNAME",
                        "TTL": 300,
                        "ResourceRecords": [{"Value": target}],
                    },
                }
            ]
        },
    )

    return record


@task(name="Check DNS status", max_retries=12, retry_delay=timedelta(seconds=10))
def check_dns_status(dns_request):
    logger.info("Checking DNS status")

    route53 = boto3.client("route53")

    dns_status = route53.get_change(Id=dns_request["ChangeInfo"]["Id"])

    status = dns_status["ChangeInfo"]["Status"]

    if status == "INSYNC":
        return dns_status
    if status == "PENDING":
        raise Exception(
            "DNS Status is 'PENDING' for request: " + dns_request["ChangeInfo"]["Id"]
        )

    raise Exception("Unexpected DNS status: " + status)


@task(name="Request ACM TLS Certificate")
def create_certificate(basename, dns_status):
    logger.info("Creating TLS Certificate")

    acm = boto3.client("acm")

    host = basename + "-graphql.moped-test.austinmobility.io"

    certificate = acm.request_certificate(DomainName=host, ValidationMethod="DNS")

    return certificate


@task(
    name="Check ACM Certificate Status",
    max_retries=12,
    retry_delay=timedelta(seconds=10),
)
def get_certificate_validation_parameters(tls_certificate):
    logger.info("Validating TLS Certificate")

    acm = boto3.client("acm")

    certificate = acm.describe_certificate(
        CertificateArn=tls_certificate["CertificateArn"]
    )
    if not certificate["Certificate"]["DomainValidationOptions"][0]["ResourceRecord"][
        "Name"
    ]:
        raise Exception("No Domain Validation Resource Record Options")

    return certificate


@task(name="Add CNAME for Certificate Validation")
def add_cname_for_certificate_validation(parameters):
    logger.info("Adding CNAME for TLS Certificate Validation")

    host = parameters["Certificate"]["DomainValidationOptions"][0]["ResourceRecord"][
        "Name"
    ]
    target = parameters["Certificate"]["DomainValidationOptions"][0]["ResourceRecord"][
        "Value"
    ]

    route53 = boto3.client("route53")

    record = route53.change_resource_record_sets(
        HostedZoneId=R53_HOSTED_ZONE,
        ChangeBatch={
            "Changes": [
                {
                    "Action": "UPSERT",
                    "ResourceRecordSet": {
                        "Name": host,
                        "Type": "CNAME",
                        "TTL": 300,
                        "ResourceRecords": [{"Value": target}],
                    },
                }
            ]
        },
    )

    return record


@task(
    name="Wait for TLS Certificate validation",
    max_retries=12,
    retry_delay=timedelta(seconds=10),
)
def wait_for_valid_certificate(validation_record, tls_certificate):
    logger.info("Waiting for TLS Certificate to be valid")

    acm = boto3.client("acm")

    certificate = acm.describe_certificate(
        CertificateArn=tls_certificate["CertificateArn"]
    )

    status = certificate["Certificate"]["Status"]

    if status == "ISSUED":
        return certificate
    if status == "PENDING_VALIDATION":
        raise Exception(
            "TLS Certificate Status is 'PENDING_VALIDATION' for request: "
            + certificate["CertificateArn"]
        )

    raise Exception("Unexpected TLS Certificate status: " + status)


@task(name="Remove Route 53 CNAME from validation")
def remove_route53_cname_for_validation(validation_record, issued_certificate):

    logger.info("Removing CNAME TLS from Certificate Validation")

    host = issued_certificate["Certificate"]["DomainValidationOptions"][0][
        "ResourceRecord"
    ]["Name"]
    target = issued_certificate["Certificate"]["DomainValidationOptions"][0][
        "ResourceRecord"
    ]["Value"]

    route53 = boto3.client("route53")

    record = route53.change_resource_record_sets(
        HostedZoneId=R53_HOSTED_ZONE,
        ChangeBatch={
            "Changes": [
                {
                    "Action": "DELETE",
                    "ResourceRecordSet": {
                        "Name": host,
                        "Type": "CNAME",
                        "TTL": 300,
                        "ResourceRecords": [{"Value": target}],
                    },
                }
            ]
        },
    )


@task(name="Create EC2 ELB Listeners")
def create_load_balancer_listener(load_balancer, target_group, certificate):
    logger.info("Creating Load Balancer Listener")
    elb = boto3.client("elbv2")

    listeners = {"HTTP": None, "HTTPS": None}

    listeners["HTTP"] = elb.create_listener(
        LoadBalancerArn=load_balancer["LoadBalancers"][0]["LoadBalancerArn"],
        Protocol="HTTP",
        Port=80,
        DefaultActions=[
            {
                "Type": "redirect",
                "RedirectConfig": {
                    "Protocol": "HTTPS",
                    "Port": "443",
                    "StatusCode": "HTTP_301",
                },
            }
        ],
    )

    listeners["HTTPS"] = elb.create_listener(
        LoadBalancerArn=load_balancer["LoadBalancers"][0]["LoadBalancerArn"],
        Protocol="HTTPS",
        Port=443,
        SslPolicy="ELBSecurityPolicy-2016-08",  # interestingly, not a managed policy.
        DefaultActions=[
            {
                "Type": "forward",
                "TargetGroupArn": target_group["TargetGroups"][0]["TargetGroupArn"],
            }
        ],
        Certificates=[{"CertificateArn": certificate["Certificate"]["CertificateArn"]}],
    )

    return listeners


def generate_access_key(basename):
    sha_input = basename + SHA_SALT + "ecs"
    graphql_engine_api_key = hashlib.sha256(sha_input.encode()).hexdigest()
    return graphql_engine_api_key


@task(name="Get graphql-engine access key")
def get_graphql_engine_access_key(basename):
    return generate_access_key(basename)


@task(name="Create ECS Task Definition")
def create_task_definition(basename, database, api_endpoint):
    logger.info("Adding task definition")
    ecs = boto3.client("ecs", region_name="us-east-1")

    HASURA_GRAPHQL_DATABASE_URL = f"postgres://{MOPED_TEST_USER}:{MOPED_TEST_PASSWORD}@{MOPED_TEST_HOSTNAME}:5432/{database}"

    response = ecs.register_task_definition(
        # this unified family parameter requires that this flow's
        # use be serialized.
        family="moped-test-graphql-endpoint",
        executionRoleArn=TASK_ROLE_ARN,
        networkMode="awsvpc",
        requiresCompatibilities=["FARGATE"],
        cpu="256",
        memory="1024",
        containerDefinitions=[
            {
                "name": "graphql-engine",
                "image": "hasura/graphql-engine:latest",
                # "image": "mendhak/http-https-echo:latest",
                "cpu": 256,
                "memory": 512,
                "portMappings": [
                    {"containerPort": 8080, "hostPort": 8080, "protocol": "tcp"}
                ],
                "essential": True,
                "environment": [
                    {"name": "HTTP_PORT", "value": "8080"},
                    {"name": "HASURA_GRAPHQL_ENABLE_CONSOLE", "value": "true"},
                    {"name": "HASURA_GRAPHQL_ENABLE_TELEMETRY", "value": "false"},
                    {
                        "name": "HASURA_GRAPHQL_DATABASE_URL",
                        "value": HASURA_GRAPHQL_DATABASE_URL,
                    },
                    {
                        "name": "HASURA_ADMIN_SECRET",
                        "value": generate_access_key(basename),
                    },
                    #  This depends on the Moped API endpoint returned from API commission tasks, add /events/ to end
                    {
                        "name": "MOPED_API_EVENTS_URL",
                        "value": api_endpoint + "/events/",
                    },
                    {
                        "name": "MOPED_API_APIKEY",
                        "value": api.generate_api_key(basename),
                    },
                ],
                "logConfiguration": {
                    "logDriver": "awslogs",
                    "options": {
                        "awslogs-group": CLOUDWATCH_LOG_GROUP,
                        "awslogs-region": "us-east-1",
                        "awslogs-stream-prefix": basename,
                    },
                },
            }
        ],
    )

    return response


@task(name="Create ECS Service")
def create_service(
    basename,
    load_balancer,
    task_definition,
    target_group,
    listeners_token,
    cluster_token,
):

    logger.info("Creating ECS service")

    ecs = boto3.client("ecs", region_name="us-east-1")

    create_service_result = ecs.create_service(
        cluster=basename,
        serviceName=basename,
        launchType="FARGATE",
        taskDefinition=task_definition["taskDefinition"]["taskDefinitionArn"],
        desiredCount=1,
        loadBalancers=[
            {
                "targetGroupArn": target_group["TargetGroups"][0]["TargetGroupArn"],
                "containerName": "graphql-engine",
                "containerPort": 8080,
            }
        ],
        networkConfiguration={
            "awsvpcConfiguration": {
                "subnets": [VPC_SUBNET_A, VPC_SUBNET_B],
                "securityGroups": [ECS_TASK_SECURITY_GROUP],
                "assignPublicIp": "ENABLED",
            }
        },
        healthCheckGracePeriodSeconds=60,
        tags=[{"key": "name", "value": basename}],
    )

    return create_service_result


# decommission tasks


@task(name="Remove ECS Cluster")
def remove_ecs_cluster(basename, no_service_token):
    logger.info("removing ECS cluster")

    ecs = boto3.client("ecs", region_name="us-east-1")
    delete_cluster_result = ecs.delete_cluster(cluster=basename)

    return delete_cluster_result


@task(name="Remove EC2 Target Group")
def remove_target_group(basename, no_listener_token):
    logger.info("Removing target group")

    elb = boto3.client("elbv2")

    target_group = elb.describe_target_groups(Names=[basename])

    delete_target_group_result = elb.delete_target_group(
        TargetGroupArn=target_group["TargetGroups"][0]["TargetGroupArn"]
    )

    return delete_target_group_result


@task(name="Remove EC2 ELB Listeners")
def remove_all_listeners(basename):
    logger.info("Removing all listeners from load balancer")

    elb = boto3.client("elbv2")

    load_balancer = elb.describe_load_balancers(Names=[basename])

    listeners = elb.describe_listeners(
        LoadBalancerArn=load_balancer["LoadBalancers"][0]["LoadBalancerArn"]
    )

    for listener in listeners["Listeners"]:
        elb.delete_listener(ListenerArn=listener["ListenerArn"])

    return load_balancer


@task(name="Remove EC2 Elastic Load Balancer")
def remove_load_balancer(basename, no_cluster_token):
    logger.info("removing Load Balancer")

    elb = boto3.client("elbv2")

    load_balancers = elb.describe_load_balancers(Names=[basename])

    delete_elb_result = elb.delete_load_balancer(
        LoadBalancerArn=load_balancers["LoadBalancers"][0]["LoadBalancerArn"]
    )

    return delete_elb_result


@task(name="Set ECS Service Task Count")
def set_desired_count_for_service(basename, count):
    logger.info("Setting desired count for service")

    ecs = boto3.client("ecs", region_name="us-east-1")

    services = ecs.describe_services(cluster=basename, services=[basename])

    if services["services"][0]["status"] == "ACTIVE":
        response = ecs.update_service(
            cluster=basename, service=basename, desiredCount=count
        )
        return response

    return True


@task(name="Lists Tasks of Service")
def list_tasks_for_service(basename):
    logger.info("Listing tasks for service")

    ecs = boto3.client("ecs", region_name="us-east-1")

    response = ecs.list_tasks(cluster=basename, serviceName=basename)

    return response


@task(name="Stop Tasks for ECS Service")
def stop_tasks_for_service(basename, tasks, zero_count_token):
    logger.info("Stopping tasks for service")

    ecs = boto3.client("ecs", region_name="us-east-1")

    responses = []

    for task in tasks["taskArns"]:
        response = ecs.stop_task(
            cluster=basename,
            task=task,
            reason="Stopping tasks to decommission this deployment",
        )
        responses.append(response)

    return responses


@task(
    name="Wait for ECS Service to Drain",
    max_retries=12,
    retry_delay=timedelta(seconds=10),
)
def wait_for_service_to_be_drained(basename, stop_token):
    logger.info("Waiting for service to be drained")

    ecs = boto3.client("ecs", region_name="us-east-1")

    tasks = ecs.list_tasks(cluster=basename, serviceName=basename)

    if len(tasks["taskArns"]) == 0:
        return Exception("Still have tasks hanging around!")

    return True


@task(name="Remove ECS Task Definition")
def remove_task_definition(task_definition):
    logger.info("removing task definition")

    ecs = boto3.client("ecs", region_name="us-east-1")
    response = ecs.deregister_task_definition(
        taskDefinition=task_definition["taskDefinition"]["taskDefinitionArn"]
    )

    return response


@task(name="Remove ECS Service")
def delete_service(basename, drained_token, no_target_group_token):
    logger.info("Deleting service")

    ecs = boto3.client("ecs", region_name="us-east-1")
    response = ecs.delete_service(cluster=basename, service=basename)

    return response


@task(name="Remove Route53 CNAME")
def remove_route53_cname(basename, removed_load_balancer_token):
    logger.info("Removing Route53 CNAME")

    route53 = boto3.client("route53")

    hostname = basename + "-graphql.moped-test.austinmobility.io."

    existing_hostname = route53.list_resource_record_sets(
        HostedZoneId="ZIY5NA61UOXR9",
        StartRecordName=hostname,
        StartRecordType="CNAME",
        MaxItems="1",
    )

    if hostname != existing_hostname["ResourceRecordSets"][0]["Name"]:
        return Exception("Hostname does not exist")

    response = route53.change_resource_record_sets(
        HostedZoneId=R53_HOSTED_ZONE,
        ChangeBatch={
            "Changes": [
                {
                    "Action": "DELETE",
                    "ResourceRecordSet": {
                        "Name": hostname,
                        "Type": "CNAME",
                        "TTL": 300,
                        "ResourceRecords": [
                            {
                                "Value": existing_hostname["ResourceRecordSets"][0][
                                    "ResourceRecords"
                                ][0]["Value"]
                            }
                        ],
                    },
                }
            ]
        },
    )

    return response


@task(name="Remove ACM Certificate")
def remove_certificate(basename, removed_hostname_token):
    logger.info("Removing certificate")

    logger.info("Sleeping for 10 seconds to allow for certificate to be removed")
    time.sleep(15)

    acm = boto3.client("acm")

    host = basename + "-graphql.moped-test.austinmobility.io"

    certificates = acm.list_certificates()

    certificate = next(
        (
            cert
            for cert in certificates["CertificateSummaryList"]
            if cert["DomainName"] == host
        )
    )

    response = acm.delete_certificate(CertificateArn=certificate["CertificateArn"])

    return response


@task(name="Create graphql-engine config contents")
def create_graphql_engine_config_contents(
    graphql_endpoint, access_key, metadata, checked_out_token
):
    config = f"""version: 2
endpoint: {graphql_endpoint}
metadata_directory: {metadata}
admin_secret: {access_key}
actions:
  kind: synchronous
  handler_webhook_baseurl: {graphql_endpoint}
"""

    config_file = open("/tmp/atd-moped/moped-database/config.yaml", "w")
    config_file.write(config)
    config_file.close()

    return config


shell_task = ShellTask(name="Shell Task", stream_output=True)


# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check version;)
# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata inconsistency status;)
# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check migrate apply;)
# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata apply;)
