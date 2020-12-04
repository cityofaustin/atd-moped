import os
import json
import urllib.request
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

#
# A few constants
#
AWS_ATD_MOPED_REGION = os.getenv("AWS_ATD_MOPED_REGION")  # i.e., us-east-1
AWS_ATD_MOPED_USER_POOL = os.getenv("AWS_ATD_MOPED_USER_POOL")  # i.e., ap-southeast-2_xxxxxxxxx
AWS_ATD_MOPED_APP_CLIENT_ID = os.getenv("AWS_ATD_MOPED_APP_CLIENT_ID")
AWS_ATD_MOPED_API_GATEWAY_ARN = os.getenv("AWS_ATD_MOPED_API_GATEWAY_ARN")  #i.e., arn:aws:execute-api:us-east-1:123456789123:abc321def654

# JWK Keys Management
AWS_ATD_MOPED_JWK_KEYS_LOAD = os.getenv("AWS_ATD_MOPED_JWK_KEYS_LOAD", "FALSE")
AWS_ATD_MOPED_JWK_KEYS = None
#
# Generates a JWKs endpoint
#
AWS_ATD_MOPED_JWKS_ENDPOINT = "https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json".format(
    AWS_ATD_MOPED_REGION, AWS_ATD_MOPED_USER_POOL
)

#
# Keys, download JWK on cold start
# https://aws.amazon.com/blogs/compute/container-reuse-in-lambda/
if AWS_ATD_MOPED_JWK_KEYS_LOAD == "TRUE":
    with urllib.request.urlopen(AWS_ATD_MOPED_JWKS_ENDPOINT) as f:
        response = f.read()
    AWS_ATD_MOPED_JWK_KEYS = json.loads(response.decode("utf-8"))["keys"]
else:
    AWS_ATD_MOPED_JWK_KEYS = None
    logger.info(f"Skipping loading JWK keys.")
