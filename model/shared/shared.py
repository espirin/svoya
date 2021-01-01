import random

import shortuuid

from model import Game, Pack


def create_new_game_id() -> str:
    game_id = shortuuid.ShortUUID().random(length=6)

    while Game.query.filter(Game.id == game_id).scalar() is not None:
        game_id = shortuuid.ShortUUID().random(length=6)

    return game_id


def create_new_pack_id() -> int:
    pack_id = random.randint(1, 10000000)

    while Pack.query.filter(Pack.id == pack_id).scalar() is not None:
        pack_id = random.randint(1, 10000000)

    return pack_id
