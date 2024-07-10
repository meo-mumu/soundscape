import librosa
from mutagen.easyid3 import EasyID3
from music21 import *
import numpy as np
# from pydub import AudioSegment
from tinytag import TinyTag

from tag import Tag

import config

class Sound:
    def __init__(
        self,
        id: int,
        name: str,
        filepath: str,
        title: str = None,
        artist: str = None, 
        bpm: int = None, 
        key: str = None, 
        tags: list[str] = [], 
        x_mds: float = None, 
        y_mds: float = None, 
        duration: int = None):
        self.id = id
        self.name = name
        self.filepath = filepath
        self.title = title
        self.artist = artist
        self.bpm = bpm
        self.key = key
        self.tags: dict[str, Tag] = self._init_tags(tags)
        self.x_mds = x_mds
        self.y_mds = y_mds
        self.duration = duration

        if not self.bpm:
            print(f">>> analyse {name}")
            self._analyse_audio()

    def to_dict(self):
        sound_dict = {k: v for k, v in self.__dict__.items() if v is not None}
        sound_dict['tags'] = list(self.tags.keys())
        return sound_dict
    
    def add_tag(self, new_tag: Tag):
        print(f">>> add tag {new_tag.name} to sound {self.name}")
        self.tags[new_tag.name] = new_tag

    def remove_tag(self, new_tag: Tag):
        print(f">>> remove tag {new_tag.name} to sound {self.name}")
        if new_tag.name in self.tags:
            del self.tags[new_tag.name]

    def _init_tags(self, tags: list[str]):
        return {tag: Tag(name = tag) for tag in tags}
    
    def _analyse_audio(self): 
        self._get_metadata_from_file()
        self._get_bpm_and_key_from_librosa()
        self._get_duration_from_librosa()
        self._find_tags()
        
    def _find_tags(self):
        tag_names = self.filepath.split(f'{config.SOUND_FILES_PATH}/')[1].split('/')[:-1]
        self.tags = {tag_name: Tag(name=tag_name) for tag_name in tag_names}

    def _get_bpm_and_key_from_librosa(self):
        y, sr = librosa.load(self.filepath)

        # Calculer le tempo
        self.bpm, _ = librosa.beat.beat_track(y=y, sr=sr)
        self.bpm = round(self.bpm[0])

        # Compute the Chroma Short-Time Fourier Transform (chroma_stft)
        chromagram = librosa.feature.chroma_stft(y=y, sr=sr)
        mean_chroma = np.mean(chromagram, axis=1)
        chroma_to_key = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
        estimated_key_index = np.argmax(mean_chroma)
        self.key = chroma_to_key[estimated_key_index]

        # Calculate the indices of the minor and major thirds
        min_third_index = (estimated_key_index + 3) % 12
        maj_third_index = (estimated_key_index + 4) % 12

        # Determine if the key is major or minor based on the amplitude of the thirds
        if mean_chroma[min_third_index] > mean_chroma[maj_third_index]:
            self.key = self.key + 'm'

    def _get_duration_from_librosa(self):
        self.duration = librosa.get_duration(filename=self.filepath)


    def _get_metadata_from_file(self):
        try:
            audio = EasyID3(self.filepath)
            self.title = audio.get('title')[0] if audio.get('title') else self.name
            self.artist = audio.get('artist')[0] if audio.get('artist') else None
        except:
            try:
                tag = TinyTag.get(self.filepath)
                self.title = tag.title if tag.title else self.name
                self.artist = tag.artist if tag.artist else None
            except:
                self.title = self.name
                self.artist = None

    
    def __repr__(self):
        return f"Sound({self.id}, {self.title}, {self.bpm}, {self.key}, {self.x_mds}, {self.y_mds})"


    # # Calcul du taux de passage par zéro :
    # zero_crossing_rate = librosa.feature.zero_crossing_rate(audio_data)

    # # Calcul du centroïde spectral :
    # spectral_centroid = librosa.feature.spectral_centroid(audio_data, sample_rate)

    # # Calcul du rolloff spectral :
    # spectral_rolloff = librosa.feature.spectral_rolloff(audio_data, sample_rate)

    # # Calcul des coefficients de Mfcc :
    # mfcc = librosa.feature.mfcc(audio_data, sample_rate)

    
    # # Calcul de la valeur root mean square (RMS) :
    # rms = librosa.feature.rms(audio_data)