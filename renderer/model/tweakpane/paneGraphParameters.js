class PaneGraphParameters {

  constructor(pane) {
    this.pane = pane;
    this.f_graph_params = this.pane.addFolder({ title: 'graph-parameters' });
    this.show_tags_center = false;
    this.build_all();
  }

  build_all() {

    let btn_bpm_color = this.f_graph_params.addButton({ title: 'bpm colors' });
    btn_bpm_color.on('click', () => {
      sounds.apply_bpm_colors();
    });

    let btn_camelot_color = this.f_graph_params.addButton({ title: 'camelot colors' });
    btn_camelot_color.on('click', () => {
      sounds.apply_camot_colors();
    });

    let btn_move_to_mds_postion = this.f_graph_params.addButton({ title: 'move to mds position' });
    btn_move_to_mds_postion.on('click', () => {
      sounds.move_to_mds_positions();
    });

    let btn_hide_tags = this.f_graph_params.addButton({ title: 'show/hide tags center' });
    // for (let tag of tags.tags) {
    //   console.log('tag: ', tag);
    // }
    btn_hide_tags.on('click', () => {
      tags.tags_appearence = !tags.tags_appearence;
    });

    let btn_display_all_path = this.f_graph_params.addButton({ title: 'show all paths' });
    btn_display_all_path.on('click', () => {
      for (let sounds_path of allSoundsPath.all_sounds_paths) {
        sounds_path.displayed = true;
      }
    });

    let btn_hide_all_path = this.f_graph_params.addButton({ title: 'hide all paths' });
    btn_hide_all_path.on('click', () => {
      for (let sounds_path of allSoundsPath.all_sounds_paths) {
        sounds_path.displayed = false;

      }
    });

    let btn_stop_all_sound = this.f_graph_params.addButton({ title: 'stop all sound' });
    btn_stop_all_sound.on('click', () => {
      for (let sound of sounds.sounds) {
        if (sound.song) {
          sound.stop();
        }
      }
    });

    let search_input = this.f_graph_params.addInput({ 'search': '' }, 'search');
    search_input.on('change', (value) => {
      if (value.value != '') {
        sounds.search_sounds(value.value);
      }
    });

    this.pane.refresh();
  }



}