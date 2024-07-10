import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import db_handler as db
import files_handler as fh
import analyser
import mds

app = Flask(__name__)
CORS(app)

# sounds -----------------------------------------------------------------------
@app.route('/get_sounds_db', methods=['GET'])
def get_sounds_db():
    return jsonify(db.get_all_sounds())

@app.route('/update_sound', methods=['POST'])
def update_sound():
    sound_id = request.get_json().get('sound_id')
    sound_data = request.get_json().get('sound_data')
    print(sound_id, sound_data)
    db.update_document('sounds', sound_id, sound_data)
    return 'OK'

@app.route('/get_news_filepath', methods=['POST'])
def get_news_filepath():
    root_folder = request.get_json().get('root_folder')
    print(f"> get_new_filepath from {root_folder}")
    news_filepath: list[str] = fh.handle_changes_in_sound_file_folder(root_folder)
    # print(f"Foundddddddddddddddd {news_filepath} new files")
    return jsonify(news_filepath)

@app.route('/analyse_audio', methods=['POST'])
def analyse_audio():
    filepath = request.get_json().get('filepath')
    root_folder = request.get_json().get('root_folder')
    print(f"> analyse_audio {filepath}")
    data = analyser.analyse_audio(root_folder, filepath)
    snd = db.upsert_document('sounds', None,  data)
    return jsonify(snd)

@app.route('/calc_sounds_mds_position', methods=['POST'])
def calc_sounds_mds_position_route():
    print(f"json {request.get_json()}")
    window_width = request.get_json().get('windowWidth')
    window_height = request.get_json().get('windowHeight')
    mds.calc_sounds_mds_position(window_width, window_height)
    sounds = db.get_all_sounds()
    return jsonify(sounds)

@app.route('/get_sound_file', methods=['POST'])
def get_sound_file():
    filepath = request.get_json().get('filepath')
    print(f"get_sound_file {filepath}")
    return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))

# paths -----------------------------------------------------------------------
@app.route('/get_paths_db', methods=['GET'])
def get_paths_db():
    return jsonify(db.get_all_paths())

@app.route('/upsert_path', methods=['POST'])
def update_path():
    path_id = request.get_json().get('path_id')
    path_data = request.get_json().get('path_data')
    print(f"> upsert_path {path_id} {path_data}")
    db.upsert_document('paths', path_id, path_data)
    return 'OK'

@app.route('/delete_path', methods=['POST'])
def delete_path():
    path_id = request.get_json().get('path_id')
    print(f"> delete_path {path_id}")
    db.delete_document('paths', path_id)
    return 'OK'

@app.route('/export_path', methods=['POST'])
def export_path():
    root_folder = request.get_json().get('root_folder')
    path_id = request.get_json().get('path_id')
    print(f"> export {path_id}")
    export_folder = fh.export_path(root_folder, path_id)
    return jsonify(export_folder)


# sounds_handler = SoundsHandler()
# sounds = sounds_handler.sounds

# tags_handler = TagsHandler()
# tags_handler.init_all_tag(sounds)
# tags_handler.calculate_barycenters(sounds)

# path_handler = PathsHandler()
# path_handler.init_all_path_from_db()
# # for tag in tags_handler.all_tag.values():
# #     print(tag.name, tag.nb_occurences, tag.x_mds, tag.y_mds)




# @app.route('/path', methods=['GET'])
# def path():
#     j = jsonify([path.to_dict() for path in path_handler.paths.values()])
#     # print(j.get_data(as_text=True))
#     return j

# @app.route('/sync', methods=['GET'])
# def sync():
#     return "sync OK"

# @app.route('/serve_sound_file/<int:sound_id>', methods=['GET'])
# def serve_sound(sound_id: int):
#     filepath = sounds[sound_id].filepath
#     print(f"serve sound {sound_id} : {filepath}")
#     return send_from_directory(os.path.dirname(filepath), os.path.basename(filepath))

# @app.route('/search_sounds/<string:value>', methods=['GET'])
# def search_sounds(value: str):
#     print(f"> search sounds with {value}")
#     j = jsonify(sounds_handler.search_sounds(value))
#     print(j.get_data(as_text=True))
#     return j 


# @app.route('/add_tag/<int:sound_id>', methods=['POST'])
# def add_tags(sound_id: int):
#     tag = request.get_json().get('tag')
#     print(f"> add tag {tag} to sound {sound_id}")
#     tags_handler.handle_add_tag(tag, sounds[sound_id])
#     sounds_handler.update_sounds_db()
#     return jsonify(sounds[sound_id].to_dict())

# @app.route('/remove_tag/<int:sound_id>', methods=['POST'])
# def remove_tags(sound_id: int):
#     tag = request.get_json().get('tag')
#     print(f"> remove tag {tag} to sound {sound_id}")
#     tags_handler.handle_remove_tag(tag, sounds[sound_id])
#     sounds_handler.update_sounds_db()
#     return jsonify(sounds[sound_id].to_dict())

# @app.route('/serve_all_tag', methods=['GET'])
# def serve_all_tag():
#     j =jsonify([tag.to_dict() for tag in tags_handler.all_tag.values()])
#     # print(j.get_data(as_text=True))
#     return j 

# @app.route('/save_path/<int:id>', methods=['POST'])
# def save_path(id: int):
#     data = request.get_json()
#     path_handler.save_path_from_front(id, data)
#     return jsonify(id)

if __name__ == '__main__':
    app.run(port=5000)