#
# Request Helper - Makes requests to a Hasura/GraphQL endpoint
#

import os
import time
import requests
from logging import getLogger

logging = getLogger("request.py")

MAX_ATTEMPTS = int(os.getenv("HASURA_MAX_ATTEMPTS"))
RETRY_WAIT_TIME = int(os.getenv("HASURA_RETRY_WAIT_TIME"))
HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT")
HASURA_ADMIN_KEY = os.getenv("HASURA_ADMIN_KEY")


def run_query(query):
    """
    Runs a GraphQL query against Hasura via an HTTP POST request.
    :param query: string - The GraphQL query to execute (query, mutation, etc.)
    :return: object - A Json dictionary directly from Hasura
    """
    # Build Header with Admin Secret
    headers = {"x-hasura-admin-secret": HASURA_ADMIN_KEY}

    # Try up to n times as defined by max_attempts
    for current_attempt in range(MAX_ATTEMPTS):
        # Try making the request via POST
        try:
            res = requests.post(HASURA_ENDPOINT, json={"query": query}, headers=headers)
            res.raise_for_status()
            return res.json()
        except Exception as e:
            logging.error(f"Exception, could not insert: {e}")
            logging.error(f"Query: {query}")
            response = {
                "errors": f"Exception, could not insert: {e}",
                "query": query,
            }

            # If the current attempt is equal to MAX_ATTEMPTS, then exit with failure
            if current_attempt == MAX_ATTEMPTS:
                return response

            # If less than 5, then wait 5 seconds and try again
            else:
                logging.info(f"Attempt ({current_attempt + 1} out of {MAX_ATTEMPTS})")
                logging.info(f"Trying again in {RETRY_WAIT_TIME} seconds...")
                time.sleep(RETRY_WAIT_TIME)
    raise ValueError(response)
