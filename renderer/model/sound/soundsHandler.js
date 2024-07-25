class SoundsHandler {
  constructor() {
    this.sounds = [];
    this.selected_sounds = [];
    this.nearest_sounds = [];
    this.threshold_for_repels = 100;
  }

  // draw --------------------------------------------------------------------------------------------------------------

  draw_sounds() {
    for (let sound of this.sounds) sound.draw_sound()
    this.repeling()
  }

  repeling() {
    this.nearest_sounds = this.find_nearest_sounds_from_mouse(this.threshold_for_repels);
    for (let sound of this.nearest_sounds) {
      sound.repels(this.nearest_sounds);
    }
  }

  find_nearest_sounds_from_mouse(threshold) {
    let nearest_snd = [];
    for (let sound of this.sounds) {
      if (this.isNear(sound, threshold)) {
        nearest_snd.push(sound);
      }
    }
    return nearest_snd;
  }

  isNear(sound, threshold) {
    let distance = dist(mouseX_panned_scaled, mouseY_panned_scaled, sound.sp.pos.x, sound.sp.pos.y);
    return distance < threshold;
  }

  // general -----------------------------------------------------------------------------------------------------------

  add_sound(sound) {
    this.sounds.push(sound);
  }

  update_mds_positions(back_sounds) {
    for (let back_sound of back_sounds) {
      for (let sound of this.sounds) {
        if (sound.sd.id == back_sound.id) {
          sound.sd.x_mds = back_sound.x_mds;
          sound.sd.y_mds = back_sound.y_mds;
        }
      }
    }
  }

  save_sounds() {
    let sounds_data = [];
    for (let sound of this.sounds) {
      sounds_data.push(sound.sd);
    }
    back_save_sounds_db(sounds_data)
  }

  save_selected_sounds() {
    let sounds_data = [];
    for (let sound of this.selected_sounds) {
      sounds_data.push(sound.sd);
    }
    back_save_sounds_db(sounds_data)
  }

  move_to_mds_positions() {
    for (let sound of this.sounds) {
      sound.sp.is_moving_to_mds_position = true;
    }
  }

  apply_bpm_colors() {
    console.log('>>> apply bpm colors');
    for (let sound of this.sounds) {
      sound.sp.fill_color = sound.sp.bpm_color;
    }
  }

  apply_camot_colors() {
    console.log('>>> apply camelot colors');
    for (let sound of this.sounds) {
      sound.sp.fill_color = sound.sp.camelot_color;
    }
  }

  find_sound_in_mouse_position() {
    for (let sound of this.sounds) {
      if (sound.sp.isMouseInSound()) {
        return sound;
      }
    }
    return null;
  }

  add_or_remove_selected_sounds(sound, mode) {
    if (mode == 'mono') {
      this.unselect_all_sounds();
      if (this.selected_sounds.includes(sound)) {
        sound.sp.is_selected = false;
        this.selected_sounds = this.selected_sounds.filter(s => s != sound);
      }
      else {
        sound.sp.is_selected = true;
        this.selected_sounds.push(sound);
      }
    }
    else if (mode == 'multi') {
      if (!this.selected_sounds.includes(sound)) {
        sound.sp.is_selected = true;
        this.selected_sounds.push(sound);
      }
    }
  }

  unselect_all_sounds() {
    for (let sound of this.selected_sounds) {
      sound.sp.is_selected = false;
    }
    this.selected_sounds = [];
  }

  search_sounds(value) {
    if (value == '') {
      for (let snd of this.sounds) {
        snd.sp.searched = false;
      }
      return;
    }
    const pattern = new RegExp(value.toLowerCase());
    for (let snd of this.sounds) {
      if (pattern.test(snd.sd.name.toLowerCase()) ||
        pattern.test((snd.sd.title || '').toLowerCase()) ||
        pattern.test((snd.sd.artist || '').toLowerCase())) {
        snd.sp.searched = true;
      }
      else {
        snd.sp.searched = false;
      }
    }
  }

  update_displaying_relative_to_tag_filters() {
    let filtered_tags = tags_handler.tags.filter(tag => tag.filter_sounds);
    if (filtered_tags.length == 0) {
      for (let sound of this.sounds) {
        sound.is_displayed = true;
      }
      return;
    }
    console.log('filtered_tags: ', filtered_tags);
    for (let sound of this.sounds) {
      for (let tag of filtered_tags) {
        if (sound.sd.tags.includes(tag.name)) {
          sound.is_displayed = true;
          break;
        }
        else {
          sound.is_displayed = false;
        }
      }
    }
  }

}
