import os

import boto3
import prefect
from prefect import Flow, task

# set up the prefect logging system
logger = prefect.context.get("logger")

# AWS ARN-like identifiers
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
def create_service(basename, load_balancer):
    # Create ECS service
    logger.info("Creating ECS service")

    ecs = boto3.client("ecs", region_name="us-east-1")
    create_service_result = ecs.create_service(
        cluster=basename,
        serviceName=basename,
        taskDefinition=basename,
        desiredCount=1,
        placementStrategy=[
            {
                "type": "spread",
                "field": "attribute:ecs.availability-zone",
            },
        ],
        loadBalancers=[
            {
                "targetGroupArn": "arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/"
                + basename
                + "/1a2b3c4d5e6f7g",
                "containerName": "graphql-engine",
                "containerPort": 8080,
            },
        ],
        healthCheckGroup={
            "healthCheckGroupName": basename,
            "healthCheckType": "ECS",
            "interval": "30",
            "timeout": "5",
            "unhealthyThreshold": "3",
            "healthyThreshold": "5",
        },
        tags=[
            {
                "Key": "name",
                "Value": basename,
            },
        ],
    )

    return create_service_result