import numpy as np
from sklearn.manifold import MDS
from sklearn.preprocessing import MinMaxScaler
import db_handler as db

def calc_sounds_mds_position(window_width, window_height):
    print("> calc_sounds_mds_position with window_width", window_width, "and window_height", window_height)
    sounds = db.get_all_sounds()
    if len(sounds) == 0:
        return
    sounds_ids = [sound.doc_id for sound in sounds]
    n = len(sounds_ids)
    dissimilarity_matrix = np.zeros((n, n))
    for i in range(n):
        for j in range(n):
            tags_i = sounds[i]['tags']
            tags_j = sounds[j]['tags']
            dissimilarity_matrix[i, j] = _jaccard_distance(tags_i, tags_j)
    embedding = MDS(n_components=2, dissimilarity='precomputed')
    X_transformed = embedding.fit_transform(dissimilarity_matrix)
    scaler_w = MinMaxScaler(feature_range=(0, window_width))
    scaler_y = MinMaxScaler(feature_range=(0, window_height))
    X_transformed[:, 0] = scaler_w.fit_transform(X_transformed[:, 0].reshape(-1, 1)).reshape(-1)
    X_transformed[:, 1] = scaler_y.fit_transform(X_transformed[:, 1].reshape(-1, 1)).reshape(-1)
    np.random.seed(0)
    noise = np.random.normal(0, 0.01, X_transformed.shape)
    X_transformed += noise
    for i, sound_id in enumerate(sounds_ids):
        db.update_document('sounds', sound_id, {'x_mds': X_transformed[i, 0], 'y_mds': X_transformed[i, 1]})

def _jaccard_distance(tags1, tags2):
    set1 = set(tags1)
    set2 = set(tags2)
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    if union == 0:
        return 1  # Retourne une dissimilarité maximale si l'union est vide
    return 1 - intersection / union