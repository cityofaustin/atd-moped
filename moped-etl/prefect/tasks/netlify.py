import os

# set up the prefect logging system
logger = prefect.context.get("logger")

# AWS ARN-like identifiers
NETLIFY_BUILD_HOOK = os.environ["NETLIFY_BUILD_HOOK"]