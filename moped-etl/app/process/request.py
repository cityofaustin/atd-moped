#
# Request Helper - Makes requests to a Hasura/GraphQL or Knack endpoint
#

import os
import time
import knackpy
import requests

MAX_ATTEMPTS = int(os.getenv("HASURA_MAX_ATTEMPTS"))
RETRY_WAIT_TIME = os.getenv("HASURA_RETRY_WAIT_TIME")
HASURA_ENDPOINT = os.getenv("HASURA_ENDPOINT")
HASURA_ADMIN_KEY = os.getenv("HASURA_ADMIN_KEY")
KNACK_DATA_TRACKER_APP_ID = os.getenv("KNACK_DATA_TRACKER_APP_ID")
KNACK_DATA_TRACKER_VIEW = os.getenv("KNACK_DATA_TRACKER_VIEW")

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


def run_knack_project_query(knack_object_keys):
    """
    Utilize knackpy to pull data and build object from Knack for projects.
    :param knack_object_keys: dictionary - Knack object keys 
    :return: dict - Dictionary of projects in Knack containing Moped IDs
    """


    app = knackpy.App(app_id=KNACK_DATA_TRACKER_APP_ID)
    records = app.get('view_' + KNACK_DATA_TRACKER_VIEW, generate=1)
    knack_records = {}
    for record in records:
        if (record[knack_object_keys['PROJECT_ID']] == None):
            continue
        #print(record[knack_object_keys['PROJECT_ID']]) # accessing a particular field value defined by env variables
        knack_records[record[knack_object_keys['PROJECT_ID']]] = record
    return(knack_records)