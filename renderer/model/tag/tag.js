class Tag {
  constructor(name, nb_occurence, x, y) {
    this.name = name
    this.pos = createVector(x, y)
    this.nb_occurence = nb_occurence
    this.display_center = false
    this.filter_sounds = false
  }

  modifify_name(name) {
    let older_name = this.name
    this.name = name
    for (let sound of sounds_handler.sounds) {
      sound.sd.tags = sound.sd.tags.map(tag => tag == older_name ? name : tag)
    }
  }

  draw_tag() {
    if (this.display_center) {
      push()
      fill(0);
      textSize(10);
      text(this.name, this.pos.x, this.pos.y);
      pop()
    }
  }

}
