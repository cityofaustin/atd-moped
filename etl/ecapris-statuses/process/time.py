from datetime import datetime, timezone
from zoneinfo import ZoneInfo


def convert_to_timezone_aware_timestamp(date_str):
    """
    Converts a timestamp string in the format 'YYYY-MM-DD HH:MM:SS' to a timezone-aware
    timestamp in the 'America/Chicago' timezone.

    Args:
        date_str (str): The timestamp string to convert, in the format 'YYYY-MM-DD HH:MM:SS'.

    Returns:
        str: The ISO timestamp string in the 'America/Chicago' timezone.
    """
    # Update the date format to match your input without milliseconds
    date_format = "%Y-%m-%d %H:%M:%S"

    # Parse the timestamp string
    parsed_date = datetime.strptime(date_str, date_format)

    # Convert to timezone-aware by attaching the America/Chicago timezone
    parsed_date_tz = parsed_date.replace(tzinfo=ZoneInfo("America/Chicago"))

    # Convert to ISO format
    timestamptz = parsed_date_tz.isoformat()

    return timestamptz
