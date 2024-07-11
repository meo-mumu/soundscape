class Tag {
  constructor(name, nb_occurence, x, y) {
    this.name = name
    this.pos = createVector(x, y)
    this.nb_occurence = nb_occurence
    this.displayed = false
  }

  modifify_name(name) {
    this.name = name
    for (sound of sound_handler.sounds) {
      if (sound.sd.tags.includes(this.name)) {
        sound.sd.tags[sound.sd.tags.indexOf(this.name)] = name
      }
    }
  }

  draw_tag() {
    if (this.displayed) {
      fill(0);
      textSize(20);
      text(this.name, this.pos.x, this.pos.y);
    }
  }

}
