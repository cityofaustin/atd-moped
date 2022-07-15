import os

from datetime import timedelta
import boto3
import prefect
from prefect import Flow, task
import pprint

# set up the prefect logging system
logger = prefect.context.get("logger")

# AWS ARN-like identifiers
R53_HOSTED_ZONE = os.environ["R53_HOSTED_ZONE"]
VPC_ID = os.environ["VPC_ID"]
VPC_SUBNET_A = os.environ["VPC_SUBNET_A"]
VPC_SUBNET_B = os.environ["VPC_SUBNET_B"]
ELB_SECURITY_GROUP = os.environ["ELB_SECURITY_GROUP"]
TASK_ROLE_ARN = os.environ["TASK_ROLE_ARN"]

@task
def create_ecs_cluster(basename):
    # Deploy ECS cluster
    logger.info("Creating ECS cluster")

    ecs = boto3.client("ecs", region_name="us-east-1")
    create_cluster_result = ecs.create_cluster(clusterName=basename)

    logger.info("Cluster ARN: " + create_cluster_result["cluster"]["clusterArn"])

    return create_cluster_result


@task
def remove_ecs_cluster(cluster):
    # Remove ECS cluster
    logger.info("removing ECS cluster")

    ecs = boto3.client("ecs", region_name="us-east-1")
    delete_cluster_result = ecs.delete_cluster(
        cluster=cluster["cluster"]["clusterName"]
    )

    return delete_cluster_result


@task
def create_load_balancer(basename):

    logger.info("Creating Load Balancer")
    elb = boto3.client("elbv2")

    create_elb_result = elb.create_load_balancer(
        Name=basename,
        Subnets=[VPC_SUBNET_A, VPC_SUBNET_B],
        SecurityGroups=[ELB_SECURITY_GROUP],
        Scheme="internet-facing",
        Tags=[
            {
                "Key": "name",
                "Value": basename,
            },
        ],
        Type="application",
        IpAddressType="ipv4",
    )

    return create_elb_result

@task
def create_target_group(basename):
    logger.info("Creating Target Group")

    elb = boto3.client("elbv2")

    # TODO create a health check for the target group

    target_group = elb.create_target_group(
        Name=basename,
        Protocol="HTTP",
        Port=8080,
        VpcId=VPC_ID,
    )

    return target_group
   
@task
def create_route53_cname(basename, load_balancer):
    logger.info("Creating Route53 CNAME")

    if False:
        print("")
        pp = pprint.PrettyPrinter(indent=2)
        pp.pprint(load_balancer)
        print("")

    host = basename + "-graphql.moped-test.austinmobility.io"
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
                        "ResourceRecords": [
                            {"Value": target},
                        ],
                    },
                },
            ]
        },
    )

    return record

@task(max_retries=12, retry_delay=timedelta(seconds=10))
def check_dns_status(dns_request):
    logger.info("Checking DNS status")

    route53 = boto3.client("route53")

    dns_status = route53.get_change(Id=dns_request["ChangeInfo"]["Id"])
    if False:
        print("")
        pp = pprint.PrettyPrinter(indent=2)
        pp.pprint(dns_status)
        print("")
    status = dns_status["ChangeInfo"]["Status"] 

    print("DNS status: " + status)

    if status == "INSYNC":
        return dns_status
    if status == "PENDING":
        raise Exception("DNS Status is 'PENDING' for request: " + dns_request["ChangeInfo"]["Id"])

    raise Exception("Unexpected DNS status: " + status)

   
@task
def create_certificate(basename, dns_status):
    logger.info("Creating TLS Certificate")

    acm = boto3.client('acm')

    host = basename + "-graphql.moped-test.austinmobility.io"

    certificate = acm.request_certificate(
        DomainName=host,
        ValidationMethod="DNS",
    )

    if False:
        print("")
        pp = pprint.PrettyPrinter(indent=2)
        pp.pprint(certificate)
        print("")

    return certificate
   
@task(max_retries=12, retry_delay=timedelta(seconds=10))
def get_certificate_validation_parameters(tls_certificate):
    logger.info("Validating TLS Certificate")

    acm = boto3.client('acm')

    certificate = acm.describe_certificate(CertificateArn=tls_certificate["CertificateArn"])
    if not certificate["Certificate"]["DomainValidationOptions"][0]["ResourceRecord"]["Name"]:
        raise Exception("No Domain Validation Resource Record Options")

    if True:
        print("")
        pp = pprint.PrettyPrinter(indent=2)
        pp.pprint(certificate)
        print("")

    return certificate


    #certificate = elb.create_certificate(
        #DomainName=basename,
        #ValidationMethod="DNS",
    #)

    return True
   

@task
def create_load_balancer_listener(load_balancer, target_group):
    logger.info("Creating Load Balancer Listener")
    elb = boto3.client("elbv2")

    if True:
        print("")
        pp = pprint.PrettyPrinter(indent=2)
        pp.pprint(target_group)
        print("")

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
            },
        ],
    )

    #listeners["HTTPS"] = elb.create_listener(
        #LoadBalancerArn=load_balancer["LoadBalancers"][0]["LoadBalancerArn"],
        #Protocol="HTTPS",
        #Port=443,
        #SslPolicy="ELBSecurityPolicy-2016-08", # interestingly, not a managed policy.
        
        #DefaultActions=[
            #{
                #"Type": "forward",
                #"TargetGroupArn": target_group["TargetGroups"][0]["TargetGroupArn"],
                ##TODO figure out where i get or make a target group
            #},
        #],
    #)

    return listeners



@task
def remove_load_balancer(load_balancer):
    logger.info("removing Load Balancer")

    elb = boto3.client("elbv2")
    delete_elb_result = elb.delete_load_balancer(
        LoadBalancerArn=load_balancer["LoadBalancers"][0]["LoadBalancerArn"]
    )

    return delete_elb_result


@task
def create_task_definition(basename):
    logger.info("Adding task definition")
    ecs = boto3.client("ecs", region_name="us-east-1")

    response = ecs.register_task_definition(
        family="moped-graphql-endpoint-" + basename,
        executionRoleArn=TASK_ROLE_ARN,
        networkMode="awsvpc",
        requiresCompatibilities=["FARGATE"],
        cpu="256",
        memory="1024",
        containerDefinitions=[
            {
                "name": "graphql-engine",
                "image": "hasura/graphql-engine:latest",
                "cpu": 256,
                "memory": 512,
                "portMappings": [
                    {"containerPort": 8080, "hostPort": 8080, "protocol": "tcp"},
                ],
                "essential": True,
                "environment": [
                    {
                        "name": "HASURA_GRAPHQL_ENABLE_CONSOLE",
                        "value": "true",
                    },
                    {
                        "name": "HASURA_GRAPHQL_ENABLE_TELEMETRY",
                        "value": "false",
                    },
                ],
                "logConfiguration": {
                    "logDriver": "awslogs",
                    "options": {
                        "awslogs-group": "moped-test",
                        "awslogs-region": "us-east-1",
                        "awslogs-stream-prefix": basename,
                    },
                },
            },
        ],
    )

    return response


@task
def remove_task_definition(task_definition):
    logger.info("removing task definition")

    ecs = boto3.client("ecs", region_name="us-east-1")
    response = ecs.deregister_task_definition(
        taskDefinition=task_definition["taskDefinition"]["taskDefinitionArn"]
    )

    return response


# Activity log (SQS & Lambda) tasks

@task
def create_service(basename, load_balancer, task_definition):

    return True

    # Create ECS service
    logger.info("Creating ECS service")

    if False:
        print("")
        pp = pprint.PrettyPrinter(indent=2)
        pp.pprint(load_balancer)
        print("")

    ecs = boto3.client("ecs", region_name="us-east-1")

    create_service_result = ecs.create_service(
        cluster=basename,
        serviceName=basename,
        taskDefinition=task_definition["taskDefinition"]["taskDefinitionArn"],
        desiredCount=1,
        placementStrategy=[
            {
                "type": "spread",
                "field": "attribute:ecs.availability-zone",
            },
        ],
        loadBalancers=[
            {
                "targetGroupArn": load_balancer["LoadBalancers"][0]["LoadBalancerArn"],
                #"loadBalancerName": load_balancer["LoadBalancers"][0]["LoadBalancerName"],
                "containerName": "graphql-engine",
                "containerPort": 8080,
            },
        ],
        tags=[
            {
                "key": "name",
                "value": basename,
            },
        ],
    )

    return create_service_result