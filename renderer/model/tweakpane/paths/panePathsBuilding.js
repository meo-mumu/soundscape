class PanePathsBuilding {

  constructor(pane_paths) {
    this.pane_paths = pane_paths
    this.is_continuing_path = false;
    this.display_input_name_when_end = false;
  }

  build_btn_begin_new_path() {
    let btn_begin_new_path = this.pane_paths.f_paths.addButton({ title: 'begin a new path' });
    btn_begin_new_path.on('click', () => {
      canvas_bg_color = config.CANVAS_BG_COLOR_PATH;
      user_interactions.user_defining_path = true;
      this.pane_paths.current_path = paths_handler.create_a_new_path({});
      this.pane_paths.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });
  }

  // --------------------------------------------------------------

  build_end_path() {
    let btn_end_new_path = this.pane_paths.f_paths.addButton({ title: 'end path' });
    btn_end_new_path.on('click', () => {
      if (this.is_continuing_path) {
        user_interactions.user_defining_path = false;
        this.pane_paths.current_path.save();
        this.is_continuing_path = false;
      }
      else {
        this.display_input_name_when_end = true;
      }
      this.pane_paths.current_path.is_on_building = false;
      this.pane_paths.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });
    if (this.display_input_name_when_end) {
      this.build_name_input_after_end_path();
    }
  }

  build_name_input_after_end_path() {
    let params = {
      'name of the new path': '',
      'error': 'name already used'
    };
    let name_input = this.pane_paths.f_paths.addInput(params, 'name of the new path');
    name_input.on('change', (value) => {
      if (!paths_handler.check_path_name_exists_already(value.value)) {
        this.pane_paths.current_path.name = value.value;
        this.display_input_name_when_end = false;
        user_interactions.user_defining_path = false;
        canvas_bg_color = config.CANVAS_BG_COLOR_IDLE;
        this.pane_paths.current_path.save();
        // this.pane_paths.current_path = null;
        this.pane_paths.expanded = true;
        setTimeout(() => panes_handler.build_panes(), 0);
      }
    });
  }
}

