class PanePath {

  constructor(pane, tab) {
    this.pane = pane;
    this.tab = tab;
    this.f_new_path = this.tab.pages[1].addFolder({ title: 'new-path' });
    this.f_paths = this.tab.pages[1].addFolder({ title: 'paths' });

    this.display_input_name_when_end = false;
    this.is_continuing_path = false;
    this.current_path;

    this.build_all();

  }

  build_all() {
    this.f_new_path.hidden = true;
    this.f_paths.hidden = true;

    this.f_new_path = this.tab.pages[1].addFolder({ title: 'new-path' });

    if (user_defining_path === false) {
      this.build_begin_new_path();
      this.f_paths = this.tab.pages[1].addFolder({ title: 'paths' });
      this.build_paths_input_list();
      if (this.current_path) {
        this.build_path_info();
      }
    }
    if (user_defining_path === true) {
      this.build_end_path();
      if (this.display_input_name_when_end) {
        this.build_name_input_after_end_path();
      }
    }
    this.pane.refresh();
  }

  build_begin_new_path() {
    let btn_begin_new_path = this.f_new_path.addButton({ title: 'begin new path' });
    btn_begin_new_path.on('click', () => {
      canvas_bg_color = config.CANVAS_BG_COLOR_PATH;
      user_defining_path = true;
      this.current_path = paths.create_a_new_path({});
      setTimeout(() => this.build_all(), 0);
    });
  }

  build_end_path() {
    let btn_end_new_path = this.f_new_path.addButton({ title: 'end path' });
    btn_end_new_path.on('click', () => {
      if (this.is_continuing_path) {
        user_defining_path = false;
        this.current_path.save();
        // this.current_path = null;
        this.is_continuing_path = false;
      }
      else {
        this.display_input_name_when_end = true;
      }
      this.current_path.is_on_building = false;
      setTimeout(() => this.build_all(), 0);
    });
  }

  build_name_input_after_end_path() {
    let params = {
      'name of the new path': '',
      'error': 'name already used'
    };
    let name_input = this.f_new_path.addInput(params, 'name of the new path');
    name_input.on('change', (value) => {
      if (!paths.check_path_name_exists_already(value.value)) {
        this.current_path.name = value.value;
        this.display_input_name_when_end = false;
        user_defining_path = false;
        canvas_bg_color = config.CANVAS_BG_COLOR_IDLE;
        this.current_path.save();
        this.current_path = null;
        setTimeout(() => this.build_all(), 0);
      }
    });
  }


  build_paths_input_list() {
    // console.log('>>> build_path_input_list');
    if (paths.paths) {
      let opt = [];
      // console.log('>>> paths: ', paths.paths);
      paths.paths.forEach(path => {
        let txt = '[' + path.id + '] ' + path.name;
        opt.push({ text: txt, value: path.id });
      });
      let path_list = this.f_paths.addBlade({
        view: 'list',
        label: 'choose a path:',
        options: opt,
        value: ''
      });
      path_list.on('change', (value) => {
        let path = paths.paths.find(sp => sp.id == value.value);
        this.current_path = path;
        setTimeout(() => this.build_all(), 0);
      });
    }
  }

  build_path_info() {

    // this.f_paths.addSeparator();
    // console.log('>>> build ', this.current_path.name, ' info: ');

    let params = {
      'name': this.current_path.name,
      'color': this.current_path.hex_color,
      'display': this.current_path.displayed,
    };

    let name_input = this.f_paths.addInput(params, 'name');
    name_input.on('change', (value) => {
      if (!paths.check_path_name_exists_already(value.value)) {
        this.current_path.name = value.value;
        this.current_path.save();
        setTimeout(() => this.build_all(), 0);
      }
    });

    let color_input = this.f_paths.addInput(params, 'color');
    color_input.on('change', (value) => {
      this.current_path.hex_color = value.value;
      this.current_path.color = color(value.value);
      savePathColor();
    });

    savePathColor = debounce(() => {
      this.current_path.save();
    });

    let bool_display = this.f_paths.addInput(params, 'display');
    bool_display.on('change', (value) => {
      this.current_path.displayed = value.value;
      this.current_path.save();
    });

    let btn_continue_path = this.f_paths.addButton({ title: 'continue path' });
    btn_continue_path.on('click', () => {
      canvas_bg_color = config.CANVAS_BG_COLOR_PATH;
      user_defining_path = true;
      this.current_path.is_on_building = true;
      this.is_continuing_path = true;
      // console.log('>>> continue path ', this.current_path.id);
      setTimeout(() => this.build_all(), 0);
    });

    let btn_remove_path = this.f_paths.addButton({ title: 'remove path' });
    btn_remove_path.on('click', () => {
      this.current_path.delete();
      this.current_path = null;
      setTimeout(() => this.build_all(), 0);
    });

    let btn_export_path = this.f_paths.addButton({ title: 'export path' });
    btn_export_path.on('click', () => {
      this.current_path.export();
    });
  }

}

