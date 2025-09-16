#!/usr/bin/env python3


import os
import sys
import logging

import re
from typing import Dict

import oracledb as cx_Oracle


logger = logging.getLogger("oracle-test-fixture")

DEFAULT_REPLACEMENTS: Dict[bytes, bytes] = {
    bytes.fromhex("E2BFBF"): bytes.fromhex("E2809C"),  # “
    bytes.fromhex("E2BF9D"): bytes.fromhex("E2809D"),  # ”
    # Examples you can enable if you see them:
    # bytes.fromhex("E2BF98"): bytes.fromhex("E28098"),  # ‘
    # bytes.fromhex("E2BF99"): bytes.fromhex("E28099"),  # ’
    # bytes.fromhex("E2BF93"): bytes.fromhex("E28093"),  # –
    # bytes.fromhex("E2BF94"): bytes.fromhex("E28094"),  # —
    # bytes.fromhex("E2BFA6"): bytes.fromhex("E280A6"),  # …
}


def repair_mojibake(text: str, replacements=DEFAULT_REPLACEMENTS) -> str:
    """
    Input: mojibake string fetched via JDBC/thin driver (decoded as CP-1252).
    Strategy: re-encode to CP-1252 bytes, patch bad triplets, decode as UTF-8.
    """
    data = text.encode("windows-1252", errors="ignore")
    for bad, good in replacements.items():
        data = data.replace(bad, good)
    return data.decode("utf-8", errors="strict")


def get_env(name: str) -> str:
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def connect_oracle():
    # Ensure client uses UTF-8 so the Oracle client converts from DB charset
    os.environ.setdefault("NLS_LANG", "AMERICAN_AMERICA.AL32UTF8")

    # Initialize thick client if available; otherwise fall back to thin mode
    try:
        cx_Oracle.init_oracle_client()
        logger.debug("Initialized Oracle thick client.")
    except Exception as init_err:
        logger.debug(
            "Oracle thick client not initialized, using thin mode: %s", init_err
        )

    host = get_env("ORACLE_HOST")
    port_raw = get_env("ORACLE_PORT")
    service = get_env("ORACLE_SERVICE")
    user = get_env("ORACLE_USER")
    password = get_env("ORACLE_PASSWORD")

    try:
        port = int(port_raw)
    except (TypeError, ValueError) as e:
        raise ValueError(
            f"Invalid ORACLE_PORT value: {port_raw!r}. Must be an integer."
        ) from e

    return cx_Oracle.connect(
        user=user,
        password=password,
        host=host,
        port=port,
        service_name=service,
    )


def main() -> int:
    logging.basicConfig(
        level=logging.DEBUG, format="%(asctime)s %(levelname)s %(message)s"
    )

    query = """
SELECT SUB_PROJECT_STATUS_DESC
FROM   ATD_SUB_PROJECT_STATUS_VW
""".strip()

    potential_mojibake_strings = ["SUB_PROJECT_STATUS_DESC"]

    try:
        conn = connect_oracle()
    except Exception as e:
        logger.error("Failed to connect to Oracle: %s", e)
        return 1

    try:
        with conn.cursor() as cursor:
            cursor.execute(query)
            # Column names from cursor metadata
            columns = [desc[0] for desc in cursor.description]
            rows = cursor.fetchall()
            logger.info("Fetched %d row(s)", len(rows))

            # Print each column as COLNAME: VALUE per row
            for row in rows:
                for idx, col_name in enumerate(columns):
                    value = row[idx] if idx < len(row) else None

                    # Apply mojibake repair to columns in the potential_mojibake_strings list
                    if col_name in potential_mojibake_strings and value is not None:
                        try:
                            value = repair_mojibake(str(value))
                        except Exception as repair_err:
                            logger.warning(
                                "Failed to repair mojibake for column %s: %s",
                                col_name,
                                repair_err,
                            )
                            # Keep original value if repair fails

                    print(f"{col_name}: {value}")
                # Blank line between rows
                print("")
    except Exception as e:
        logger.error("Query execution failed: %s", e)
        return 1
    finally:
        try:
            conn.close()
        except Exception:
            pass

    return 0


if __name__ == "__main__":
    sys.exit(main())
