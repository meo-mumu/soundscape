const sound_appearence = {
  CIRCLE: 'circle',
  RECT: 'rect',
  MORPH_TO_LITTLE_CIRCLE: 'morph_to_circle',
  MORPH_TO_RECT: 'morph_to_rect'
}

const playing_state = {
  PLAYED: 'playing',
  STOPPED: 'stopped',
  PAUSED: 'paused'
}

class SoundParticle {

  constructor(sd) {
    this.sd = sd;
    this.pos = createVector(sd.x, sd.y);
    this.destination = this.pos.copy();
    this.acc = createVector(0, 0);
    this.vel = createVector(0, 0);

    this.r = config.R_CIRCLE;

    if (sd.key in config.CAMELOT_COLOR) {
      this.camelot_color = config.CAMELOT_COLOR[sd.key];
    } else {
      this.camelot_color = color(0);
    }

    this.bpm_color = config.set_bpm_color(sd.bpm);

    this.fill_color = this.bpm_color;
    this.last_fill_color = this.fill_color

    this.is_dragging = false;
    this.is_selected = false;

    this.playing_state = playing_state.STOPPED;
    this.sound_appearence = sound_appearence.CIRCLE;

    this.morph_state = 0;

    this.is_moving_to_mds_position = false;
    this.searched = false;

    this.colorIndex = 0;
    this.lastUpdateTime = 0;
    this.colorChangeInterval = 50;

    this.sample_repel = soundDesign.samples[0].sound;
  }


  draw_sound_particle() {
    this._update_position();
    this._update_fill_color_appearence();
    this._update_form_appearence();
  }

  repel(other_sp) {
    let d = dist(this.pos.x, this.pos.y, other_sp.pos.x, other_sp.pos.y);
    d = d - abs(this.r - other_sp.r);
    if (d < config.PARTICULE_CHECKING_AREA && !this.is_selected) {

      // if (!this.sample_repel.isPlaying()) {
      //   this.sample_repel.play();
      // }

      let force = p5.Vector.sub(this.pos, other_sp.pos);
      force.div((d * 2 + 0.001));
      this._apply_force(force);
    }
  }

  _update_fill_color_appearence() {
    if (this.searched) {
      let elapsedTime = millis() - this.lastUpdateTime;

      if (elapsedTime > this.colorChangeInterval) {
        this.colorIndex = (this.colorIndex + 1) % config.SEARCHED_COLOR.length;
        this.lastUpdateTime = millis();
      }

      let factor = (elapsedTime % this.colorChangeInterval) / this.colorChangeInterval;
      let nextColorIndex = (this.colorIndex + 1) % config.SEARCHED_COLOR.length;

      let oscColor = lerpColor(config.SEARCHED_COLOR[this.colorIndex], config.SEARCHED_COLOR[nextColorIndex], factor);
      fill(oscColor);
    } else {
      fill(this.fill_color);
    }
  }



  _update_form_appearence() {
    if (!this.is_selected && this.sound_appearence == sound_appearence.CIRCLE) {
      this._draw_circle();
    }
    else if (this.is_selected && this.sound_appearence == sound_appearence.RECT) {
      this._draw_rect();
    }
    else if (!this.is_selected && this.sound_appearence == sound_appearence.RECT) {
      this._morph_to_circle();
    }
    else if (this.is_selected && this.sound_appearence == sound_appearence.CIRCLE) {
      this._morph_to_rect();
    }
  }

  _draw_circle() {
    ellipse(this.pos.x, this.pos.y, this.r, this.r);
    this.r = this.r;
  }

  _draw_rect() {
    rectMode(CENTER);
    rect(this.pos.x, this.pos.y, this.r, this.r, config.ROUNDNESS_SQUARE);
  }

  _morph_to_circle() {
    this.morph_state += 0.1;
    this.morph_state = min(this.morph_state, 1);
    if (this.morph_state < 0.5) {
      let h = lerp(this.r, this.r * 4, this.morph_state);
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, h, h, config.ROUNDNESS_SQUARE);
    }
    else {
      let w = lerp(this.r * 4, config.R_CIRCLE, this.morph_state);
      ellipse(this.pos.x, this.pos.y, w, w);
    }
    if (this.morph_state >= 1) {
      this.sound_appearence = sound_appearence.CIRCLE;
      // console.log("morph to little circle is finished");
      this.morph_state = 0;
    }
  }


  _morph_to_rect() {
    this.morph_state += 0.1;
    this.morph_state = min(this.morph_state, 1);
    if (this.morph_state < 0.5) {
      let w = lerp(this.r, this.r * 4, this.morph_state);
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, w, w, config.ROUNDNESS_SQUARE);
    }
    else {
      let h = lerp(this.r * 4, config.R_CIRCLE, this.morph_state);
      rectMode(CENTER);
      rect(this.pos.x, this.pos.y, h, h, config.ROUNDNESS_SQUARE);
    }
    if (this.morph_state >= 1) {
      this.sound_appearence = sound_appearence.RECT;
      // console.log("morph to big rect is finished");
      this.morph_state = 0;
    }
  }

  _update_position() {
    if (this.is_moving_to_mds_position) {
      this._go_to_the_destination(this.sd.x_mds, this.sd.y_mds);
    }
    this.vel.add(this.acc);
    this.vel.limit(config.MAXVEL);
    this._apply_friction();
    // this._boucing_edges();
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  _go_to_the_destination(dest_x, dest_y) {
    let dest = createVector(dest_x, dest_y);
    let dir = p5.Vector.sub(dest, this.pos);
    let dist = dir.mag(); // Calcul de la distance à la destination

    // Normalisation de la direction
    dir.normalize();

    // Ajustement de la magnitude de la force en fonction de la distance
    // Exemple : diminution linéaire de la vitesse en fonction de la distance
    let speed = map(dist, 0, 100, 0, config.MAXVEL); // Ajustez 100 selon la distance maximale attendue
    speed = constrain(speed, 2, config.MAXVEL); // Assurez-vous que la vitesse reste entre 2 et MAXVEL

    // Application de la force ajustée
    dir.mult(speed);
    this._apply_force(dir);

    // Arrêt de l'objet s'il est très proche de la destination
    if (dist < 1) {
      this.is_moving_to_mds_position = false;
    }
  }

  _apply_force(force) {
    force.limit(config.MAXFORCE);
    this.acc.add(force);
  }

  _apply_friction() {
    this.vel.mult(config.CANVAS_FRICTION_FORCE);
  }

  _boucing_edges() {
    const edges = [{ axis: 'x', limit: width }, { axis: 'y', limit: height }];
    edges.forEach(edge => {
      if (this.pos[edge.axis] > edge.limit - this.r || this.pos[edge.axis] < this.r) {
        this.vel[edge.axis] *= -config.DAMPENING_BORDER_FACTOR;
        this.pos[edge.axis] = this.pos[edge.axis] < this.r ? this.r : edge.limit - this.r;
      }
    });
  }

  // ------------------ mouse interaction
  isMouseInSound() {
    return dist(this.pos.x, this.pos.y, mouseX_panned_scaled, mouseY_panned_scaled) < this.r;
  }

  move_from_grab() {
    this.is_dragging = true;
    this.pos.x = mouseX_panned_scaled;
    this.pos.y = mouseY_panned_scaled;
  }

  release_from_grab() {
    this.is_dragging = false;
  }

}

