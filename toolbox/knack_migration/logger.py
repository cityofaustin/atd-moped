import logging
import sys


def get_logger(*, name, log_dir, level=logging.INFO):
    """Return a module logger that streams to stdout"""
    logger = logging.getLogger(name)
    stream_handler = logging.StreamHandler(stream=sys.stdout)
    file_handler = logging.FileHandler(f"{log_dir}/{name.replace('.py', '.log')}")
    formatter = logging.Formatter(fmt=" %(name)s.%(levelname)s: %(message)s")
    stream_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)
    logger.addHandler(file_handler)
    logger.setLevel(level)
    return logger
