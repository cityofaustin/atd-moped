import argparse
from datetime import datetime, timezone, timedelta


def get_cli_args():
    """Create the CLI and parse args

    Returns:
        argparse.Namespace: The CLI namespace
    """
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-n",
        "--dry-run",
        action="store_true",
        help="Log what changes would be made without executing them",
    )

    return parser.parse_args()
