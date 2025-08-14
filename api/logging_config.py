"""
Centralized logging configuration for the MOPED API
"""

import logging
import os
from typing import Optional


def setup_logging(level: Optional[str] = "INFO") -> logging.Logger:
    """
    Set up centralized logging configuration for the API

    :param level: Optional log level override (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    :return: Configured logger instance
    """
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, level, logging.INFO),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    # Create and return API-specific logger
    logger = logging.getLogger("moped_api")

    return logger


def get_logger(name: str) -> logging.Logger:
    """
    Get a logger instance for a specific module

    :param name: Module name (typically __name__)
    :return: Logger instance
    """
    return logging.getLogger(f"moped_api.{name}")
