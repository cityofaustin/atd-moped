"""
Queries for Moped DB

The upsert query is used to insert or update the eCapris funding records into the Moped DB.
eCapris funding records can be edited so we need to handle updates.
"""

GRAPHQL_QUERIES = {
    "subprojects_to_query_for_funding": """
    query MopedProjects {
        moped_project(where: {ecapris_subproject_id: {_is_null: false}, is_deleted: {_eq: false}}, distinct_on: ecapris_subproject_id) {
            ecapris_subproject_id
        }
    }
    """,
    "project_funding_upsert": """
    mutation UpsertEcaprisFunding($objects: [ecapris_subproject_funding_insert_input!]!) {
        insert_ecapris_subproject_funding(objects: $objects, on_conflict: {constraint: ecapris_subproject_funding_fao_id_key, 
        update_columns: [app, unit_long_name, subprogram, program, bond_year, ecapris_subproject_id]}) {
            returning {
                fao_id
                ecapris_subproject_id
            }
        }
    }
    """,
}
