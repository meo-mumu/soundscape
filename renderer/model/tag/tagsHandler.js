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
 
  init_tags() {
    this.tags = []; // Reset tags list
    for (let sound of sounds_handler.sounds) {
      if (sound.sd.tags) {
        for (let tag_name of sound.sd.tags) {
          this.add_tag_from_name(tag_name);
        }
      }
    }
    this.update_tags_positions();
    console.log('[tags] after init tags: ', this.tags);
  }

  update_tags_positions() {
    // console.log('>>> update tags positions');
    const tagsInfo = {};
    for (let sound of sounds_handler.sounds) {
      if (sound.sd.tags) {
        for (let tag_name of sound.sd.tags) {
          if (!tagsInfo[tag_name]) {
            tagsInfo[tag_name] = { sumX: 0, sumY: 0, count: 0 };
          }
          tagsInfo[tag_name].sumX += sound.sp.pos.x;
          tagsInfo[tag_name].sumY += sound.sp.pos.y;
          tagsInfo[tag_name].count += 1;
        }
      }
    }
    for (let tag of this.tags) {
      if (tagsInfo[tag.name]) {
        const info = tagsInfo[tag.name];
        tag.pos.x = info.sumX / info.count;
        tag.pos.y = info.sumY / info.count;
      }
    }
  }

  show_all_tags() {
    for (let tag of this.tags) {
      tag.displayed = true;
    }
  }

  hide_all_tags() {
    for (let tag of this.tags) {
      tag.displayed = false;
    }
  }



  }