class SoundsHandler {
  constructor() {
    this.sounds = [];
    this.threshold = 100;
    this.nearest_sounds = [];
  }

  // draw --------------------------------------------------------------------------------------------------------------

  draw_sounds() {
    for (let sound of this.sounds) sound.draw_sound()
    this.repeling()
  }

  repeling() {
    this.find_nearest_sounds();
    for (let sound of this.nearest_sounds) {
      sound.repels(this.nearest_sounds);
    }
  }

  find_nearest_sounds() {
    this.nearest_sounds = [];
    for (let sound of this.sounds) {
      if (this.isNear(sound)) {
        this.nearest_sounds.push(sound);
      }
    }
  }

  isNear(sound) {
    let distance = dist(mouseX_panned_scaled, mouseY_panned_scaled, sound.sp.pos.x, sound.sp.pos.y);
    return distance < this.threshold;
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

}
