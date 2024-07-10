import csv
from dataclasses import asdict
import json
import os
import numpy as np
import pandas as pd
from model.tag.mds import calc_x_y_mds
from sound import Sound
from ast import literal_eval
import re
from tag import Tag
import config

class SoundsHandler:
    
    def __init__(self):
        self.sounds: dict[int, Sound] = {}

    def build_sounds(self):
        if os.path.exists(config.SOUNDS_DB_PATHFILE):
            self.load_sounds_from_db()
        else:
            self.init_sounds_from_path_root_sounds()

    def _init_sounds(self):
        if not self.sounds:
            nb_sounds_init_from_db = self._builds_sounds_from_db()
            if nb_sounds_init_from_db == 0:
                self._find_new_sound_from_path_root_sounds()
                nb_new_sounds = len(self.sounds) - nb_sounds_init_from_db
                if nb_new_sounds > 0:
                    calc_x_y_mds(self.sounds)
                    self.check_if_2_sounds_have_same_x_y_mds()
                    print(f'>> update db with {nb_new_sounds} new sounds')
                    self.update_sounds_db()

    def check_if_2_sounds_have_same_x_y_mds(self):
        x_mds = [sound.x_mds for sound in self.sounds.values()]
        y_mds = [sound.y_mds for sound in self.sounds.values()]
        if len(set(x_mds)) < len(x_mds) or len(set(y_mds)) < len(y_mds):
            print('>> 2 sounds have the same x or y mds')
        else:
            print('>> x and y mds are unique for each sound')

    def _find_new_sound_from_path_root_sounds(self) -> dict[int, Sound]:
        dict_filepath_filename : {int, [str, str]} = {}
        idx = 0
        for dirpath, dirnames, filenames in os.walk(config.SOUNDS_FILE_ROOT_FOLDER):
            for filename in filenames:
                if any(filename.endswith(ext) for ext in self._extensions):
                    filepath = os.path.join(dirpath, filename)
                    idx += 1
                    dict_filepath_filename[idx] = [filename, filepath]
        print(f'>> we found {len(dict_filepath_filename)} sounds in {config.SOUNDS_FILE_ROOT_FOLDER} and we just want to add {config.LIMIT_NB_SOUND} sounds to the db')
        
        random_idx = np.random.choice(list(dict_filepath_filename.keys()), config.LIMIT_NB_SOUND, replace=False)
        j = 1
        for idx in random_idx:
            print(f'> {j}/{config.LIMIT_NB_SOUND} add sound {idx} to db')
            filename, filepath = dict_filepath_filename[idx]
            self._add_new_sound_from_the_file_himself(filename, filepath)
            j += 1

    def _add_new_sound_from_the_file_himself(self, filename: str, filepath: str):
        if filepath in [sound.filepath for sound in self.sounds.values()]:
            print(f'>> {filepath} already exists in the database')
        else:  
            sound_id = self._calc_next_id() 
            sound = Sound(
                id = sound_id,
                name = filename,
                filepath = filepath
            )
            self.sounds[sound_id] = sound
            print(f"new sound added : {sound}")

    def load_to_json(self):
        if os.path.exists(config.SOUNDS_DB_PATHFILE):
            os.remove(config.SOUNDS_DB_PATHFILE)
        with open(config.SOUNDS_DB_PATHFILE, 'w') as f:
            data = [asdict(sound) for sound in self.sounds.values()]
            json.dump(data, f)

    def search_sounds(self, value: str) -> list[int]:
        value = value.lower()
        pattern = re.compile(value)
        matching_ids = [id for id, sound in self.sounds.items()
                        if pattern.search(sound.name.lower())
                        or pattern.search(sound.title.lower() or '') 
                        or pattern.search(sound.artist.lower() or '')]
        return matching_ids

    def _calc_next_id(self):
        if len(self.sounds) == 0:
            return 1
        else:
            return max(self.sounds.keys()) + 1
        
    def __getitem__(self) -> dict[int, Sound]:
        return self.sounds