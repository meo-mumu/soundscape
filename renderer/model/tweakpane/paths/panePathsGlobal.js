class PanePathsGlobal {

  constructor(pane_paths) {
    this.pane_paths = pane_paths
  }

  build() {
    let btn_show_all_paths = this.pane_paths.f_paths.addButton({ title: 'show all paths' });
    btn_show_all_paths.on('click', () => {
      paths_handler.show_all_paths();
    });
    
    let btn_hide_all_paths = this.pane_paths.f_paths.addButton({ title: 'hide all paths' });
    btn_hide_all_paths.on('click', () => {
      paths_handler.hide_all_paths();
    });
  }
    
}

