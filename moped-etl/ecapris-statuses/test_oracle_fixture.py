#!/usr/bin/env python3


import os
import sys
import logging

import re
from typing import Dict

import oracledb as cx_Oracle


logger = logging.getLogger("oracle-test-fixture")


# Map "bad" UTF-8 byte sequences -> "correct" UTF-8 byte sequences
MOJIBAKE_REPAIRS = {
    # Original patterns (direct UTF-8 mojibake)
    bytes.fromhex("E2BFBF"): bytes.fromhex("E2809C"),  # left double quote
    bytes.fromhex("E2BF9D"): bytes.fromhex("E2809D"),  # right double quote
    # Double-encoded patterns (Latin-1 interpreted UTF-8 re-encoded as UTF-8)
    # These are what we actually see from Oracle: â¿¿ and â¿
    bytes.fromhex("C3A2C2BFC2BF"): bytes.fromhex(
        "E2809C"
    ),  # â¿¿ -> left double quote "
    bytes.fromhex("C3A2C2BFC29D"): bytes.fromhex(
        "E2809D"
    ),  # â¿ -> right double quote "
}


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


# Precompile a single regex that matches any "bad" sequence
_BAD_BYTES_RE = re.compile(b"|".join(map(re.escape, MOJIBAKE_REPAIRS.keys())))


def repair_mojibake(text: str) -> str:
    """
    Encode to UTF-8 bytes, swap any known bad sequences to the intended ones,
    then decode back to text. Logs successful substitutions with context.

    Returns:
        str: The repaired text
    """
    result, _ = repair_mojibake_with_info(text)
    return result


def repair_mojibake_with_info(text: str) -> tuple[str, int]:
    """
    Encode to UTF-8 bytes, swap any known bad sequences to the intended ones,
    then decode back to text. Logs successful substitutions with context.

    Returns:
        tuple[str, int]: The repaired text and the number of substitutions made
    """
    data = text.encode("utf-8", "surrogatepass")
    match_count = 0

    def replacement_logger(match):
        nonlocal match_count
        match_count += 1

        # Get the matched bad sequence and its replacement
        bad_bytes = match.group(0)
        good_bytes = MOJIBAKE_REPAIRS[bad_bytes]

        # Find the position of the match in the original data
        match_start = match.start()
        match_end = match.end()

        # Get context around the match (20 chars before and after)
        context_start = max(0, match_start - 20)
        context_end = min(len(data), match_end + 20)
        context_bytes = data[context_start:context_end]

        try:
            # Try to decode context for display (may fail if we're in the middle of bad encoding)
            context_str = context_bytes.decode("utf-8", "replace")
            # Highlight the match position within the context
            relative_start = match_start - context_start
            relative_end = match_end - context_start
            highlighted_context = (
                context_str[:relative_start]
                + f"[{context_str[relative_start:relative_end]}]"
                + context_str[relative_end:]
            )
        except:
            # Fallback to hex representation if decoding fails
            highlighted_context = f"bytes: {context_bytes.hex()}"

        logger.debug(
            "Mojibake repair #%d: Replaced %s -> %s at position %d-%d. Context: ",
            match_count,
            bad_bytes.hex(),
            good_bytes.hex(),
            match_start,
            match_end,
            # highlighted_context,
        )

        return good_bytes

    fixed = _BAD_BYTES_RE.sub(replacement_logger, data)

    if match_count > 0:
        logger.info(
            "Successfully repaired %d mojibake sequence(s) in text", match_count
        )
    else:
        logger.debug("No mojibake patterns found in text")

    return fixed.decode("utf-8", "strict"), match_count


def main() -> int:
    logging.basicConfig(
        level=logging.DEBUG, format="%(asctime)s %(levelname)s %(message)s"
    )

    query = """
SELECT sp_number, sub_project_status_id, sub_project_status_desc
FROM   ATD_SUB_PROJECT_STATUS_VW
WHERE SUB_PROJECT_STATUS_DESC LIKE '%specialty%'
""".strip()

    query = """
SELECT sp_number, sub_project_status_id, sub_project_status_desc
FROM   ATD_SUB_PROJECT_STATUS_VW
WHERE SUB_PROJECT_STATUS_DESC LIKE '%Holly Implementation Phase 1%'
""".strip()

    potential_mojibake_strings = [
        "SUB_PROJECT_STATUS_DESC",
    ]

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
                            value = repair_mojibake(value)
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
