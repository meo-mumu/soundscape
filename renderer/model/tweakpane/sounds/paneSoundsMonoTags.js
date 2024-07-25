class PaneSoundsMonoTags {

  constructor(pane_sounds) {
    this.pane_sounds = pane_sounds
    this.f_tags
  }


  build() {
    let sound = sounds_handler.selected_sounds[0];
    this.f_tags = this.pane_sounds.pane_sounds_mono_info.f_sound.addFolder({ title: 'modify tags' });
    this.build_tags_btn(sound);
    this.build_tags_input_list(sound);
  }

  build_tags_btn(sound) {
    for (let tag_name of sound.sd.tags) {
      let btn = this.f_tags.addButton({ title: tag_name + ' x' });
      btn.on('click', () => {
        sound.remove_tag(tag_name);
        setTimeout(() => panes_handler.build_panes(), 0);
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
      value: 'sdf',
    });
    tag_list.on('change', (value) => {
      let tag_name = value.value;
      if (tag_name == 'new_tag') {
        this.build_new_tag_input(sound);
      } else {
        sound.add_tag(tag_name);
        setTimeout(() => panes_handler.build_panes(), 0);
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
        setTimeout(() => panes_handler.build_panes(), 0);
      }
      else {
        console.log('tag already exists');
      }
    });
  }

}
