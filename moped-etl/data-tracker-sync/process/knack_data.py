#
# Knack Data Helper - Build Knack records from Moped records
#

MOPED_TO_KNACK_FIELD_MAP = {
    "project_id": "field_4133",
    "project_name": "field_3857",
    "current_phase_name": "field_4136",
    "signals_connection": "field_3861",
    "moped_url_object": "field_4162",
}


def build_signal_list_from_moped_record(moped_project_record):
    """
    Build a list of signal IDs connected to a moped projet record

    Parameters:
        Moped Project (dictionary): A moped project as returned by graphql-engine

    Returns:
        List: A list of all unique internal IDs used by Knack to for the signals
    """
    knack_signals_ids = set()
    moped_project_components = moped_project_record["moped_proj_components"]

    for component in moped_project_components:
        for feature in component["feature_signals"]:
            knack_signals.add(feature["knack_id"])

    return list(knack_signals_ids)


def make_moped_project_url(project_id):
    """
    Build a moped project URL from a project ID

    Parameters:
        project_id (string): A moped project ID

    Returns:
        String: A moped project URL
    """
    return f"https://mobility.austin.gov/moped/projects/{project_id}"


def build_knack_project_from_moped_project(moped_project_record):
    """
    Build a Knack project record from Moped project records

    Parameters:
        Moped Project (dictionary): A moped project as returned by graphql-engine

    Returns:
        Dictionary: A Knack project record
    """
    signals = build_signal_list_from_moped_record(moped_project_record)

    return {
        "field_4133": moped_project_record["project_id"],
        "field_3857": moped_project_record["project_name"],
        "field_4136": moped_project_record["current_phase_view"]["phase_name"],
        "field_3861": signals,
        "field_4162": make_moped_project_url(moped_project_record["project_id"]),
    }
