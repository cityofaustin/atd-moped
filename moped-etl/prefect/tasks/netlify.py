import os
import prefect
from prefect import Flow, task
import requests

# set up the prefect logging system
logger = prefect.context.get("logger")

NETLIFY_BUILD_HOOK = os.environ["NETLIFY_BUILD_HOOK"]


def pprint(string):
    print("")
    pp = pretty_printer.PrettyPrinter(indent=2)
    pp.pprint(string)
    print("")


@task
def trigger_netlify_build():
    logger.info("Triggering netlify build")

    HTTP_parameters = {
        "trigger_branch": "netlify-test-deployment",
        "trigger_title": "Dev Test Build",
    }

    request = requests.request("POST", NETLIFY_BUILD_HOOK, params=HTTP_parameters)

    pprint(request)

    # r = requests.post(NETLIFY_BUILD_HOOK)
    # logger.info("netlify build triggered")
    # return r.status_code
