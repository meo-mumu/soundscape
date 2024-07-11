class PanePaths {

  constructor(panes_handler) {
    this.panes_handler = panes_handler;
    this.expanded = true;
    this.f_paths = this.panes_handler.panes.addFolder({ title: 'Paths', expanded: this.expanded });
    this.current_path;
    
    this.pane_paths_building = new PanePathsBuilding(this);
    this.pane_paths_info = new PanePathsInfo(this);
    this.pane_paths_global = new PanePathsGlobal(this);

  }

  build() {
    this.f_paths.hidden = true;
    this.f_paths = this.panes_handler.panes.addFolder({ title: 'Paths', expanded: this.expanded });

    this.pane_paths_global.build();

    if (user_defining_path === false) {
      this.pane_paths_building.build_btn_begin_new_path();
      this.pane_paths_info.build_paths_input_list();
      if (this.current_path) {
        this.pane_paths_info.build_path_info();
      }
    }
   else {
      this.pane_paths_building.build_end_path();
    }
    
  }

}

