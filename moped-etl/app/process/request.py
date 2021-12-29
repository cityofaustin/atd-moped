#
# Request Helper - Makes requests to a Hasura/GraphQL or Knack endpoint
#

import os
import time
import requests

MAX_ATTEMPTS = int(os.getenv("HASURA_MAX_ATTEMPTS"))
RETRY_WAIT_TIME = os.getenv("HASURA_RETRY_WAIT_TIME")
HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT")
HASURA_ADMIN_KEY = os.getenv("HASURA_ADMIN_KEY")


def run_query(query):
    """
    Runs a GraphQL query against Hasura via an HTTP POST request.
    :param query: string - The GraphQL query to execute (query, mutation, etc.)
    :return: object - A Json dictionary directly from Hasura
    """
    # Build Header with Admin Secret
    headers = {
        "x-hasura-admin-secret": HASURA_ADMIN_KEY
    }

    # Try up to n times as defined by max_attempts
    for current_attempt in range(MAX_ATTEMPTS):
        # Try making the request via POST
        try:
            return requests.post(HASURA_ENDPOINT,
                                 json={'query': query},
                                 headers=headers).json()
        except Exception as e:
            print("Exception, could not insert: " + str(e))
            print("Query: '%s'" % query)
            response = {
                "errors": "Exception, could not insert: " + str(e),
                "query": query
            }

            # If the current attempt is equal to MAX_ATTEMPTS, then exit with failure
            if current_attempt == MAX_ATTEMPTS:
                return response

            # If less than 5, then wait 5 seconds and try again
            else:
                print("Attempt (%s out of %s)" % (current_attempt+1, MAX_ATTEMPTS))
                print("Trying again in %s seconds..." % RETRY_WAIT_TIME)
                time.sleep(RETRY_WAIT_TIME)
