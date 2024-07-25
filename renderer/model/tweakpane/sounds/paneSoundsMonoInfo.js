class PaneSoundsMonoInfo {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
    this.f_sound
  }

  build() {
    let sound = sounds_handler.selected_sounds[0];
    this.f_sound = this.pane_sounds.f_sounds.addFolder({ title: sound.sd.title , expanded: true });

    let params = {
      title: sound.sd.title ?? '',
      artist: sound.sd.artist ?? '',
      bpm: sound.sd.bpm ?? '',
      key: sound.sd.key ?? ''
    };
    this.f_sound.addInput(params, 'title');
    this.f_sound.addInput(params, 'artist');
    this.f_sound.addInput(params, 'bpm');
    this.f_sound.addInput(params, 'key');

    this.f_sound.addSeparator();
    this.build_palyer(sound)
  }

  build_palyer(sound) {
    let btn_play_pause = this.f_sound.addButton({ title: '▶️ / ||' });
    btn_play_pause.on('click', () => {
      console.log('play');
      sound.play_pause();
    });

    let btn_stop = this.f_sound.addButton({ title: '■' });
    btn_stop.on('click', () => {
      console.log('stop');
      sound.stop();
    });

    let slider_params = {
      'time': sound.song_time ?? 0
    };

    let slider_song_time = this.f_sound.addInput(slider_params, 'time', { min: 0, max: sound.sd.duration }, { step: 1 });
    slider_song_time.on('change', (value) => {
      sound.play_slider(value.value);
    });
  }

}
