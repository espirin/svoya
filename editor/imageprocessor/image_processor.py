import os

from config import config
from PIL import Image


def process_and_save_image(path_to_image: str, path_to_optimized_image: str):
    image = Image.open(path_to_image)
    image.thumbnail(config.IMAGE_SIZE)

    image.save(path_to_optimized_image, optimize=True, quality=config.IMAGE_QUALITY)
    os.remove(path_to_image)
