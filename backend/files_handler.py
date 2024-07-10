import shutil
import os
import config
import db_handler as db
from utils import find_hash

def handle_changes_in_sound_file_folder(root_folder: str):
    print(f"> [file handler] Check changes in sound file folder")
    new_files = folder_vs_db(root_folder)
    db_vs_folder()
    return new_files
    
def folder_vs_db(root_folder: str):
    news_filepath = []
    for root, dirs, files in os.walk(root_folder):
        if 'soundscape_export' in root:
            continue
        for file in files:
            if file.endswith(tuple(config.EXTENSIONS)):
                filepath = os.path.join(root, file)
                hash_value = find_hash(filepath)
                size = os.path.getsize(filepath)
                name = os.path.basename(filepath)

                sound = db.find_sound_by_hash_and_size(hash_value, size)

                if sound:
                    # Normaliser les chemins avant de comparer
                    db_filepath_normalized = os.path.normpath(sound['filepath'])
                    filepath_normalized = os.path.normpath(filepath)

                    diff = False
                    if db_filepath_normalized != filepath_normalized:
                        print(f"> [file handler > folder_vs_db] name is different: '{db_filepath_normalized}' != '{filepath_normalized}'")
                        diff = True
                    if sound['name'].lower() != name.lower():
                        print(f" [file handler > folder_vs_db] name is different: '{sound['name'].lower()}' != '{name.lower()}'")
                        diff = True

                    if diff:
                        # print(f"> [file handler] {sound['name']} is in the db but the filepath or name is different > update in db")
                        print(f"> {sound['filepath']} != {filepath} or {sound['name']} != {name}")
                        db.update_document(
                            table_name='sounds',
                            doc_id=sound.doc_id,
                            fields_to_update={'filepath': filepath, 'name': name}
                        )
                else:
                    print(f"> [file handler > folder_vs_db] {name} is not in the db > adding to news_filepath")
                    news_filepath.append(filepath)
    print(f"> [file handler > folder_vs_db] Found {len(news_filepath)} new files")
    print(news_filepath)
    return news_filepath

def db_vs_folder():
    sounds = db.get_all_sounds()
    for sound in sounds:
        if not os.path.exists(sound['filepath']):
            print(f"> [file handler] {sound['name']} is in the db but not in the folder > delete in db")
            db.delete_document('sounds', sound.doc_id)


def export_path(root_folder: str, path_id: int):
    pth = db.get_path_by_id(path_id)
    sounds = db.get_sounds_in_path(path_id)
    export_folder = os.path.join(root_folder, 'soundscape_export', pth['name'])
    
    if os.path.exists(export_folder):
        shutil.rmtree(export_folder)
    
    os.makedirs(export_folder)
    
    for sound in sounds:
        print(f"> [file handler] Export {sound['filepath']}")
        shutil.copy(sound['filepath'], export_folder)
    
    print(f"> [file handler] Export {pth['name']} in {export_folder}")
    return export_folder
