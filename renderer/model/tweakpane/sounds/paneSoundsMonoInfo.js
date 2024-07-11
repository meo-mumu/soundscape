class PaneSoundsMonoInfo {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
  }

  build(sound) {
    let params = {
      title: sound.sd.title ?? '',
      artist: sound.sd.artist ?? '',
      bpm: sound.sd.bpm ?? '',
      key: sound.sd.key ?? ''
    };
    this.f_sound_card.addInput(params, 'title');
    this.f_sound_card.addInput(params, 'artist');
    this.f_sound_card.addInput(params, 'bpm');
    this.f_sound_card.addInput(params, 'key');
  }
}
