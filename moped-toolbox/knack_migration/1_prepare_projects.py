"""Prepare project object payloads to be included in graphql mutations"""

import argparse
import json
import os
from pprint import pprint as print

import arrow

from logger import get_logger
from queries import (
    PROJECT_PHASES_QUERY,
    PROJECT_SUBPHASES_QUERY,
    MOPED_USERS_QUERY,
    MOPED_FUND_SOURCES_QUERY,
    MOPED_FUND_PROGRAMS_QUERY,
    MOPED_TYPES_QUERY,
    MOPED_ENTITIES_QUERY,
    MOPED_PROJ_ROLES_QUERY,
)
from settings import (
    DATA_SOURCES,
    DATA_READY_DIR,
    LOG_DIR,
    FIELDS,
    FUNDING_MAP,
    INSPECTORS_MAP,
)
from utils import construct_project, make_hasura_request


excluded_projects = []


def build_note(note, user_name, user_id, note_type=2):
    # 2 = status update
    # 1 = internal note
    return {
        "status_id": 1,  # active / not deleted status
        # project note types are hardcoded. see here: https://github.com/cityofaustin/atd-moped/blob/9c6cac2598da48f1e06ab20ac0f7e5074b14cc8e/moped-editor/src/views/projects/projectView/ProjectComments.js#L271
        "project_note_type": note_type,
        "added_by": user_name,
        "added_by_user_id": user_id,
        "project_note": note,
    }


def get_moped_proj_notes(project):
    user_id = project["user_id"]
    user_name = project["user_name"]

    all_notes = []
    # moped db: moped_proj_notes
    project_note = project.get("project_note") or None
    internal_status_note = project.get("internal_status_note") or None
    external_status_note = project.get("external_status_note") or None
    if project_note:
        all_notes.append(build_note(project_note, user_name, user_id))
    if internal_status_note:
        all_notes.append(build_note(internal_status_note, user_name, user_id))
    if external_status_note:
        all_notes.append(build_note(external_status_note, user_name, user_id))
    return all_notes


def set_project_notes(projects):
    for project in projects:
        project["moped_proj_notes"] = get_moped_proj_notes(project)


def set_project_user_id(projects, users_index):
    for p in projects:
        modified_by_email = p.get("email", {}).get("email")
        if not modified_by_email:
            raise ValueError(
                f"This project does not have a last modified by account: {p}"
            )
        try:
            p["user_id"] = users_index[modified_by_email]["user_id"]
            user_first = users_index[modified_by_email]["first_name"]
            user_last = users_index[modified_by_email]["last_name"]
            p["user_name"] = f"{user_first} {user_last}"

        except KeyError:
            logger.warning(f"Unable to find user with email: {modified_by_email}")
            continue
            # raise ValueError(f"Unable to find user with email: {modified_by_email}")


def get_phase(
    *, phase_name, phases, subphases, is_current=True, start_date=None, end_date=None
):
    subphase_id = 0
    subphase_name = None

    if phase_name == "Ready for design":
        phase_name = "Design"
        subphase_name = "Ready for design"
        subphase_id = subphases[subphase_name]

    phase_id = phases.get(phase_name)

    if phase_name and not phase_id:
        raise ValueError(f"Unknown phase: {phase_name}")

    # complete: status_id 5
    # potential: status_id 2
    # active: status_id 1
    return {
        "phase_id": phase_id,
        "phase_name": phase_name.lower(),
        "is_current_phase": is_current,
        "status_id": 1,  # phase is not deleted
        "completion_percentage": 0,
        "completed": False,
        "phase_start": start_date,
        "phase_end": end_date,
        "subphase_name": subphase_name,
        "subphase_id": subphase_id,
    }


def append_phases_to_projects(
    projects,
    phases,
    subphases,
):
    # phase end in phase with complete

    for project in projects:
        project["phases"] = []
        is_status_non_complete_phase_current = True
        completion_date = project.get("completion_date") or None
        if completion_date:
            month, day, year = completion_date.split("/")
            date = f"{year}-{month}-{day}"
            end_date = format_timestamp(date)
            now = arrow.now()
            is_status_non_complete_phase_current = arrow.get(end_date) > now

        # each Knack project will have only one phase
        project["phases"] = [
            get_phase(
                phase_name=project["phase_name"],
                phases=phases,
                subphases=subphases,
                is_current=is_status_non_complete_phase_current,
            )
        ]

        completion_date = project.get("completion_date") or None
        if completion_date:

            phase = get_phase(
                phase_name="Complete",
                phases=phases,
                subphases=subphases,
                start_date=None,
                end_date=end_date,
                is_current=not is_status_non_complete_phase_current,
            )
            project["phases"].append(phase)


def get_signal_index(signals):
    index = {}
    for signal in signals:
        signal_id = int(signal["field_199"])  # signal_id
        index[signal_id] = signal
    return index


def format_signal_type(signal_type):
    if signal_type.lower() in ["traffic", "phb"]:
        return signal_type.lower()
    else:
        raise ValueError(f"Invalid signal type: {signal_type}")


def format_signal(signal):
    return {
        "id": signal["id"],
        "signal_id": signal["field_199"],
        "signal_type": format_signal_type(signal["field_201"]),
        "location_name": signal["field_211_raw"].strip(),
        "coordinates": [
            float(signal["field_182_raw"]["longitude"]),
            float(signal["field_182_raw"]["latitude"]),
        ],
    }


def append_signals_to_projects(projects, signal_index):
    """Raises KeyError if a project's signal can't be found"""
    for p in projects:
        signal_ids = p["signals"]
        if not signal_ids:
            p["signals"] = []
            continue
        p["signals"] = [
            format_signal(signal_index[signal_id]) for signal_id in signal_ids
        ]


def get_task_orders_index(task_orders):
    return {tk["id"]: tk for tk in task_orders}


def get_types_index(types):
    return {t["type_name"]: t for t in types}


def map_dept_unit(dept_unit_key, dept_unit_index):
    field_map = {
        "field_3584": "dept",
        "field_3585": "unit",
        "field_3688": "dept_id",
        "field_3687": "dept_unit_id",
        "field_3689": "unit_long_name",
        "field_3586": "unit_short_name",
        "field_3588": "dept_unit_status",
    }
    dept_unit_knack = dept_unit_index[dept_unit_key["id"]]
    return {
        moped_field_name: dept_unit_knack[knack_field_name]
        for knack_field_name, moped_field_name in field_map.items()
    }


def format_timestamp(iso_timestamp):
    year, month, rest = iso_timestamp.split("-")
    day = rest.split("T")[0]
    return f"{year}-{month}-{day}T00:00:00.000-06:00"


def set_updated_at(projects):
    for project in projects:
        iso_timestamp = project["modified_date"]["iso_timestamp"]
        project["updated_at"] = format_timestamp(iso_timestamp)


def append_funding_sources_to_projects(
    projects,
    dept_unit_index,
    fund_sources_index,
    fund_programs_index,
    knack_funding_map,
):
    projects_to_review = {}

    for project in projects:
        project["moped_proj_funding"] = []

        skipped_funding_sources = []
        skipped_fund_codes = []
        extra_dept_units = []

        funding_status_id = 2  # confirmed
        funding_source_id = None
        fund = None
        funding_source_name = project.get("funding_source_name") or None
        funds = project.get("fund") or None
        dept_units = project.get("dept_unit") or None
        dept_unit = None

        if type(funding_source_name) == list:
            # funding source can be a string or a list
            if len(funding_source_name) > 1:
                skipped_funding_sources = funding_source_name[1:]
            funding_source_name = funding_source_name[0]
            # if its a list with an empty string, convert it to none
            funding_source_name = funding_source_name if funding_source_name else None

        if funding_source_name:
            funding_source_name = knack_funding_map[funding_source_name]

            if funding_source_name:
                funding_source_id = fund_sources_index[funding_source_name][
                    "funding_source_id"
                ]

        if type(funds) == list:
            if len(funds) > 0:
                skipped_fund_codes = funds[1:]
            funds = funds[0] if funds[0] else None

        if funds:
            fund_id, fund_name = (
                [el.strip() for el in funds.split("|")] if funds else [None, None]
            )
            fund_id = int(fund_id) if fund_id else None
            fund = {"fund_id": fund_id, "fund_name": fund_name}

        if dept_units:
            if len(dept_units) > 1:
                extra_dept_units = dept_units[1:]
            dept_unit = map_dept_unit(dept_units[0], dept_unit_index)

        if funding_source_id or fund or dept_unit:
            project["moped_proj_funding"].append(
                {
                    "funding_source_id": funding_source_id,
                    "fund": fund,
                    "funding_status_id": funding_status_id,
                    "dept_unit": dept_unit,
                }
            )

        # now add extra units which will be inserted without other fund properties
        for du in extra_dept_units:
            dept_unit = map_dept_unit(du, dept_unit_index)
            project["moped_proj_funding"].append(
                {"funding_status_id": funding_status_id, "dept_unit": dept_unit}
            )

        knack_project_id = project["knack_project_id"]
        if skipped_funding_sources:
            projects_to_review.setdefault(knack_project_id, {})
            projects_to_review[knack_project_id][
                "skipped_funding_sources"
            ] = skipped_funding_sources
        if skipped_fund_codes:
            projects_to_review.setdefault(knack_project_id, {})
            projects_to_review[knack_project_id][
                "skipped_fund_codes"
            ] = skipped_fund_codes
        if extra_dept_units:
            projects_to_review.setdefault(knack_project_id, {})
            projects_to_review[knack_project_id]["extra_dept_units"] = extra_dept_units
    return projects_to_review


def map_task_order_fields(task_order_knack):
    field_map = {
        "id": "id",
        "field_3806_raw": "atd_task_order__internal_id",
        "field_1276_raw": "dept",
        "field_1277_raw": "task_order",
        "field_2632_raw": "name",
        "field_3810_raw": "status",
        "field_3580_raw": "tk_type",
        "field_3684_raw": "current_estimate",
        "field_3685_raw": "chargedamount",
        "field_3686_raw": "balance",
        "field_3807": "buyer_fdus",
    }
    moped_task_order = {
        moped_field_name: task_order_knack[knack_field_name]
        for knack_field_name, moped_field_name in field_map.items()
    }
    # de-stringify these numerics :/
    moped_task_order["current_estimate"] = float(
        moped_task_order["current_estimate"].replace(",", "")
    )
    moped_task_order["chargedamount"] = float(
        moped_task_order["chargedamount"].replace(",", "")
    )
    moped_task_order["balance"] = float(moped_task_order["balance"].replace(",", ""))
    moped_task_order[
        "display_name"
    ] = f"{moped_task_order['task_order']} | {moped_task_order['name']}"
    return moped_task_order


def append_task_orders_to_projects(projects, task_order_index):
    for p in projects:
        task_orders = []
        task_order_children = p["task_orders"]
        for tk in task_order_children:
            tk_id = tk["id"]
            tk = task_order_index[tk_id]
            moped_tk = map_task_order_fields(tk)
            task_orders.append(moped_tk)
        p["task_orders"] = task_orders


def set_project_types(projects, types_index):
    # there is only one type per project in Data Tracker - can be many in Moped
    for project in projects:
        project_type_name = project.get("project_type_name")
        if not project_type_name:
            project["moped_project_types"] = []
            continue
        try:
            project_type_moped = types_index[project_type_name]
            project_type_id = project_type_moped["type_id"]
        except KeyError:
            raise ValueError(f"Unknown project type: '{project_type_name}'")
        project["moped_project_types"] = [
            {"project_type_id": project_type_id, "status_id": 1}
        ]


def set_sponsor_and_partners(projects, entities_index):
    skipped_sponor = {}
    for project in projects:
        project_sponsor = 0  # this field is required and defaults to 0
        sponsor_id = None
        sponsors = project["project_sponsor"] or None
        partner = project["project_partner"] or None

        if partner:
            entity = entities_index[partner]
            new_partner = {}
            new_partner["partner_name"] = entity["entity_name"]
            new_partner["entity_id"] = entity["entity_id"]
            new_partner["status_id"] = 1
            project["moped_proj_partners"] = [new_partner]
        else:
            project["moped_proj_partners"] = []
        if sponsors:
            # assume only one sponsor — because we cleaned up data tracker project data
            sponsor = sponsors[0]
            try:
                project_sponsor = entities_index[sponsor]["entity_id"]
            except KeyError:
                # should only be intersection safety — for whom we don't have a sponsor
                logger.warning(f"Skipping unknown sponsor {sponsor}")
                skipped_sponor[project["knack_project_id"]] = sponsor
                project_sponsor = 0
        project["project_sponsor"] = project_sponsor
    return skipped_sponor


def set_project_team(projects, users_index, proj_roles_index):
    skipped_designer = {}

    for project in projects:
        project["moped_proj_personnel"] = []
        designer = project.get("designer") or None
        if designer:
            skipped_designer[project["knack_project_id"]] = designer

        inspector = project.get("project_inspector")
        if inspector:
            inspector_email = INSPECTORS_MAP[inspector]
            user = users_index[inspector_email]
            role = proj_roles_index["Inspector"]
            person = {
                "user_id": user["user_id"],
                "role_id": role["project_role_id"],
                "status_id": 1,
            }
            # logger.warning("OVERRIDE PERSON user_id")
            project["moped_proj_personnel"].append(person)

        project_support_user_id = project["user_id"]
        # default the last modified person to "Project support"
        if project_support_user_id:
            role = proj_roles_index["Project support"]
            person = {
                "user_id": project_support_user_id,
                "role_id": role["project_role_id"],
                "status_id": 1,
            }
            project["moped_proj_personnel"].append(person)

    return skipped_designer


def load_json(fname):
    with open(fname, "r") as fin:
        return json.load(fin)


def save_json(data, fname):
    with open(fname, "w") as fout:
        json.dump(data, fout)


def replace_project_keys(projects, fields):
    return [
        {fields[knack_key]: project.get(knack_key) for knack_key in fields.keys()}
        for project in projects
    ]


def set_project_status_id(projects):
    for project in projects:
        project["project_status_id"] = 1  # active by default
        phases = project.get("phases")
        for phase in phases:
            phase_name = phase.get("phase_name")
            is_current = phase.get("is_current_phase")
            if "compl" in phase_name.lower() and is_current:
                # this project is complete
                project["project_status_id"] = 5

def main(env):
    data = {}
    projects_ready = []
    # load data sources
    for source in DATA_SOURCES:
        data[source["name"]] = load_json(source["path"])

    # fetch various lookups from moped
    data["moped_phases"] = make_hasura_request(
        query=PROJECT_PHASES_QUERY, variables=None, key="moped_phases", env=env
    )
    data["moped_subphases"] = make_hasura_request(
        query=PROJECT_SUBPHASES_QUERY, variables=None, key="moped_subphases", env=env
    )
    data["moped_users"] = make_hasura_request(
        query=MOPED_USERS_QUERY, variables=None, key="moped_users", env=env
    )
    data["moped_fund_sources"] = make_hasura_request(
        query=MOPED_FUND_SOURCES_QUERY,
        variables=None,
        key="moped_fund_sources",
        env=env,
    )
    data["moped_fund_programs"] = make_hasura_request(
        query=MOPED_FUND_PROGRAMS_QUERY,
        variables=None,
        key="moped_fund_programs",
        env=env,
    )
    data["moped_types"] = make_hasura_request(
        query=MOPED_TYPES_QUERY, variables=None, key="moped_types", env=env
    )
    data["moped_entity"] = make_hasura_request(
        query=MOPED_ENTITIES_QUERY, variables=None, key="moped_entity", env=env
    )
    data["moped_project_roles"] = make_hasura_request(
        query=MOPED_PROJ_ROLES_QUERY, variables=None, key="moped_project_roles", env=env
    )
    # reduce projects to keys of concern and rename keys
    projects = replace_project_keys(data["projects"], FIELDS)
    signal_index = get_signal_index(data["signals"])
    task_orders_index = get_task_orders_index(data["task_orders"])
    phases_index = {row["phase_name"]: row["phase_id"] for row in data["moped_phases"]}
    subphases_index = {
        row["subphase_name"]: row["subphase_id"] for row in data["moped_subphases"]
    }
    fund_sources_index = {
        row["funding_source_name"]: row for row in data["moped_fund_sources"]
    }
    fund_programs_index = {
        row["funding_program_name"]: row for row in data["moped_fund_programs"]
    }
    dept_unit_index = {row["id"]: row for row in data["dept_unit"]}
    entities_index = {row["entity_name"]: row for row in data["moped_entity"]}

    types_index = get_types_index(data["moped_types"])

    users_index = {row["email"]: row for row in data["moped_users"]}
    proj_roles_index = {
        row["project_role_name"]: row for row in data["moped_project_roles"]
    }

    append_signals_to_projects(projects, signal_index)
    append_task_orders_to_projects(projects, task_orders_index)
    append_phases_to_projects(projects, phases_index, subphases_index)
    set_project_user_id(projects, users_index)
    set_project_notes(projects)
    set_project_types(projects, types_index)
    skipped_sponors = set_sponsor_and_partners(projects, entities_index)
    skipped_designer = set_project_team(projects, users_index, proj_roles_index)
    set_updated_at(projects)
    projects_to_review = append_funding_sources_to_projects(
        projects, dept_unit_index, fund_sources_index, fund_programs_index, FUNDING_MAP
    )
    set_project_status_id(projects)
    skipped_targeted_construction_start = [
        p["knack_project_id"] for p in projects if p.get("target_construction_start")
    ]
    for knack_id in skipped_targeted_construction_start:
        projects_to_review.setdefault(knack_id, {})
        projects_to_review[knack_id]["target_construct_start"] = True

    for knack_id, value in skipped_sponors.items():
        projects_to_review.setdefault(knack_id, {})
        projects_to_review[knack_id]["skipped_sponsors"] = value
    
    for knack_id, value in skipped_designer.items():
        projects_to_review.setdefault(knack_id, {})
        projects_to_review[knack_id]["skipped_designer"] = value

    # mega hack to nullify empty strings - look away
    for project in projects:
        for k, v in project.items():
            if v == "":
                project[k] = None

        project_ready = {}
        project_ready = construct_project(**project)
        projects_ready.append(project_ready)

    save_json(projects_ready, f"{DATA_READY_DIR}/projects.json")
    logger.info(
        f"Saved {len(projects_ready)} projects to {DATA_READY_DIR}/projects.json"
    )
    save_json(projects_to_review, "PROJECTS_TO_REVEIW.json")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-e",
        "--env",
        type=str,
        required=True,
        choices=["local", "staging", "prod"],
        help=f"The environment",
    )
    args = parser.parse_args()
    env = args.env
    logger = get_logger(name=os.path.basename(__file__), log_dir=LOG_DIR)
    if not os.path.exists(DATA_READY_DIR):
        os.makedirs(DATA_READY_DIR)
    main(env)
