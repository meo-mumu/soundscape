class PanePathsInfo {

  constructor(pane_paths) {
    this.pane_paths = pane_paths
  }

  build_paths_input_list() {
    // console.log('>>> build_path_input_list');
    if (paths_handler.paths) {
      let opt = [];
      // console.log('>>> paths: ', paths_handler.paths);
      paths_handler.paths.forEach(path => {
        let txt = '[' + path.id + '] ' + path.name;
        opt.push({ text: txt, value: path.id });
      });
      let path_list = this.pane_paths.f_paths.addBlade({
        view: 'list',
        label: 'paths list',
        options: opt,
        value: this.pane_paths.current_path ? this.pane_paths.current_path.id : ''
      });
      path_list.on('change', (value) => {
        let path = paths_handler.paths.find(sp => sp.id == value.value);
        this.pane_paths.current_path = path;
        this.pane_paths.expanded = true;
        setTimeout(() => panes_handler.build_panes(), 0);
      });
    }
  }

  build_path_info() {

    // this.pane_paths.f_paths.addSeparator();
    // console.log('>>> build ', this.pane_paths.current_path.name, ' info: ');

    let params = {
      'modify name': '',
      'color': this.pane_paths.current_path.hex_color,
      'display': this.pane_paths.current_path.displayed,
    };

    let name_input = this.pane_paths.f_paths.addInput(params, 'modify name');
    name_input.on('change', (value) => {
      if (!paths_handler.check_path_name_exists_already(value.value)) {
        this.pane_paths.current_path.name = value.value;
        this.pane_paths.current_path.save();
        this.pane_paths.expanded = true;
        setTimeout(() => panes_handler.build_panes(), 0);
      }
    });

    const debounce = (func, timeout = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
      };
    };

    const savePathColor = debounce(() => {
      this.pane_paths.current_path.save();
    });

    let color_input = this.pane_paths.f_paths.addInput(params, 'color');
    color_input.on('change', (value) => {
      this.pane_paths.current_path.hex_color = value.value;
      this.pane_paths.current_path.color = color(value.value);
      savePathColor();
    });

    let bool_display = this.pane_paths.f_paths.addInput(params, 'display');
    bool_display.on('change', (value) => {
      this.pane_paths.current_path.displayed = value.value;
      this.pane_paths.current_path.save();
    });

    let btn_continue_path = this.pane_paths.f_paths.addButton({ title: 'continue path' });
    btn_continue_path.on('click', () => {
      canvas_bg_color = config.CANVAS_BG_COLOR_PATH;
      user_defining_path = true;
      this.pane_paths.current_path.is_on_building = true;
      this.pane_paths.pane_paths_building.is_continuing_path = true;
      // console.log('>>> continue path ', this.pane_paths.current_path.id);
      this.pane_paths.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });

    let btn_remove_path = this.pane_paths.f_paths.addButton({ title: 'remove path' });
    btn_remove_path.on('click', () => {
      this.pane_paths.current_path.delete();
      this.pane_paths.current_path = null;
      this.pane_paths.expanded = true;
      setTimeout(() => panes_handler.build_panes(), 0);
    });

    let btn_export_path = this.pane_paths.f_paths.addButton({ title: 'export path' });
    btn_export_path.on('click', () => {
      this.pane_paths.current_path.export();
    });
  }
  
}

