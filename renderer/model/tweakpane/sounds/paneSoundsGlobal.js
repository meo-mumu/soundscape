class PaneSoundsGlobal {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
  }

  build() {
    let search_input = this.f_graph_params.addInput({ 'search': '' }, 'search');
    search_input.on('change', (value) => {
      if (value.value != '') {
        sounds_handler.search_sounds(value.value);
      }
    });

    let btn_bpm_color = this.f_graph_params.addButton({ title: 'bpm colors' });
    btn_bpm_color.on('click', () => {
      sounds_handler.apply_bpm_colors();
    });

    let btn_camelot_color = this.f_graph_params.addButton({ title: 'camelot colors' });
    btn_camelot_color.on('click', () => {
      sounds_handler.apply_camot_colors();
    });

    let btn_move_to_mds_postion = this.f_graph_params.addButton({ title: 'move to mds position' });
    btn_move_to_mds_postion.on('click', () => {
      sounds_handler.move_to_mds_positions();
    });

    let btn_stop_all_sound = this.f_graph_params.addButton({ title: 'stop all sound' });
    btn_stop_all_sound.on('click', () => {
      for (let sound of sounds_handler.sounds) {
        if (sound.song) {
          sound.stop();
        }
      }
    });
  }

}

