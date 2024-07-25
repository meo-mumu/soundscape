class UserInteractions {

  constructor() {
    this.lastClickTime = 0
    this.doubleClickDelay = 250

    this.panX = 0
    this.panY = 0
    this.mouseX_panned_scaled = 0
    this.mouseY_panned_scaled = 0
    this.zoom_scale_value = 1
    this.panning_scale_factor = 0.8

    this.user_defining_path = false;
    this.panning_canvas = false;
    this.dragging_event = false;

    this.current_dragging_sound;

    this.threshold_for_selection = 30;

  }

  update_scale_params(event) {
    let oldZoom = this.zoom_scale_value;
    this.zoom_scale_value -= event.delta * 0.0005;
    this.zoom_scale_value = constrain(this.zoom_scale_value, 0.5, 4);
    let mousePositionBeforeZoom = createVector(mouseX - this.panX, mouseY - this.panY).div(oldZoom);
    let mousePositionAfterZoom = createVector(mouseX - this.panX, mouseY - this.panY).div(this.zoom_scale_value);
    let panAdjustment = mousePositionAfterZoom.sub(mousePositionBeforeZoom).mult(oldZoom);
    this.panX += panAdjustment.x;
    this.panY += panAdjustment.y;
  }

  update_pan_params() {
    this.panning_canvas = true;
    this.panX += (mouseX - pmouseX) * this.panning_scale_factor;
    this.panY += (mouseY - pmouseY) * this.panning_scale_factor;
  }

}

// --------------------------------------------------------------------------------------------------

// Fonction pour obtenir les coordonnées et la taille du Tweakpane
function getTweakpaneBounds() {
  const tweakpaneElement = document.querySelector('.tp-dfwv');
  if (tweakpaneElement) {
    const rect = tweakpaneElement.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    };
  }
  return null;
}

// Fonction pour vérifier si le clic est à l'intérieur du Tweakpane
function isClickInsideTweakpane(mouseX, mouseY) {
  const bounds = getTweakpaneBounds();
  if (bounds) {
    return mouseX >= bounds.x && mouseX <= bounds.x + bounds.width &&
           mouseY >= bounds.y && mouseY <= bounds.y + bounds.height;
  }
  return false;
}

// Écouteur d'événements pour les changements de taille de la fenêtre
window.addEventListener('resize', function() {
  // Vous pouvez mettre à jour ici tout ce qui doit être ajusté en fonction de la nouvelle taille de la fenêtre
  // console.log('La fenêtre a été redimensionnée, ajustez en fonction.');
});

// function isClickInsideTweakpane(mouseX, mouseY) {
//   const tweakpaneX = 10; // X position du Tweakpane
//   const tweakpaneY = 10; // Y position du Tweakpane
//   const tweakpaneWidth = 300; // Largeur du Tweakpane
//   const tweakpaneHeight = 400; // Hauteur du Tweakpane

//   return mouseX >= tweakpaneX && mouseX <= tweakpaneX + tweakpaneWidth &&
//          mouseY >= tweakpaneY && mouseY <= tweakpaneY + tweakpaneHeight;
// }

async function mouseClicked() {
  if (isClickInsideTweakpane(mouseX, mouseY)) {
    // console.log('Clic on tweakpane');
    return;
  }
  if (!user_interactions.dragging_event) {
    let snd = sounds_handler.find_sound_in_mouse_position();
    if (!snd) {
      sounds_handler.unselect_all_sounds();
      panes_handler.expansion_false()
      panes_handler.build_panes();
      return
    }
    // si on est en train de definir un path
    if (user_interactions.user_defining_path) {
      let path_on_building = panes_handler.pane_paths.current_path;
      if (!path_on_building.list_sounds_ids.includes(snd.sd.id)) {
        path_on_building.add_sound(snd);
      }
      else {
        path_on_building.remove_sound(snd);
      }
    }
    // sinon on selectionne les sons en mono ou multi
    else {
      if (keyIsDown(CONTROL) || keyIsDown(SHIFT)) {
        // // console.log("Ctrl or shift est maintenu");
        sounds_handler.add_or_remove_selected_sounds(snd, 'multi');
      }
      else {
        sounds_handler.add_or_remove_selected_sounds(snd, 'mono');
        await snd.load_song();
      }
      panes_handler.pane_sounds.expanded = true;
      panes_handler.build_panes();
    }
  }
}


function mouseDragged(event) {
  if (isClickInsideTweakpane(mouseX, mouseY)) {
    // console.log('Clic on tweakpane');
    return;
  }
  event.preventDefault();
  user_interactions.dragging_event = true;

  if (!keyIsDown(SHIFT)) {
    // continue panning
    if (user_interactions.panning_canvas) {
      user_interactions.update_pan_params()
      return
    }
    // continue dragging sound
    if (user_interactions.current_dragging_sound) {
      user_interactions.current_dragging_sound.sp.move_from_grab();
      return
    }
    // si on a appuyé sur shift, on selectionne les sons en multi
    // define current dragging sound
    user_interactions.current_dragging_sound = sounds_handler.find_sound_in_mouse_position();
    if (!user_interactions.current_dragging_sound) user_interactions.update_pan_params();
  }
}

function multi_selection_with_dragging() {
  if (keyIsDown(SHIFT)) {
    // // console.log("mouseDragged Shift est maintenu");
    let snds = sounds_handler.find_nearest_sounds_from_mouse(user_interactions.threshold_for_selection)
    if (snds.length > 0) {
      for (let snd of snds) {
        sounds_handler.add_or_remove_selected_sounds(snd, 'multi');
      }

    }
  }
}

function keyReleased() {
  if (keyCode === SHIFT) {
    // console.log("La touche SHIFT a été relâchée");
    panes_handler.pane_sounds.expanded = true;
    panes_handler.build_panes();
  }
}

function mousePressed() {
  user_interactions.dragging_event = false;
}

function mouseReleased() {
  user_interactions.panning_canvas = false;
  if (user_interactions.current_dragging_sound) user_interactions.current_dragging_sound.sp.release_from_grab();
  user_interactions.current_dragging_sound = null;
}

function mouseWheel(event) {
  user_interactions.update_scale_params(event);
}




















// function mousePressed() {
//   for (let sound of sounds_handler.sounds) {
//     if (sound.sp.isMouseInSound()) {
//       if (millis() - lastClickTime < doubleClickDelay) {
//         doubleClickedProcess(sound);
//         // console.log("double")
//       }
//     }
//   }
//   lastClickTime = millis();
// }

// async function doubleClickedProcess(sound) {
//   other_sounds = sounds_handler.sounds.filter(s => s != sound);
//   for (let s of other_sounds) {
//     if (s.sp.selected_state == selected_state.SELECTED) {
//       s.sp.selected_state = selected_state.IDLE;
//       panes_handler.pane_sound_card.f_sound_card.hidden = true;
//     }
//   }
//   if (sound.sp.selected_state == selected_state.SELECTED) {
//     sound.sp.selected_state = selected_state.IDLE;
//     panes_handler.pane_sound_card.f_sound_card.hidden = true;
//   }
//   else {
//     sound.sp.selected_state = selected_state.SELECTED;
//     panes_handler.pane_sound_card.build_sound_card(sound);
//     await sound.load_song();
//   }
//   panes_handler.panes.refresh();
// }

// --------------------------------------------------------------------------------------------------

