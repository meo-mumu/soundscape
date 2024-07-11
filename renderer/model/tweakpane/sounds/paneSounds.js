class PaneSoundCard {

  constructor(pane, tab) {
    this.pane = pane;
    this.tab = tab;

    this.f_sound_card = this.tab.pages[0].addFolder({ title: 'sound-card' });
    this.f_tags = this.f_sound_card.addFolder({ title: 'tags (click to remove)' });

    this.f_sound_card.hidden = true;

  }
}


class PaneSoundCard {

  constructor(panes_handler) {
    this.panes_handler = panes_handler;
    this.f_sounds = this.panes_handler.panes.addFolder({ title: 'Sounds' });

    this.pane_sounds_global = new PaneSoundsGlobal(this);
    this.pane_sounds_mono_player = new PaneSoundsMonoPlayer(this);
    this.pane_sounds_mono_info = new PaneSoundsMonoInfo(this);
    this.pane_sounds_mono_tags = new PaneSoundsMonoTags(this);
  }

  build_pane() {
    this.f_sounds.hidden = true;
    this.f_sounds = this.panes_handler.panes.addFolder({ title: 'Sounds' });
    this.pane_sounds_global.build();
    this.pane_sounds_mono_player.build();
    this.pane_sounds_mono_info.build();
    this.pane_sounds_mono_tags.build();
  }
}
