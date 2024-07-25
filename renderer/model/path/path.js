class Path {

  constructor(id, name, hex_color, list_sounds_ids = [], displayed) {
    this.id = id;
    this.name = name;
    this.hex_color = hex_color;
    this.list_sounds_ids = list_sounds_ids;
    this.displayed = displayed;
    
    this.stroke_weight = 1;
    this.list_sounds = this.find_sound_by_ids(list_sounds_ids);
    this.is_on_building = false;
    if (this.hex_color == null) { 
      this.color = color(random(255), random(255), random(255), 255) 
      this.hex_color = change_p5_color_to_hex(this.color)
    } 
    else { this.color = color(this.hex_color) }
  }

  find_sound_by_ids(list_sounds_ids) {
    let list_sounds = [];
    for (let sound_id of list_sounds_ids) {
      let sound = sounds_handler.sounds.find(sound => sound.sd.id == sound_id);
      list_sounds.push(sound);
    }
    return list_sounds;
  }

  add_sound(sound) {
    // console.log('>>> add_sound ', sound.sd.title, ' to path ', this.id);
    this.list_sounds.push(sound);
    this.list_sounds_ids.push(sound.sd.id);
  }

  remove_sound(sound) {
    // console.log('>>> remove_sound ', sound.sd.title, ' from path ', this.id);
    let index = this.list_sounds.indexOf(sound);
    this.list_sounds.splice(index, 1);
    this.list_sounds_ids.splice(index, 1);
  }

  draw_path() {
    if (this.list_sounds.length > 0 && this.displayed) {
      push()
      stroke(this.color);
      strokeWeight(this.stroke_weight);
      noFill();
      this._draw_line_composition();
      beginShape();
      let first_sound = this.list_sounds[0];
      curveVertex(first_sound.sp.pos.x, first_sound.sp.pos.y);
      for (let sound of this.list_sounds) {
        curveVertex(sound.sp.pos.x, sound.sp.pos.y);
      }
      let last_sound = this.list_sounds[this.list_sounds.length - 1];
      curveVertex(last_sound.sp.pos.x, last_sound.sp.pos.y);
      endShape();
      pop()
    }
  }

  _draw_line_composition() {
    if (this.is_on_building) {
      let last_sound = this.list_sounds[this.list_sounds.length - 1];
      if (last_sound) {
        stroke(this.color);
        strokeWeight(this.stroke_weight);
        line(mouseX_panned_scaled, mouseY_panned_scaled, last_sound.sp.pos.x, last_sound.sp.pos.y);
      }
    }
  }

  save() {
    let data = {
      id: this.id,
      name: this.name,
      hex_color: this.hex_color,
      list_sounds_ids: this.list_sounds_ids,
      displayed: this.displayed
    }
    back_upsert_path(this.id, data);
  }

  delete() {
    let index = paths_handler.paths.indexOf(this);
    paths_handler.paths.splice(index, 1);
    back_delete_path(this.id);
  }

  async export() {
    let export_folder = await back_export_path(root_folder, this.id);
    guide.receive_msg("path exported to " + export_folder, 3, 'furtive');
  }

}

function build_one_path(data) {
    // console.log('build_one_path from data: ', data);
    return new Path(
      data.id ? data.id : paths_handler.find_next_id(),
      data.name ? data.name : '',
      data.hex_color ? data.hex_color : null,
      data.list_sounds_ids ? data.list_sounds_ids : [],
      data.displayed ? data.displayed : true
    );
}