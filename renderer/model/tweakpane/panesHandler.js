class PanesHandler {
  constructor() {
    this.panes = new Tweakpane.Pane();
    this.pane_paths = new PanePaths(this);
    this.pane_tags = new PaneTags(this);
    this.pane_sounds = new PaneSounds(this);
    this.build_panes();
  }

  build_panes() {
    this.pane_paths.build();
    this.pane_tags.build();
    this.pane_sounds.build();
    this.panes.refresh();
  }

  expansion_false() {
    {
      this.pane_sounds.expanded = false;
      this.pane_paths.expanded = false;
      this.pane_tags.expanded = false;
    }
  }

}

