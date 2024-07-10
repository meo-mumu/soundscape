/*
cd /home/mumu/soundscape ; npx electron-forge start
*/

let user_defining_path = false;
let canvas_bg_color;
let tpane;

async function setup() {
  // // frameRate(1);
  canvas = createCanvas(windowWidth, windowHeight);
  config = new Config();
  guide = new Guide();
  canvas_bg_color = config.CANVAS_BG_COLOR_IDLE;

  sounds = new Sounds();
  tags = new Tags();
  paths = new Paths();
  
  await sync_from_db();
  tpane = new TPane();
  sync_from_filesystem();
}

function draw() {

  background(canvas_bg_color[0], canvas_bg_color[1], canvas_bg_color[2]);


  mouseX_panned_scaled = (mouseX - panX) / zoom_scale_value;
  mouseY_panned_scaled = (mouseY - panY) / zoom_scale_value;

  push();

  translate(panX, panY);
  scale(zoom_scale_value);

  guide.draw_message();
  sounds.draw_sounds();
  tags.draw_tags();
  paths.draw_paths();

  pop();

  // let fps = frameRate();
  // text(fps, 50, 50);

}






// -----------------------------------------------------------

function mouseWheel(event) {
  let oldZoom = zoom_scale_value;
  zoom_scale_value -= event.delta * 0.0005;
  zoom_scale_value = constrain(zoom_scale_value, 0.5, 4);

  // Adjust pan to keep mouse position fixed while zooming
  let mousePositionBeforeZoom = createVector(mouseX - panX, mouseY - panY).div(oldZoom);
  let mousePositionAfterZoom = createVector(mouseX - panX, mouseY - panY).div(zoom_scale_value);

  let panAdjustment = mousePositionAfterZoom.sub(mousePositionBeforeZoom).mult(oldZoom);
  panX += panAdjustment.x;
  panY += panAdjustment.y;
}

function panning() {
  panning_canvas = true;
  panX += (mouseX - pmouseX) * panning_scale_factor;
  panY += (mouseY - pmouseY) * panning_scale_factor;
}

function mouseDragged(event) {
  event.preventDefault();
  if (mouseButton === RIGHT) {
    panning();
  }
  else if (mouseButton === LEFT) {
    if (current_dragging_sound) {
      current_dragging_sound.sp.move_from_grab();
    }
    else {
      for (let sound of sounds.sounds) {
        if (sound.sp.isMouseInSound() || sound.sp.dynamic_state == dynamic_state.GRABBED) {
          current_dragging_sound = sound;
        }
      }
    }
  }
}

function mouseClicked() {
  if (mouseButton === LEFT && user_defining_path) {
    for (let sound of sounds.sounds) {
      if (sound.sp.isMouseInSound()) {
        let path_on_building = tpane.pane_path.current_path;
        if (!path_on_building.list_sounds_ids.includes(sound.sd.id)) {
          path_on_building.add_sound(sound);
        }
        else {
          path_on_building.remove_sound(sound);
        }
      }

    }
  }
}

function mouseReleased() {
  panning_canvas = false;
  current_dragging_sound = null;
  for (let sound of sounds.sounds) {
    if (sound.sp.dynamic_state == dynamic_state.GRABBED) {
      sound.sp.release_from_grab();
    }
  }
}

function mousePressed() {
  for (let sound of sounds.sounds) {
    if (sound.sp.isMouseInSound()) {
      if (millis() - lastClickTime < doubleClickDelay) {
        doubleClickedProcess(sound);
        console.log("double")
      }
    }
  }
  lastClickTime = millis();
}

async function doubleClickedProcess(sound) {
  other_sounds = sounds.sounds.filter(s => s != sound);
  for (let s of other_sounds) {
    if (s.sp.selected_state == selected_state.SELECTED) {
      s.sp.selected_state = selected_state.IDLE;
      tpane.pane_sound_card.f_sound_card.hidden = true;
    }
  }
  if (sound.sp.selected_state == selected_state.SELECTED) {
    sound.sp.selected_state = selected_state.IDLE;
    tpane.pane_sound_card.f_sound_card.hidden = true;
  }
  else {
    sound.sp.selected_state = selected_state.SELECTED;
    tpane.pane_sound_card.build_sound_card(sound);
    sound.load_song();
  }
  tpane.pane.refresh();
}