import json
import os
from path import Path
import config

class PathsHandler:
    def __init__(self):
        self.paths: dict[int, Path] = {}
    
    def init_all_path_from_db(self):
        for dirpath, dirnames, filenames in os.walk(config.PATH_DB_FOLDER):
            for filename in filenames:
                if filename.endswith('.json'):
                    # read json file
                    with open(os.path.join(dirpath, filename), 'r') as f:
                        data = json.load(f)
                        sounds_path = Path(**data)
                        self.paths[sounds_path.id] = sounds_path
        
    def save_path_from_front(self, id: int, data: dict):
        print(f"> save sounds_path {id} with {data}")
        path = self.paths.get(id)
        if path:
            path.name = data.get('name')
            path.sounds_ids = data.get('sounds_ids')
            path.hex_color = data.get('hex_color')
        else :
            path = Path(
                id = id,
                name = data.get('name'),
                sounds_ids = data.get('sounds_ids'),
                hex_color = data.get('hex_color')
            )
            self.paths[id] = path
        path.save_to_json_file()
        

    
    