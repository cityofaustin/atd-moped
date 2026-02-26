def format_sp_number(sp_number) -> str | None:
    """
    Socrata stores SP_NUMBER as a Number type which drops trailing zeros.
    eCAPRIS subproject IDs always use 3 decimal places (e.g. 13240.010), and
    we treat them as string in the Moped DB. Works with either string or number from Socrata.
    """
    if sp_number is None:
        return None

    # .3 for 3-digit precision after decimal place and f to avoid scientific notation
    # See https://docs.python.org/3/library/string.html#format-specification-mini-language
    return f"{float(sp_number):.3f}"
