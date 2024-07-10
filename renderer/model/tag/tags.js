class Tags {
  constructor() {
    this.tags = [];
    this.tags_appearence = false;
  }

  draw_tags() {
    if (this.tags_appearence) {
      for (let tag of this.tags) {
        fill(0);
        textSize(20);
        text(tag.name, tag.pos.x, tag.pos.y);
      }
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

  init_tags() {
    this.tags = []; // Reset tags list
    for (let sound of sounds.sounds) {
      if(sound.sd.tags) {
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
    for (let sound of sounds.sounds) {
      if(sound.sd.tags) {
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



}