class PathsHandler {
  constructor() {
    this.paths = [];
  }

  create_a_new_path() {
    let path = build_one_path({});
    path.is_on_building = true
    this.paths.push(path);
    console.log('>>> new path created with id: ', path.id);
    return path;
  }

  draw_paths() {
    for (let path of this.paths) {
      path.draw_path();
    }
  }

  prepare_paths_for_db() {
    let paths_data = [];
    for (let path of this.paths) {
      paths_data.push(prepare_data_for_db(path));
    }
    return paths_data;
  }

  find_next_id() {
    if (this.paths.length === 0) {
      return 1; // Retourne 1 si `this.paths` est vide
    }
    let ids = this.paths.map(p => p.id);
    return Math.max(...ids) + 1;
  }

  check_path_name_exists_already(name) {
    let bool = this.paths.some(p => p.name === name);
    if (bool) {
      guide.receive_msg("name already used", 3, 'furtive');
    }
    return bool
  }

  show_all_paths() {
    for (let path of this.paths) {
      path.displayed = true;
    }
  }

  hide_all_paths() {
    for (let path of this.paths) {
      path.displayed = false;
    }
  }

  

}
