import sys
import logging


def get_logger(name, level=logging.DEBUG):
    """Return a module logger that streams to stdout"""
    logger = logging.getLogger(name)
    handler = logging.StreamHandler(stream=sys.stdout)
    formatter = logging.Formatter(fmt=" %(name)s.%(levelname)s: %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(level)
    return logger
