import os
import time
import prefect
from datetime import timedelta
from prefect import task
from prefect.tasks.shell import ShellTask

import tasks.shared as shared

# set up the prefect logging system
logger = prefect.context.get("logger")

@task(name="Get graphql-engine hostname")
def get_graphql_engine_hostname(slug):
    basename = slug["basename"]
    return shared.form_graphql_endpoint_hostname(basename)

@task(name="Get graphql-engine access key")
def get_graphql_engine_access_key(slug):
    basename = slug["basename"]
    return shared.generate_access_key(basename)

@task(name="Create graphql-engine config contents")
def create_graphql_engine_config_contents(
    graphql_endpoint, access_key, metadata, checked_out_token
):
    config = f"""version: 2
endpoint: {graphql_endpoint}
metadata_directory: {metadata}
admin_secret: {access_key}
actions:
  kind: synchronous
  handler_webhook_baseurl: {graphql_endpoint}
"""

    config_file = open("/tmp/atd-moped/moped-database/config.yaml", "w")
    config_file.write(config)
    config_file.close()

    return config

@task(name="Get git checkout command")
def get_git_checkout_command(slug):
    basename = slug["basename"]
    return f"git -C /tmp/atd-moped/ checkout {basename}"

remove_moped_checkout = ShellTask(name="Remove Moped checkout", stream_output=True)
clone_moped_repo = ShellTask(name="Clone Moped Repo", stream_output=True)
checkout_target_branch = ShellTask(name="Checkout target branch", stream_output=True)
migrate_db = ShellTask(name="Migrate DB", stream_output=True)
apply_metadata = ShellTask(name="Apply Metadata", stream_output=True)

check_for_consistent_metadata = ShellTask(name="Check for consistent metadata", max_retries=12, retry_delay=timedelta(seconds=10))

# this does not work
#@task(name="Check for consistent metadata", max_retries=12, retry_delay=timedelta(seconds=10))
#def check_for_consistent_metadata(migrate_token):
    #output_stream = os.popen("(cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata inconsistency status;)")
    #output = output_stream.read()
    #logger.info(output)
    #return True

@task(name="sleep for 15 seconds")
def sleep_fifteen_seconds(consistent_metadata):
    time.sleep(15)
    return True

# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check version;)
# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata inconsistency status;)
# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check migrate apply;)
# (cd /tmp/atd-moped/moped-database; hasura --skip-update-check metadata apply;)
