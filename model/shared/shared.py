import shortuuid

from model import Game


def create_new_game_id() -> str:
    game_id = shortuuid.ShortUUID().random(length=6)

    while Game.query.filter(Game.id == game_id).scalar() is not None:
        game_id = shortuuid.ShortUUID().random(length=6)

    return game_id
