class SoundsPicture {
  constructor() {
    this.threshold = 100;
    this.nearest_sounds = [];

  }

  interact() {
    this.draw_sounds();
    this.find_nearest_sounds();
    this.repeling();
  }


  draw_sounds() {
    for (let sound of sounds) {
      sound.draw_sound();
    }
  }

  find_nearest_sounds() {
    this.nearest_sounds = [];
    for (let sound of sounds) {
      if (this.isNear(sound)) {
        this.nearest_sounds.push(sound);
      }
    }
  }

  repeling() {
    for (let sound of this.nearest_sounds) {
      sound.repels(this.nearest_sounds);
    }
  }

  isNear(sound) {
    let distance = dist(mouseX_panned_scaled, mouseY_panned_scaled, sound.sp.pos.x, sound.sp.pos.y);
    return distance < this.threshold;
  }

}
