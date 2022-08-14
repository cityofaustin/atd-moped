import prefect
from prefect import task
from prefect.tasks.shell import ShellTask
from tasks.ecs import form_hostname, generate_access_key

@task(name="Get graphql-engine hostname")
def get_graphql_engine_hostname(basename):
    return form_hostname(basename)

@task(name="Get graphql-engine access key")
def get_graphql_engine_access_key(basename):
    return generate_access_key(basename)

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


remove_moped_checkout = ShellTask(name="Remove Moped checkout", stream_output=True)
clone_moped_repo = ShellTask(name="Clone Moped Repo", stream_output=True)
checkout_target_branch = ShellTask(name="Checkout target branch", stream_output=True)
migrate_db = ShellTask(name="Migrate DB", stream_output=True)
apply_metadata = ShellTask(name="Apply Metadata", stream_output=True)
