import os
import requests

import prefect
from prefect import Flow, task
import pprint as pretty_printer

# set up the prefect logging system
logger = prefect.context.get("logger")

NETLIFY_BUILD_HOOK = os.environ["NETLIFY_BUILD_HOOK"]


def pprint(string):
    print("")
    pp = pretty_printer.PrettyPrinter(indent=2)
    pp.pprint(string)
    print("")


@task
def trigger_netlify_build(branch):
    logger.info("Triggering netlify build")

    HTTP_parameters = {
        "trigger_branch": branch,
        "trigger_title": "Test Build of " + branch,
    }

    request = requests.request("POST", NETLIFY_BUILD_HOOK, params=HTTP_parameters)

    pprint(request.status_code)
    pprint(request.headers)
    pprint(request.text)
