class PaneSoundsGlobal {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
  }

  build() {
    let search_input = this.pane_sounds.f_sounds.addInput({ 'search': '' }, 'search');
    search_input.on('change', (value) => {
      if (value.value != '') {
        sounds_handler.search_sounds(value.value);
      }
    });

    let btn_bpm_color = this.pane_sounds.f_sounds.addButton({ title: 'bpm colors' });
    btn_bpm_color.on('click', () => {
      sounds_handler.apply_bpm_colors();
    });

    let btn_camelot_color = this.pane_sounds.f_sounds.addButton({ title: 'camelot colors' });
    btn_camelot_color.on('click', () => {
      sounds_handler.apply_camot_colors();
    });

    let btn_move_to_mds_postion = this.pane_sounds.f_sounds.addButton({ title: 'move to mds position' });
    btn_move_to_mds_postion.on('click', () => {
      sounds_handler.move_to_mds_positions();
    });

    let btn_stop_all_sound = this.pane_sounds.f_sounds.addButton({ title: 'stop all sound' });
    btn_stop_all_sound.on('click', () => {
      for (let sound of sounds_handler.sounds) {
        if (sound.song) {
          sound.stop();
        }
      }
    });

    let btn_sync = this.pane_sounds.f_sounds.addButton({ title: 'sync new sounds from folder' });
    btn_sync.on('click', () => {
      sync_from_filesystem();
    });
  }

}

