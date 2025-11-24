from __future__ import annotations

from logging import config, getLogger
from typing import TYPE_CHECKING

from app.app_conf import LOG_DIR

if TYPE_CHECKING:
    from logging import Logger

# Log Config

LOG_DIR.mkdir(parents=True, exist_ok=True)

LOG_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s:%(lineno)s - %(funcName)s [%(levelname)s]:- %(message)s",
            "datefmt": "%Y-%m-%d %H:%M:%S",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default",
            "level": "INFO",
            "stream": "ext://sys.stdout",
        },
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "formatter": "default",
            "level": "DEBUG",
            "filename": str(LOG_DIR / "app.log"),
            "encoding": "utf-8",
            "maxBytes": 10485760,  # 10MB
            "backupCount": 5,
        },
    },
    "loggers": {
        "__main__": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    },
}

config.dictConfig(LOG_CONFIG)


def get_logger(name: str) -> Logger:
    return getLogger(name)


def get_root_logger() -> Logger:
    return getLogger()


if __name__ == "__main__":
    logger = get_logger(__name__)
    logger.info("This is an info message.")
    logger.error("This is an error message.")
    root_logger = get_root_logger()
    root_logger.warning("This is a warning message from the root logger.")
