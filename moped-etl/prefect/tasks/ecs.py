import os

import time
from datetime import timedelta
from re import I
import boto3
import prefect
from prefect import task
import pprint as pretty_printer
import requests

import tasks.shared as shared

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
AWS_DEFAULT_REGION = os.environ["AWS_DEFAULT_REGION"]


def pprint(string):
    print("")
    pp = pretty_printer.PrettyPrinter(indent=2)
    pp.pprint(string)
    print("")


@task(name="Create ECS Cluster")
def create_ecs_cluster(slug):
    logger.info("Creating ECS cluster")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)
    create_cluster_result = ecs.create_cluster(clusterName=slug["ecs_cluster_name"])

    logger.info("Cluster ARN: " + create_cluster_result["cluster"]["clusterArn"])

    return create_cluster_result


@task(name="Create EC2 Load Balancer")
def create_load_balancer(slug):
    basename = slug["basename"]

    logger.info("Creating Load Balancer")
    elb = boto3.client("elbv2")

    create_elb_result = elb.create_load_balancer(
        Name=slug["elb_basename"],
        Subnets=[VPC_SUBNET_A, VPC_SUBNET_B],
        SecurityGroups=[ELB_SECURITY_GROUP],
        Scheme="internet-facing",
        Tags=[{"Key": "name", "Value": basename}],
        Type="application",
        IpAddressType="ipv4",
    )

    return create_elb_result


@task(name="Create EC2 Target Group")
def create_target_group(slug):
    logger.info("Creating Target Group")

    elb = boto3.client("elbv2")

    target_group = elb.create_target_group(
        Name=slug["elb_basename"],
        Protocol="HTTP",
        Port=8080,
        VpcId=VPC_ID,
        TargetType="ip",
        HealthCheckPath="/healthz",
        Matcher={"HttpCode": "200,302"},
    )

    return target_group


@task(name="Create Route53 CNAME")
def create_route53_cname(slug, load_balancer):
    logger.info("Creating Route53 CNAME")

    host = shared.form_graphql_endpoint_hostname(slug["graphql_endpoint"])
    logger.info("Graphql Endpoint Hostname: " + host)

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
def create_certificate(slug, dns_status):
    logger.info("Creating TLS Certificate")

    acm = boto3.client("acm")

    # TODO create these host names via shared helper function or push the hardcoded values into the environment variables

    host = slug["graphql_endpoint"] + "-graphql.moped-test.austinmobility.io"
    short_host = slug["short_tls_basename"] + "-graphql.moped-test.austinmobility.io"

    certificate = None
    if short_host != host:
        logger.info("Short hostname is different from long hostname")
        certificate = acm.request_certificate(
            DomainName=short_host,
            ValidationMethod="DNS",
            SubjectAlternativeNames=[host],
        )
    else:
        logger.info("Short hostname is the same as long hostname")
        certificate = acm.request_certificate(DomainName=host, ValidationMethod="DNS")

    return certificate


@task(
    name="Get Certificate validation options",
    max_retries=12,
    retry_delay=timedelta(seconds=10),
)
def get_certificate_validation_parameters(tls_certificate):
    logger.info("Validating TLS Certificate")

    acm = boto3.client("acm")

    certificate = acm.describe_certificate(
        CertificateArn=tls_certificate["CertificateArn"]
    )

    logger.info(certificate)

    if not certificate["Certificate"]["DomainValidationOptions"][0]["ResourceRecord"][
        "Name"
    ]:
        raise Exception("No Domain Validation Resource Record Options")

    validations = certificate["Certificate"]["DomainValidationOptions"]

    return validations


@task(name="Add CNAME for Certificate Validation")
def add_cname_for_certificate_validation(parameters):
    logger.info("Adding CNAME for TLS Certificate Validation")

    host = parameters["ResourceRecord"]["Name"]
    target = parameters["ResourceRecord"]["Value"]

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


@task(
    name="Wait for TLS Certificate validation",
    max_retries=12,
    retry_delay=timedelta(seconds=10),
)
def wait_for_valid_certificate(tls_certificate):
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
def remove_route53_cname_for_validation(parameters):

    logger.info("Removing CNAME TLS from Certificate Validation")

    logger.info(parameters)

    host = parameters["ResourceRecord"]["Name"]
    target = parameters["ResourceRecord"]["Value"]

    route53 = boto3.client("route53")

    logger.info(parameters)

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
def create_load_balancer_listener(
    load_balancer, target_group, certificate, ready_for_listeners
):
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


@task(name="Create ECS Task Definition")
def create_task_definition(slug, api_endpoint):
    basename = slug["basename"]
    database = slug["database"]
    graphql_endpoint = slug["graphql_endpoint"]
    logger.info("Adding task definition")
    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)

    logger.info("API Endpoint: ")
    logger.info(api_endpoint)

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
                "image": "hasura/graphql-engine:v2.7.0",
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
                        "name": "HASURA_GRAPHQL_ADMIN_SECRET",
                        "value": shared.generate_access_key(basename),
                    },
                    {
                        "name": "HASURA_GRAPHQL_JWT_SECRET",
                        "value":'{"type":"RS256","jwk_url": "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_U2dzkxfTv/.well-known/jwks.json","claims_format": "stringified_json"}'
                    },
                    {
                        "name": "HASURA_ENDPOINT",
                        "value": "https://" + shared.form_graphql_endpoint_hostname(graphql_endpoint) + "/v1/graphql",
                    },
                    #  This depends on the Moped API endpoint returned from API commission tasks, add /events/ to end
                    {
                        "name": "MOPED_API_EVENTS_URL",
                        "value": api_endpoint + "/events/",
                    },
                    {
                        "name": "MOPED_API_APIKEY",
                        "value": shared.generate_api_key(basename),
                    },
                ],
                "logConfiguration": {
                    "logDriver": "awslogs",
                    "options": {
                        "awslogs-group": CLOUDWATCH_LOG_GROUP,
                        "awslogs-region": AWS_DEFAULT_REGION,
                        "awslogs-stream-prefix": basename,
                    },
                },
            }
        ],
    )

    return response


@task(name="Create ECS Service")
def create_service(
    slug, load_balancer, task_definition, target_group, listeners_token, cluster_token
):
    basename = slug["basename"]
    logger.info("Creating ECS service")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)

    try:
        create_service_result = ecs.create_service(
            cluster=slug["ecs_cluster_name"],
            serviceName=slug["ecs_cluster_name"],
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
    except Exception:
        return False

    return create_service_result


@task(name="Update ECS Service")
def update_service(
    slug, load_balancer, task_definition, target_group, listeners_token, cluster_token
):
    logger.info("Creating ECS service")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)

    update_service_result = ecs.update_service(
        cluster=slug["ecs_cluster_name"],
        service=slug["ecs_cluster_name"],
        taskDefinition=task_definition["taskDefinition"]["taskDefinitionArn"],
        desiredCount=1,
        loadBalancers=[
            {
                "targetGroupArn": target_group["TargetGroups"][0]["TargetGroupArn"],
                "containerName": "graphql-engine",
                "containerPort": 8080,
            }
        ],
    )

    return update_service_result


@task(name="Remove ECS Cluster")
def remove_ecs_cluster(slug, no_service_token):
    logger.info("removing ECS cluster")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)
    delete_cluster_result = ecs.delete_cluster(cluster=slug["ecs_cluster_name"])

    return delete_cluster_result


@task(name="Remove EC2 Target Group")
def remove_target_group(slug, no_listener_token):
    basename = slug["basename"]
    logger.info("Removing target group")

    elb = boto3.client("elbv2")

    target_group = elb.describe_target_groups(Names=[basename])

    delete_target_group_result = elb.delete_target_group(
        TargetGroupArn=target_group["TargetGroups"][0]["TargetGroupArn"]
    )

    return delete_target_group_result


@task(name="Remove EC2 ELB Listeners")
def remove_all_listeners(slug):
    basename = slug["basename"]
    logger.info("Removing all listeners from load balancer")

    elb = boto3.client("elbv2")

    load_balancer = elb.describe_load_balancers(Names=[slug["elb_basename"]])

    listeners = elb.describe_listeners(
        LoadBalancerArn=load_balancer["LoadBalancers"][0]["LoadBalancerArn"]
    )

    for listener in listeners["Listeners"]:
        elb.delete_listener(ListenerArn=listener["ListenerArn"])

    return load_balancer


@task(name="Remove EC2 Elastic Load Balancer")
def remove_load_balancer(slug, no_cluster_token):
    basename = slug["basename"]
    logger.info("removing Load Balancer")

    elb = boto3.client("elbv2")

    load_balancers = elb.describe_load_balancers(Names=[slug["elb_basename"]])

    delete_elb_result = elb.delete_load_balancer(
        LoadBalancerArn=load_balancers["LoadBalancers"][0]["LoadBalancerArn"]
    )

    return delete_elb_result


@task(name="Set ECS Service Task Count")
def set_desired_count_for_service(slug, count):
    logger.info("Setting desired count for service")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)

    services = ecs.describe_services(
        cluster=slug["ecs_cluster_name"], services=[slug["ecs_cluster_name"]]
    )

    if services["services"][0]["status"] == "ACTIVE":
        response = ecs.update_service(
            cluster=slug["ecs_cluster_name"],
            service=slug["ecs_cluster_name"],
            desiredCount=count,
        )
        return response

    return True


@task(name="Lists Tasks of Service")
def list_tasks_for_service(slug):
    logger.info("Listing tasks for service")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)

    response = ecs.list_tasks(
        cluster=slug["ecs_cluster_name"], serviceName=slug["ecs_cluster_name"]
    )

    return response


@task(name="Stop Tasks for ECS Service")
def stop_tasks_for_service(slug, tasks, zero_count_token):
    logger.info("Stopping tasks for service")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)

    responses = []

    for task in tasks["taskArns"]:
        response = ecs.stop_task(
            cluster=slug["ecs_cluster_name"],
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
def wait_for_service_to_be_drained(slug, stop_token):
    logger.info("Waiting for service to be drained")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)

    tasks = ecs.list_tasks(
        cluster=slug["ecs_cluster_name"], serviceName=slug["ecs_cluster_name"]
    )

    if len(tasks["taskArns"]) == 0:
        return Exception("Still have tasks hanging around!")

    return True


@task(name="Remove ECS Task Definition")
def remove_task_definition(task_definition):
    logger.info("removing task definition")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)
    response = ecs.deregister_task_definition(
        taskDefinition=task_definition["taskDefinition"]["taskDefinitionArn"]
    )

    return response


@task(name="Remove ECS Service")
def delete_service(slug, drained_token, no_target_group_token):
    logger.info("Deleting service")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)
    response = ecs.delete_service(
        cluster=slug["ecs_cluster_name"], service=slug["ecs_cluster_name"]
    )

    return response


@task(name="Remove Route53 CNAME")
def remove_route53_cname(slug, removed_load_balancer_token):
    logger.info("Removing Route53 CNAME")

    route53 = boto3.client("route53")

    hostname = slug["graphql_endpoint"] + "-graphql.moped-test.austinmobility.io."

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
def remove_certificate(slug, removed_hostname_token):
    basename = slug["basename"]
    logger.info("Removing certificate")

    logger.info("Sleeping for 10 seconds to allow for certificate to be removed")
    time.sleep(15)

    acm = boto3.client("acm")

    host = slug["graphql_endpoint"] + "-graphql.moped-test.austinmobility.io"

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


@task(
    name="Check HTTP status code for graphql endpoint",
    max_retries=12,
    retry_delay=timedelta(seconds=10),
)
def check_graphql_endpoint_status(slug, graphql_engine_service):
    endpoint = (
        "https://"
        + shared.form_graphql_endpoint_hostname(slug["graphql_endpoint"])
        + "/healthz"
    )

    logger.info("Endpoint: " + endpoint)

    response = requests.get(endpoint)
    status = response.status_code

    if status == 200:
        logger.info("OK: HTTP status code for graphql endpoint is {}".format(status))
        return True
    else:
        logger.info(
            "Not OK: HTTP status code for graphql endpoint is {}".format(status)
        )
        raise


@task(name="Count existing listeners for ELB")
def count_existing_listeners(slug, load_balancer):
    # creating a new ELB is idempotent, so we have to count listeners before we add them
    basename = slug["basename"]

    logger.info("Counting listeners")
    elb = boto3.client("elbv2")

    arn = load_balancer["LoadBalancers"][0]["LoadBalancerArn"]

    response = elb.describe_listeners(LoadBalancerArn=arn)

    logger.info(response["Listeners"])

    if len(response["Listeners"]) == 0:
        return True
    else:
        return False


@task(name="Check for running (ECS) tasks for service")
def check_count_running_ecs_tasks(slug):
    logger.info("Are there running tasks")

    ecs = boto3.client("ecs", region_name=AWS_DEFAULT_REGION)
    response = ecs.describe_clusters(clusters=[slug["ecs_cluster_name"]])

    logger.info(response)

    if response["clusters"][0]["runningTasksCount"] > 0:
        return True
    else:
        return False
