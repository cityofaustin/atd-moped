import os
import json
import requests

import tasks.shared as shared

import prefect
from prefect import task
import pprint as pretty_printer
from datetime import timedelta

logger = prefect.context.get("logger")

NETLIFY_BUILD_HOOK = os.environ["NETLIFY_BUILD_HOOK"]
NETLIFY_ACCESS_TOKEN = os.environ["NETLIFY_ACCESS_TOKEN"]
NETLIFY_SITE_ID = os.environ["NETLIFY_SITE_ID"]
NETLIFY_API_URL = os.environ["NETLIFY_API_URL"]
NETLIFY_SEARCH_BACK_DISTANCE_FIND_BUILDS = os.environ[
    "NETLIFY_SEARCH_BACK_DISTANCE_FIND_BUILDS"
]


def pprint(string):
    print("")
    pp = pretty_printer.PrettyPrinter(indent=2)
    pp.pprint(string)
    print("")


@task(
    name="Check if build is complete", max_retries=24, retry_delay=timedelta(seconds=10)
)
def netlify_check_build(slug, build_token):
    branch = slug["basename"]
    logger.info("Checking netlify build")

    URL = NETLIFY_API_URL + "sites/" + NETLIFY_SITE_ID + "/deploys"
    headers = {"Authorization": "Bearer " + NETLIFY_ACCESS_TOKEN}
    parameters = {"page": 1, "per_page": NETLIFY_SEARCH_BACK_DISTANCE_FIND_BUILDS}

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

    # print("State: " + str(state))

    if state != "ready":
        raise Exception("Build is not ready")

    return True


@task
def trigger_netlify_build(slug, api_endpoint_url):
    branch = slug["basename"]
    logger.info("Triggering netlify build")

    HTTP_parameters = {
        "trigger_branch": branch,
        "trigger_title": "Test Build of " + branch,
    }

    graphql_endpoint = (
        "https://" + shared.form_graphql_endpoint_hostname(branch) + "/v1/graphql"
    )

    # See https://github.com/cityofaustin/atd-moped/blob/main/moped-editor/.env-cmdrc#L52-L76
    # These values can be overloaded for a frontend deployment.
    # This is how we would set a graphql-endpoint URL, for example.
    # ↓↓↓↓

    ENV = {
        "REACT_APP_HASURA_ENDPOINT": graphql_endpoint,
        "REACT_APP_API_ENDPOINT": api_endpoint_url,
    }

    environment = json.dumps(ENV)

    response = requests.request(
        "POST", NETLIFY_BUILD_HOOK, params=HTTP_parameters, data=environment
    )

    # pprint(response.status_code)
    # pprint(response.headers)
    # pprint(response.text)

    return response
