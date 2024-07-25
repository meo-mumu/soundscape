class TagsHandler {
  constructor() {
    this.tags = [];
  }

  draw_tags() {
    for (let tag of this.tags) {
      tag.draw_tag();
    }
  }

  add_tag_from_name(name) {
    // console.log('[tags]  add tag from name: ', name);
    const t = this.tags.find(t => t.name == name);
    if (t) {
      t.nb_occurence++;
    } else {
      this.tags.push(new Tag(name, 1, 0, 0));
    }
  }

  remove_tag_from_name(name) {
    // console.log('[tags] remove tag from name: ', name);
    const t = this.tags.find(t => t.name == name);
    if (t) {
      t.nb_occurence--;
      if (t.nb_occurence <= 0) {
        this.tags = this.tags.filter(t => t.name != name);
      }
    }
  }

  remove_tag_to_all_sounds_from_name_and_back_update_db(name) {
    print('[tagsHandler] remove tag to all sounds from name: ', name);
    for (let sound of sounds_handler.sounds) {
      if (sound.sd.tags.includes(name)) {
        print('remove the tag sound name ', sound.sd.name);
        sound.sd.tags = sound.sd.tags.filter(tag => tag != name);
      }
    }
    this.tags = this.tags.filter(t => t.name != name);
    print('[tagsHandler] tags_handler.tags: ', this.tags);
    sounds_handler.save_sounds();
  }

  remove_tag_to_selected_sounds_and_back_update_db(name) {
    console.log('[tags] remove tag to all selected sounds from name: ', name);
    for (let sound of sounds_handler.selected_sounds) {
      sound.sd.tags = sound.sd.tags.filter(tag => tag != name);
    }
    this.tags = this.tags.filter(t => t.name != name);
    sounds_handler.save_selected_sounds();
  }

  add_tag_to_selected_sounds_and_back_update_db(tag_name) {
    console.log('[tags] add new tag to selected sounds and back update db: ', tag_name);
    for (let sound of sounds_handler.selected_sounds) {
      if (!sound.sd.tags.includes(tag_name)) {
        sound.sd.tags.push(tag_name);
        this.add_tag_from_name(tag_name);
      }
    }
    sounds_handler.save_selected_sounds();
  }

  init_tags() {
    this.tags = []; // Reset tags list
    for (let sound of sounds_handler.sounds) {
      if (sound.sd.tags) {
        for (let tag_name of sound.sd.tags) {
          this.add_tag_from_name(tag_name);
        }
      }
    }
    console.log('[tags] after init tags: ', this.tags);
  }

  update_tags_positions() {
    console.log('>>> Mise à jour des positions des tags');
    for (let tag of this.tags) {
      let sumX = 0;
      let sumY = 0;
      for (let sound of sounds_handler.sounds) {
        if (sound.sd.tags.includes(tag.name)) {
          sumX += sound.sd.x_mds;
          sumY += sound.sd.y_mds;
        }
      }
      tag.pos.x = sumX / tag.nb_occurence;
      tag.pos.y = sumY / tag.nb_occurence;
    }
  }

  show_all_tags() {
    for (let tag of this.tags) {
      tag.display_center = true;
    }
  }

  hide_all_tags() {
    for (let tag of this.tags) {
      tag.display_center = false;
    }
  }

  reset_all_tag_filters() {
    for (let tag of this.tags) {
      tag.filter_sounds = false;
    }
  }

}