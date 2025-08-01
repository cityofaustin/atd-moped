import datetime
import hashlib
import re
import uuid


def strip_non_numeric(text: str) -> str:
    """
    Removes any non-numeric characters
    :param str text: The input text
    :return str:
    """
    if not isinstance(text, str):
        return ""

    pattern = re.compile("[^0-9]")
    return re.sub(pattern, "", text)


def strip_non_alpha(text: str) -> str:
    """
    Removes non-alphabetic characters from a string
    :param str text: The string in question
    :return str:
    """
    if not isinstance(text, str):
        return ""

    pattern = re.compile("[^a-zA-Z]")
    return re.sub(pattern, "", text).lower()


def strip_non_common(text: str) -> str:
    """
    Removes characters that are not alphabetic, numbers, underscore and hyphens
    :param str text: The string in question
    :return str:
    """
    if not isinstance(text, str):
        return ""

    pattern = re.compile("[^0-9a-zA-Z_-]")
    return re.sub(pattern, "", text).lower()


def get_file_name(filename: str) -> str:
    """
    Returns the file name only without extension
    :param str filename: The raw file name
    :return str:
    """
    if not isinstance(filename, str):
        return None

    if filename is None or filename == "":
        return None

    if "." not in filename:
        return None

    filename_no_ext = filename.rsplit(".", 1)[0].lower()[:64]
    return strip_non_common(filename_no_ext)


def is_valid_filename(filename: str) -> bool:
    """
    Returns True if the filename is valid.
    :param str filename: The raw file name
    :return:
    """

    if not isinstance(filename, str):
        return False

    if filename is None or filename == "":
        return False

    if "." not in filename:
        return False

    file_name_clean = get_file_name(filename)

    if get_file_extension(filename) is None:
        return False

    if len(filename) >= 130:
        return False

    if file_name_clean is None or file_name_clean == "":
        return False

    return True


def get_file_extension(filename) -> str:
    """
    Returns the extension out of the file name
    :param str filename: The file name
    :return str:
    """
    if not isinstance(filename, str):
        return None

    if filename is None or filename == "":
        return None

    if "." not in filename:
        return None

    file_extension = strip_non_alpha(filename.rsplit(".", 1)[1].lower().strip())

    if file_extension is None or file_extension == "":
        return None

    return file_extension


def generate_clean_filename(filename: str) -> str:
    """
    Generates a safer, random and legible file name
    :param str filename: Raw file name
    :return str:
    """
    if not isinstance(filename, str) or len(filename) == 0:
        raise Exception(f"Invalid file name: '{filename}'")

    timestamp = filename_timestamp()
    file_extension = get_file_extension(filename).strip()
    file_name = get_file_name(filename).strip()

    if (
        timestamp is None
        or file_extension is None
        or file_extension == ""
        or file_name is None
        or file_name == ""
    ):
        raise Exception(f"Invalid file name: '{filename}'")

    clean_filename = "{0}.{1}".format(file_name, file_extension)
    unique_short_hash = generate_random_hash()[0:16]
    return f"{timestamp}_{unique_short_hash}_{clean_filename}"


def is_valid_unique_id(unique_id) -> bool:
    """
    Returns a valid unique id number
    :param str unique_id: Unique ID string
    :return bool:
    """
    if not isinstance(unique_id, str):
        return False

    pattern = re.compile("^([a-z0-9]){64}$")
    return pattern.match(unique_id) is not None


def is_valid_number(number: str) -> bool:
    """
    Returns True if the integer string is a valid number
    :param str number: The integer number as a string
    :return str:
    """
    # If not an instance of a string, false
    if not isinstance(number, str):
        return False

    # Clean it up
    clean_number = strip_non_numeric(number)

    # If zero length, False
    if len(clean_number) == 0:
        return False

    try:
        int(clean_number)
        return True
    except (ValueError, TypeError):
        return False


#####
# Time
#####
def get_current_datetime() -> str:
    """
    Returns the current date time as a string
    :return str:
    """
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def filename_timestamp():
    return datetime.datetime.now().strftime("%m%d%Y%H%M%S")


#####
# Random Number Generator
#####
def generate_random_hash() -> str:
    """
    Generates a random hash
    :return str:
    """
    rand_uuid_str = "{0}".format(uuid.uuid1()).encode()
    return str(hashlib.sha256(rand_uuid_str).hexdigest())


#
# Retrieve user details
#
def get_user_id(claims: dict) -> str:
    """
    Retrieves the user id from the claims
    :param dict claims: The claims dictionary
    :return str: The users' database id as a string integer
    """
    return claims.get("https://hasura.io/jwt/claims", {}).get(
        "x-hasura-user-db-id", None
    )
