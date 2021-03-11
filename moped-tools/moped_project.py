#
# Any kind of massaging before insertion to Hasura
#

def moped_project_cleanup(record):
    # If start_date is empty it will cause a GraphQL syntax error, remote it if empty then.
    if(record["start_date"] == ""):
        del record["start_date"]

    # Return record
    return record
