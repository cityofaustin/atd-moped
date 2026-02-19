def format_sp_number(sp_number) -> str | None:
    """
    Socrata stores SP_NUMBER as a Number type which drops trailing zeros.
    eCAPRIS subproject IDs always use 3 decimal places (e.g. 13240.010), and
    we treat them as string in the Moped DB.
    """
    if sp_number is None:
        return None

    # .3 for 3-digit precision after decimal place and f to avoid scientific notation
    return f"{float(sp_number):.3f}"
