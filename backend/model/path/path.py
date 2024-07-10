import json
import os
import config

class Path:
    def __init__(self, id: int, name: str, sounds_ids: list[int], hex_color: str):
        self.id = id
        self.name = name
        self.hex_color = hex_color
        self.sounds_ids = sounds_ids
        self.path_db_pathfile = f'{config.PATH_DB_FOLDER}/{self.id}_{self.name}.json'

    def save_to_json_file(self):
        # delete the file if it already exists
        if os.path.exists(self.path_db_pathfile):
            os.remove(self.path_db_pathfile)

        self.path_db_pathfile = f'{config.PATH_DB_FOLDER}/{self.id}_{self.name}.json'

        # create the directory if it does not exist
        os.makedirs(os.path.dirname(self.path_db_pathfile), exist_ok=True)

        with open(self.path_db_pathfile, 'w') as f:
            with open(self.path_db_pathfile, 'w') as f:
                data = {
                    'id': self.id,
                    'name': self.name,
                    'hex_color': self.hex_color,
                    'sounds_ids': self.sounds_ids
                }
                json.dump(data, f)
                
    def to_dict(self):
        # retrieve from json
        with open(self.path_db_pathfile, 'r') as f:
            data = json.load(f)
        return data