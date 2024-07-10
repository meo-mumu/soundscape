import os
import librosa
from mutagen.easyid3 import EasyID3
from music21 import *
import numpy as np
# from pydub import AudioSegment
from tinytag import TinyTag
from utils import find_hash
import os

def analyse_audio(root_folder: str, filepath: str):
    log_file = '/home/mumu/soundscape/backend/error_log.txt'
    try:
        name, title, artist = get_metadata_from_file(filepath)
        bpm, key = get_bpm_and_key_from_librosa(filepath)
        data = {
            'name': name,
            'title': title,
            'artist': artist,
            'tags': find_tags(root_folder, filepath),
            'bpm': bpm,
            'key': key,
            'duration': get_duration_from_librosa(filepath),
            'filepath': filepath,
            'hash': find_hash(filepath),
            'size': os.path.getsize(filepath),
        }
        return data
    except Exception as e:
        # En cas d'erreur, écrire le chemin du fichier et l'erreur dans le fichier de log
        with open(log_file, "a") as log:
            log.write(f"Failed to process {filepath}: {e}\n")
        return None

def get_metadata_from_file(filepath: str):
    name = filepath.split('/')[-1].split('.')[0]
    try:
        audio = EasyID3(filepath)
        title = audio.get('title')[0] if audio.get('title') else name
        artist = audio.get('artist')[0] if audio.get('artist') else None
    except:
        try:
            tag = TinyTag.get(filepath)
            title = tag.title if tag.title else name
            artist = tag.artist if tag.artist else None
        except:
            title = name
            artist = None
    return name, title, artist
        
def find_tags(root_folder: str, filepath: str):
    filepath_relative = filepath.replace(f"{root_folder}{os.path.sep}", '')
    list_tags = filepath_relative.split(os.path.sep)
    list_tags.pop()
    return list_tags 

def get_bpm_and_key_from_librosa(filepath: str):
    y, sr = librosa.load(filepath)

    # Calculer le tempo
    bpm, _ = librosa.beat.beat_track(y=y, sr=sr)
    bpm = round(bpm[0])

    # Compute the Chroma Short-Time Fourier Transform (chroma_stft)
    chromagram = librosa.feature.chroma_stft(y=y, sr=sr)
    mean_chroma = np.mean(chromagram, axis=1)
    chroma_to_key = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    estimated_key_index = np.argmax(mean_chroma) 
    key = chroma_to_key[estimated_key_index]

    # Calculate the indices of the minor and major thirds
    min_third_index = (estimated_key_index + 3) % 12
    maj_third_index = (estimated_key_index + 4) % 12

    # Determine if the key is major or minor based on the amplitude of the thirds
    if mean_chroma[min_third_index] > mean_chroma[maj_third_index]:
        key = key + 'm'

    return bpm, key

def get_duration_from_librosa(filepath: str):
    return librosa.get_duration(filename=filepath)

