#!/usr/bin/env python3

import json
import requests


def make_update() -> dict:
    """
    Runs a SQL query against Hasura and tries to assign a
    location to any Non-CR3s that do not have location yet.
    :return dict:
    """
    response = requests.post(
        url="http://localhost:8080/v1/query",
        headers={
            "Accept": "*/*",
            "content-type": "application/json"
        },
        json={
            "type": "run_sql",
            "args": {
                "sql": """
                    /*
                        Selects all primary keys
                    */
                    select tc.table_name, kc.column_name
                    from information_schema.table_constraints tc
                      join information_schema.key_column_usage kc
                        on kc.table_name = tc.table_name and kc.table_schema = tc.table_schema and kc.constraint_name = tc.constraint_name
                    where 1=1
                      and tc.table_schema = 'public'
                      and tc.table_name LIKE 'moped_%'
                      and tc.constraint_type = 'PRIMARY KEY'
                      and kc.ordinal_position is not null
                    order by tc.table_schema,
                             tc.table_name,
                             kc.position_in_unique_constraint;
                """
            }
        }
    )
    response.encoding = "utf-8"
    return response.json()


def main():
    try:
        response = make_update()
    except Exception as e:
        response = {
            "errors": str(e)
        }

    output = {}

    for k, v in response["result"]:
        if k != "table_name":
            output[k] = v

    # Serializing json
    print(json.dumps(output))

if __name__ == "__main__":
    main()
