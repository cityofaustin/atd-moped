import os
import json
import requests

import prefect
from prefect import task
import pprint as pretty_printer
from datetime import timedelta

logger = prefect.context.get("logger")

NETLIFY_BUILD_HOOK = os.environ["NETLIFY_BUILD_HOOK"]
NETLIFY_ACCESS_TOKEN = os.environ["NETLIFY_ACCESS_TOKEN"]
NETLIFY_SITE_ID = os.environ["NETLIFY_SITE_ID"]
NETLIFY_API_URL = os.environ["NETLIFY_API_URL"]
NETLIFY_SEARCH_BACK_DISTANCE_FIND_BUILDS = os.environ["NETLIFY_SEARCH_BACK_DISTANCE_FIND_BUILDS"]


def pprint(string):
    print("")
    pp = pretty_printer.PrettyPrinter(indent=2)
    pp.pprint(string)
    print("")


@task(
    name="Check if build is complete", max_retries=24, retry_delay=timedelta(seconds=10)
)
def netlify_check_build(branch, build_token):
    logger.info("Checking netlify build")

    URL = NETLIFY_API_URL + "sites/" + NETLIFY_SITE_ID + "/deploys"
    headers = {"Authorization": "Bearer " + NETLIFY_ACCESS_TOKEN}
    parameters = {
        "page": 1,
        "per_page": NETLIFY_SEARCH_BACK_DISTANCE_FIND_BUILDS,
    }

    request = requests.request("GET", URL, headers=headers, params=parameters)
    response = json.loads(request.text)

    id = None
    state = None

    for deployment in response:
        if deployment["branch"] == branch:
            id = deployment["id"]
            state = deployment["state"]
            # pprint(deployment)
            break

    if state != "ready":
        raise Exception("Build is not ready")

    return True


@task
def trigger_netlify_build(branch):
    logger.info("Triggering netlify build")

    HTTP_parameters = {
        "trigger_branch": branch,
        "trigger_title": "Test Build of " + branch,
    }

    response = requests.request("POST", NETLIFY_BUILD_HOOK, params=HTTP_parameters)

    # pprint(response.status_code)
    # pprint(response.headers)
    # pprint(response.text)

    return response
