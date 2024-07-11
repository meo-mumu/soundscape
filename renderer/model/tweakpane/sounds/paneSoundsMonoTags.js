class PaneSoundsMonoTags {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
  }


  build(sound) {
    console.log('>>> build sound card tags');
    this.f_tags.hidden = true;
    this.f_tags = this.f_sound_card.addFolder({ title: 'tags (click to remove)' });
    this.build_tags_btn(sound);
    this.build_tags_input_list(sound);
  }

  build_tags_btn(sound) {
    for (let tag_name of sound.sd.tags) {
      let btn = this.f_tags.addButton({ title: tag_name + ' x' });
      btn.on('click', () => {
        sound.remove_tag(tag_name);
        setTimeout(() => this.build_sound_card_tags(sound), 0);
      });
    }
  }

  build_tags_input_list(sound) {
    // console.log('tags: ', tags.all_tag_name);
    let ttags = tags_handler.tags.filter(tag => !sound.sd.tags.includes(tag.name));
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
