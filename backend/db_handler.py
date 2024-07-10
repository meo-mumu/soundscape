import os
from tinydb import TinyDB, Query

db = TinyDB('/home/mumu/soundscape/backend/db.json')
sounds_table = db.table('sounds')
tags_table = db.table('tags')
paths_table = db.table('paths')

# general
def update_document(table_name, doc_id, fields_to_update):
    table = db.table(table_name)
    table.update(fields_to_update, doc_ids=[doc_id])

# def insert_document(table_name, document):
#     print(f">>> insert document {document} in table {table_name}")
#     table = db.table(table_name)
#     document_id = table.insert(document) 
#     table.update({'id': document_id}, doc_ids=[document_id])
#     return table.get(doc_id=document_id)

def upsert_document(table_name, doc_id, document):
    table = db.table(table_name)
    existing_doc = table.get(doc_id=doc_id) if doc_id else None
    if existing_doc:
        print(f">>> update document {doc_id} in table {table_name}")
        table.update(document, doc_ids=[doc_id])
        return table.get(doc_id=doc_id)
    else:
        print(f">>> insert document {document} in table {table_name}")
        document_id = table.insert(document)
        table.update({'id': document_id}, doc_ids=[document_id])
        return table.get(doc_id=document_id)
    
def delete_document(table_name, doc_id):
    table = db.table(table_name)
    print(f">>> delete document {doc_id} in table {table_name}")
    table.remove(doc_ids=[doc_id])

# sounds
def get_sound_by_id(sound_id):
    Sound = Query()
    return sounds_table.get(Sound.id == sound_id)

def get_all_sounds():
    sounds = sounds_table.all()
    print(f"> retrive {len(sounds)} sounds from db")
    return sounds

def find_sound_by_hash_and_size(hash:str, size:int):
    Sound = Query()
    sounds = sounds_table.search((Sound.hash == hash) & (Sound.size == size))
    # si il y a plus d'un son alors print une erreur
    if len(sounds) > 1:
        for sound in sounds:
            print(f">>> En doublon : {sound['filepath']}")
        # delete double
        for sound in sounds[1:]:
            delete_document('sounds', sound.doc_id)
    if sounds:
        return sounds[0]

# paths
def get_all_paths():
    paths = paths_table.all()
    print(f"> retrive {len(paths)} paths from db")
    return paths

def get_path_by_id(path_id):
    Path = Query()
    return paths_table.get(Path.id == path_id)

def get_sounds_in_path(path_id):
    Path = Query()
    path = paths_table.get(Path.id == path_id)
    sounds = []
    if path:
        for sound_id in path['list_sounds_ids']:
            sound = get_sound_by_id(sound_id)
            sounds.append(sound)
    return sounds
