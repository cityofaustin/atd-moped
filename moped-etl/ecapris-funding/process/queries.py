"""
Queries for Moped DB

The upsert query is used to insert or update the eCapris statuses into the Moped DB.
eCapris statuses can be edited within 7 days after the status review date so we need to handle updates.
"""

GRAPHQL_QUERIES = {
    "subprojects_to_query_for_funding": """
    query MopedProjects {
        moped_project(where: {ecapris_subproject_id: {_is_null: false}, is_deleted: {_eq: false}, should_sync_ecapris_funding: {_eq: true}}) {
            project_id
            ecapris_subproject_id
        }
    }
    """,
    "project_funding_upsert": """
    mutation UpsertProjectFunding($objects: [moped_project_funding_insert_input!]!) {
        insert_moped_project_funding(
            objects: $objects,
            on_conflict: {
                constraint: moped_proj_funding_unique_fdu_project_id,
                do_nothing: {}
            }
        ) {
            returning {
                project_funding_id
                project_id
            }
    }
    """,
}
