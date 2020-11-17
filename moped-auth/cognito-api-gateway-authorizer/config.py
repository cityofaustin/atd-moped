import os
import json
import boto3
import urllib.request

#
# A few constants
#
AWS_ATD_REGION = os.getenv("AWS_ATD_REGION")  # i.e., us-east-1
AWS_ATD_USER_POOL = os.getenv("AWS_ATD_USER_POOL")  # i.e., ap-southeast-2_xxxxxxxxx
AWS_ATD_APP_CLIENT_ID = os.getenv("AWS_ATD_APP_CLIENT_ID")
AWS_ATD_API_GATEWAY_ARN = os.getenv("AWS_ATD_API_GATEWAY_ARN")  #i.e., arn:aws:execute-api:us-east-1:123456789123:abc321def654
#
# Generates a JWKs endpoint
#
ATD_JWKS_ENDPOINT = "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json".format(
    AWS_ATD_REGION, AWS_ATD_USER_POOL
)

#
# Keys, download JWK on cold start
# https://aws.amazon.com/blogs/compute/container-reuse-in-lambda/
with urllib.request.urlopen(ATD_JWKS_ENDPOINT) as f:
    response = f.read()
ATD_JWK_KEYS = json.loads(response.decode("utf-8"))["keys"]


def get_keys_url() -> str:
    return ""
