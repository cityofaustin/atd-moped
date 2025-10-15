import argparse
from datetime import datetime, timezone, timedelta


def get_cli_args():
    """Create the CLI and parse args

    Returns:
        argparse.Namespace: The CLI namespace
    """
    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-d",
        "--date",
        type=str,
        nargs="?",
        const=(datetime.now(timezone.utc) - timedelta(days=7)).isoformat(),
        default=None,
        help="ISO date string with TZ offset (ex. 2024-06-28T00:06:16.360805+00:00) of latest updated_at value to find project records to update. Defaults to 7 days ago if -d is used without a value.",
    )

    parser.add_argument(
        "-f",
        "--full",
        action="store_true",
        help="Delete and replace all project components.",
    )

    parser.add_argument(
        "-t",
        "--test",
        action="store_true",
        help="Run script without making changes to the AGOL dataset",
    )

    parser.add_argument(
        "-n",
        "--dry-run",
        action="store_true",
        help="Log what changes would be made without executing them",
    )

    return parser.parse_args()
