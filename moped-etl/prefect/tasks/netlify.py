import os
import prefect
import requests

# set up the prefect logging system
logger = prefect.context.get("logger")

NETLIFY_BUILD_HOOK = os.environ["NETLIFY_BUILD_HOOK"]


def pprint(string):
    print("")
    pp = pretty_printer.PrettyPrinter(indent=2)
    pp.pprint(string)
    print("")
