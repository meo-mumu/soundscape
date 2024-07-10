class Sound {

  constructor(sound_data) {
    this.sd = sound_data;
    this.sp = new SoundParticle(this.sd);
    this.song;
    this.song_time = 0;
    this.i;
    this.j;

  }

  // ---------- draw

  draw_sound() {
    push();
    this.sp.draw_sound_particle();
    this._draw_info_text();
    pop();
  }

  _draw_info_text() {
    noStroke();
    let alpha = map(zoom_scale_value, 1, 1.8, 200, 255);
    fill(color(50, 80, 153, alpha));
    textFont(config.TEXT_PARTICULE_FONT_FAMILY);
    textSize(config.TEXT_PARTICULE_SIZE);
    textAlign(CENTER, CENTER);
    let artist_title = this.sd.artist ? this.sd.artist   + " - " + this.sd.title : this.sd.title;
    text(artist_title, this.sp.pos.x, this.sp.pos.y + this.sp.r / 2 + config.TEXT_PARTICULE_PADDING);
  }

  repels(others_sounds) {
    let others = others_sounds.filter(sound => sound != this);
    for (let other of others) {
      this.sp.repel(other.sp);
    }
  }


  // ---------- interaction from renderer.js
  
  async add_tag(name) {
    console.log('[sound] add tag: ', name);
    this.sd.tags.push(name);
    tags.add_tag_from_name(name);
    back_update_sound(this.sd.id, this.sd);
  }

  async remove_tag(name) {
    console.log('[sound] remove tag: ', name);
    this.sd.tags = this.sd.tags.filter(tag => tag != name);
    tags.remove_tag_from_name(name);
    back_update_sound(this.sd.id, this.sd);
  }

  play_pause() {
    if (this.sp.playing_state == playing_state.PLAYED) {
      this.sp.playing_state = playing_state.PAUSED;
      this.song.pause();
      this.song_time = this.song.currentTime();
    }
    else {
      this.sp.playing_state = playing_state.PLAYED;
      // console.log('this.song_time: ', this.song_time);
      this.song.play();
      this.song.jump(this.song_time);
    }
  }

  play_slider(time) {
    this.song_time = time;
    if (this.sp.playing_state == playing_state.PLAYED) {
      this.song.jump(this.song_time);
    }
    else {
      this.sp.playing_state = playing_state.PLAYED;
      this.song.play();
      this.song.jump(this.song_time, this.sd.duration);
    }
  }

  stop() {
    this.sp.playing_state = playing_state.STOPPED;
    this.song.stop();
    this.song_time = 0;
  }

  async load_song() {
    if (!this.song) {
      let sound_file = await back_get_sound_file(this.sd.filepath);
      this.song = loadSound(sound_file)
    }
  }

}


function build_one_sound(back_sound) {
  try {
    // console.log('back_sound: ', back_sound);
    const x = back_sound.x !== undefined ? back_sound.x : Math.random() * windowWidth
    const y = back_sound.y !== undefined ? back_sound.y : Math.random() * windowHeight
    const sound_data = new SoundData(
      back_sound.id,
      back_sound.name ? String(back_sound.name) : null,
      back_sound.filepath,
      back_sound.title,
      back_sound.artist,
      back_sound.bpm,
      back_sound.key,
      back_sound.tags,
      x,
      y,
      back_sound.x_mds,
      back_sound.y_mds,
      back_sound.duration
    );
    const s = new Sound(sound_data)
    // console.log('build new sound:', s);
    return s
  } catch (error) {
    console.error("Could not build new sound:", error);
  }


}