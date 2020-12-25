import logging
import os
from logging.handlers import RotatingFileHandler

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

from config import secrets


def setup_logging():
    # Init Python logging
    log_formatter = logging.Formatter("%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s")

    if not os.path.exists('logger/logs'):
        os.makedirs('logger/logs')
    my_handler = RotatingFileHandler("logger/logs/log.txt", mode='a', maxBytes=100 * 1024 * 1024, backupCount=1,
                                     encoding=None, delay=0)
    my_handler.setFormatter(log_formatter)
    my_handler.setLevel(logging.DEBUG)

    logger = logging.getLogger('root')
    logger.setLevel(logging.DEBUG)

    logger.addHandler(my_handler)

    # Init Sentry
    # sentry_sdk.init(
    #     dsn=secrets.SENTRY_DSN,
    #     integrations=[FlaskIntegration()]
    # )

    return logger
