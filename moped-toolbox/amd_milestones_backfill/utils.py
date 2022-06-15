import requests
from secrets import HASURA


def make_hasura_request(*, query, variables, key, env):
    endpoint = HASURA["HASURA_GRAPHQL_ENDPOINT"][env]
    admin_secret = HASURA["HASURA_GRAPHQL_ADMIN_SECRET"][env]
    headers = {"X-Hasura-Admin-Secret": admin_secret}
    payload = {"query": query, "variables": variables}
    res = requests.post(endpoint, json=payload, headers=headers)
    res.raise_for_status()
    data = res.json()
    try:
        return data["data"][key] if key else data["data"]
    except KeyError:
        raise ValueError(data)


# copied from atd-moped/moped-editor/src/utils/timelineTemplates.js
MILESTONES = [
    {
        "milestone_id": 34,
        "milestone_order": 1,
    },
    {
        "milestone_id": 35,
        "milestone_order": 2,
    },
    {
        "milestone_id": 36,
        "milestone_order": 3,
    },
    {
        "milestone_id": 37,
        "milestone_order": 4,
    },
    {
        "milestone_id": 31,
        "milestone_order": 5,
    },
    {
        "milestone_id": 38,
        "milestone_order": 6,
    },
    {
        "milestone_id": 39,
        "milestone_order": 7,
    },
    {
        "milestone_id": 40,
        "milestone_order": 8,
    },
    {
        "milestone_id": 41,
        "milestone_order": 9,
    },
    {
        "milestone_id": 42,
        "milestone_order": 10,
    },
    {
        "milestone_id": 43,
        "milestone_order": 11,
    },
    {
        "milestone_id": 44,
        "milestone_order": 12,
    },
    {
        "milestone_id": 45,
        "milestone_description": "traffic and pedestrian",
        "milestone_order": 13,
    },
    {
        "milestone_id": 46,
        "milestone_order": 14,
    },
    {
        "milestone_id": 47,
        "milestone_order": 15,
    },
    {
        "milestone_id": 48,
        "milestone_order": 16,
    },
    {
        "milestone_id": 49,
        "milestone_order": 17,
    },
    {
        "milestone_id": 50,
        "milestone_order": 18,
    },
    {
        "milestone_id": 51,
        "milestone_order": 19,
    },
    {
        "milestone_id": 52,
        "milestone_description": "typically 30 days",
        "milestone_order": 20,
    },
    {
        "milestone_id": 53,
        "milestone_description": "for signals constructed by others/documentation that burn in period is complete",
        "milestone_order": 21,
    },
]


def get_milestones(*, project_id, status_id=1, completed=False):
    proj_milestones = []
    for m in MILESTONES:
        # create copy of each milestone
        proj_milestone = dict(m)
        # set these values
        proj_milestone["project_id"] = project_id
        proj_milestone["status_id"] = status_id
        proj_milestone["completed"] = False
        proj_milestones.append(proj_milestone)
    return proj_milestones
