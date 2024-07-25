class PaneSounds {

  constructor(panes_handler) {
    this.panes_handler = panes_handler;
    this.expanded = false;
    this.f_sounds = this.panes_handler.panes.addFolder({ title: 'Sounds', expanded: this.expanded });

    this.pane_sounds_global = new PaneSoundsGlobal(this);
    this.pane_sounds_mono_info = new PaneSoundsMonoInfo(this);
    this.pane_sounds_mono_tags = new PaneSoundsMonoTags(this);
    this.pane_sounds_multi = new PaneSoundsMulti(this);
  }

  build() {
    this.f_sounds.hidden = true;
    this.f_sounds = this.panes_handler.panes.addFolder({ title: 'Sounds', expanded: this.expanded });

    this.pane_sounds_global.build();
    this.f_sounds.addSeparator();

    if (sounds_handler.selected_sounds.length === 0) {
      return
    }
    if (sounds_handler.selected_sounds.length === 1) {
      this.expanded = true;
      this.pane_sounds_mono_info.build();
      this.f_sounds.addSeparator();
      this.pane_sounds_mono_tags.build();
    }
    else {
      this.expanded = true;
      this.pane_sounds_multi.build();
    }
  }



}
