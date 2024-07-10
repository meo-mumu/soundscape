class PaneSoundCard {

  constructor(pane, tab) {
    this.pane = pane;
    this.tab = tab;

    this.f_sound_card = this.tab.pages[0].addFolder({ title: 'sound-card' });
    this.f_tags = this.f_sound_card.addFolder({ title: 'tags (click to remove)' });
    this.f_player = this.f_sound_card.addFolder({ title: 'player' });
    this.f_sound_card.hidden = true;

  }

  build_sound_card(sound) {
    console.log('>>> build sound card');
    this.f_sound_card = this.tab.pages[0].addFolder({ title: 'sound-card' });
    this.build_sound_card_first_input(sound);
    this.build_sound_card_player(sound);
    this.build_sound_card_tags(sound);
    this.f_sound_card.hidden = false;
    this.pane.refresh();
  }

  build_sound_card_first_input(sound) {
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

  build_sound_card_player(sound) {
    // this.f_player.hidden = false;
    console.log('>>> build sound card player');
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
      console.log('slider value: ', value.value);
      sound.play_slider(value.value);
    });
  }

  build_sound_card_tags(sound) {
    console.log('>>> build sound card tags');
    this.f_tags.hidden = true;
    this.f_tags = this.f_sound_card.addFolder({ title: 'tags (click to remove)' });
    this.build_sound_card_tags_btn(sound);
    this.build_sound_card_tags_input_list(sound);
  }

  build_sound_card_tags_btn(sound) {
    for (let tag_name of sound.sd.tags) {
      let btn = this.f_tags.addButton({ title: tag_name + ' x' });
      btn.on('click', () => {
        sound.remove_tag(tag_name);
        setTimeout(() => this.build_sound_card_tags(sound), 0);
      });
    }
  }

  async build_sound_card_tags_input_list(sound) {
    // console.log('tags: ', tags.all_tag_name);
    let ttags = tags.tags.filter(tag => !sound.sd.tags.includes(tag.name));
    let opt = [];
    opt.push({ text: '', value: '' });
    opt.push({ text: '> Enter a new tag', value: 'new_tag' });
    ttags.forEach(tag => {
      // console.log('tag: ', tag);
      opt.push({ text: tag.name, value: tag.name });
    });
    // console.log('opt: ', opt);
    let tag_list = this.f_tags.addBlade({
      view: 'list',
      label: '+ tag :',
      options: opt,
      value: '',
    });
    tag_list.on('change', (value) => {
      let tag_name = value.value;
      if (tag_name == 'new_tag') {
        this.build_new_tag_input(sound);
      } else {
        sound.add_tag(tag_name);
        setTimeout(() => this.build_sound_card_tags(sound), 0);
      }
    });
  }

  build_new_tag_input(sound) {
    console.log('choose to enter a new tag');
    if (!sound || !sound.sd) {
      console.error('Invalid sound object:', sound);
      return; // Sortie anticipée si sound ou sound.sd est indéfini
  }
    let new_tag_input = this.f_tags.addInput({ '': '' }, '');
    new_tag_input.on('change', (value) => {
      let tag_name = value.value;
      if (!sound.sd.tags.includes(tag_name)) {
        console.log('new tag value: ', tag_name);
        sound.add_tag(tag_name);
        setTimeout(() => this.build_sound_card_tags(sound), 0);
      }
      else {
        console.log('tag already exists');
      }
    });
  }

}