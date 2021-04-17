#
# Moped Project Phases Mapping configuration
#

from helpers import *

MOPED_PHASES = {
    "potential": 1,
    "planned": 2,
    "preliminary engineering": 3,
    "scoping": 4,
    "preliminary design":  5,
    "design": 6,
    "pre-construction": 7,
    "construction-ready": 8,
    "construction":	9,
    "post-construction": 10,
    "complete":	11,
}


ACCESS_PHASES_TO_MOPED_PHASES = {
    # These must be ignored (value: 0), they will be taken by another process
    "canceled": 0,
    "corridorplan - corridor funding available": 0,
    "corridorplan - environmental study in progress": 0,
    "corridorplan - environmentally cleared": 0,
    "corridorplan - planning process - complete": 0,
    "corridorplan - planning process - in progress": 0,
    "hold": 0,
    "removed": 0,

    # These have mappings:
    "100% design": 6,
    "30% design": 6,
    "60% design": 6,
    "90% design": 6,
    "complete": 11,
    "complete - minor modifications in progress": 11,
    "construction": 9,
    "construction ready": 8,
    "design": 6,
    "design - initial field visit": 6,
    "design - preliminary schematic complete": 6,
    "design by others": 6,
    "planned": 2,
    "planned - coordination needed": 2,
    "planned - resurfacing not required": 2,
    "planned - resurfacing scheduled": 2,
    "post construction": 10,
    "post-inst. study": 10,
    "potential": 1,
    "potential - active development review": 1,
    "potential - feasibility study": 1,
    "potential - need to request resurfacing": 1,
    "potential - reconstruction priority": 1,
    "potential - resurfacing deferred": 1,
    "potential - resurfacing not required": 1,
    "potential - resurfacing requested": 1,
    "potential - resurfacing scheduled": 1,
    "preliminary design": 5,
    "preliminary engineering": 3,
    "procurement": 7,
    "resurfaced - on hold": 1,
    "scheduled for construction": 8,
    "scoping": 4,
    "substantially complete": 11,
    "tbd": 1,
    "unlikely": 1,
    "work order submitted": 8,
}


def get_phase_id(access_phase_name: str) -> int:
    """
    Using the access phase name, retrieves the moped phase id
    :param str access_phase_name: The access phase name
    :return int:
    """
    return ACCESS_PHASES_TO_MOPED_PHASES.get(access_phase_name, 0)


def get_moped_phase_name(access_phase_name: str) -> str:
    """
    Using the access phase name, retrieves the moped phase name
    :param str access_phase_name: The access phase name
    :return str:
    """
    moped_phase_id = get_phase_id(access_phase_name)
    # Loop through each phase and if the ID is the same, return the name
    for moped_phase in MOPED_PHASES:
        if MOPED_PHASES[moped_phase] == moped_phase_id:
            return moped_phase

#
# Main Configuration
#
moped_project_phases_process = {
    # Lave it here for now...
    "table": "moped_proj_personnel",

    # SQL Query (the order of the columns affects the lambda function below)
    "sql": "SELECT `ProjectID`, LOWER(`ProjectPhase`) FROM `Projects`",

    # Basically, this lambda function will rename the keys
    # so that it's compatible with Hasura by creating/replacing
    # the current object with a new one.
    "transform": lambda row: {
        "project_id": row[0],
        "project_phase_id": get_phase_id(row[1]),
        "phase_name": get_moped_phase_name(row[1]),
        "completion_percentage": 100,
        "completed": True
    },

    "prefilter": None,

    # Special rules that cannot be put here
    "cleanup": None,

    # Mutation Template
    "graphql": """
        mutation MigrateMopedProjectPhases($object: moped_proj_phases_insert_input!) {
            insert_moped_proj_phases(
                objects: [$object],
                on_conflict: {
                    constraint: moped_phase_history_pkey,
                    update_columns: [
                        project_id
                        phase_name
                        project_phase_id
                    ]
                }
            ) {
                affected_rows
            }
        }
    """
}
