"""
Queries for Moped DB

The upsert query is used to insert or update the eCapris statuses into the Moped DB.
eCapris statuses can be edited within 7 days after the status review date so we need to handle updates.
"""

GRAPHQL_QUERIES = {
    "subprojects_to_query_for_funding": """
    query MopedProjects {
        moped_project(where: {ecapris_subproject_id: {_is_null: false}, is_deleted: {_eq: false}, should_sync_ecapris_funding: {_eq: true}}, distinct_on: ecapris_subproject_id) {
            ecapris_subproject_id
        }
    }
    """,
}
