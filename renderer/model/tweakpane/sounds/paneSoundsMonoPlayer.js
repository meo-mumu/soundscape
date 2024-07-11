class PaneSoundsPlayer {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
    this.f_player = this.pane_sounds.f_sounds.addFolder({ title: 'player' });
  }


  build(sound) {
    // this.f_player.hidden = false;
    // console.log('>>> build sound card player');
    this.f_player = this.f_sound_card.addFolder({ title: 'player' });
    // faire 2 boutons play / pause et stop
    let btn_play_pause = this.f_player.addButton({ title: '▶️ / ||' });
    btn_play_pause.on('click', () => {
      console.log('play');
      sound.play_pause();
    });
    let btn_stop = this.f_player.addButton({ title: '■' });
    btn_stop.on('click', () => {
      console.log('stop');
      sound.stop();
    });
    let slider_params = {
      'song-time': sound.song_time ?? 0
    };
    // console.log('slider_params: ', slider_params);
    let slider_song_time = this.f_player.addInput(slider_params, 'song-time', { min: 0, max: sound.sd.duration }, { step: 1 });
    slider_song_time.on('change', (value) => {
      // console.log('slider value: ', value.value);
      sound.play_slider(value.value);
    });
  }
}
