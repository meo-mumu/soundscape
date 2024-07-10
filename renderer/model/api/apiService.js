// Fonction générique pour effectuer des requêtes HTTP
async function makeHttpRequest(url, method, body = null) {
  try {
    const options = {
      method: method,
      headers: {}
    };
    if (body) {
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(`Could not complete request to ${url}:`, error);
    throw error; // Propager l'erreur pour un traitement spécifique si nécessaire
  }
}

// sounds -----------------------------------------------------------------------------------------------------------
async function back_get_sounds_db() {
  const response = await makeHttpRequest('http://localhost:5000/get_sounds_db', 'GET');
  const data = await response.json();
  return data;
}

async function back_update_sound(sound_id, sound_data) {
  await makeHttpRequest('http://localhost:5000/update_sound', 'POST', { sound_id, sound_data });
}

async function back_get_news_filepath(root_folder) {
  const response = await makeHttpRequest('http://localhost:5000/get_news_filepath', 'POST', { root_folder });
  const data = await response.json()
  console.log(data)
  return data
}

async function back_analyse_audio(root_folder, filepath) {
  const requestBody = {
    root_folder: root_folder,
    filepath: filepath
  };
  const response = await makeHttpRequest('http://localhost:5000/analyse_audio', 'POST', requestBody);
  const data = await response.json();
  return data;
}

async function back_calc_sounds_mds_position() {
  const response = await makeHttpRequest('http://localhost:5000/calc_sounds_mds_position', 'POST', { windowWidth, windowHeight });
  const data = await response.json();
  return data;
}

async function back_get_sound_file(filepath) {
  const response = await makeHttpRequest('http://localhost:5000/get_sound_file', 'POST', { filepath: filepath });
  const soundBlob = await response.blob();
  return URL.createObjectURL(soundBlob);
}

// paths -----------------------------------------------------------------------------------------------------------
async function back_get_paths_db() {
  const response = await makeHttpRequest('http://localhost:5000/get_paths_db', 'GET');
  const data = await response.json();
  return data;
}

async function back_upsert_path(path_id, path_data) {
  console.log('back_upsert_path: ', path_id, path_data);
  await makeHttpRequest('http://localhost:5000/upsert_path', 'POST', { path_id, path_data });
}

async function back_delete_path(path_id) {
  await makeHttpRequest('http://localhost:5000/delete_path', 'POST', { path_id });
}

async function back_export_path(root_folder, path_id) {
  const response = await makeHttpRequest('http://localhost:5000/export_path', 'POST', { root_folder, path_id });
  const data = await response.json();
  return data;
}