INSERT_PROJECT_MUTATION = """
    mutation InsertProject($object: moped_project_insert_input!) {
        insert_moped_project_one(object: $object) {
            project_id
        }
    }
"""
