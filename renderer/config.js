const API_BACK_URL = 'http://localhost:5000'
const root_folder = '/home/mumu/sound/dig'

let canvas_bg_color;

class Config {
  constructor() {
    // ---------------------------------------------- particules physics
    this.DAMPENING_BORDER_FACTOR = 0.9
    this.CANVAS_FRICTION_FORCE = 0.85
    this.PARTICULE_CHECKING_AREA = 40
    this.MAXVEL = 10
    this.MAXFORCE = 4

    // ---------------------------------------------- sound appearence
    this.R_CIRCLE = 10
    this.ROUNDNESS_SQUARE = 1

    // ---------------------------------------------- particules info text
    this.TEXT_PARTICULE_FONT_FAMILY = 'Courier New'
    this.TEXT_PARTICULE_SIZE = 5
    this.TEXT_PARTICULE_PADDING = 5

    // ---------------------------------------------- sound states

    // ---------------------------------------------- colors
    this.CANVAS_BG_COLOR_IDLE = [237, 230, 242]
    this.CANVAS_BG_COLOR_PATH = [237, 240, 242]
    // let canvas_bg_color = color(237, 230, 242)
    // let idle_fill_color = color(175, 223, 204, 200)
    // let grabbed_fill_color = color(228, 190, 247, 200)
    // let text_particule_color = color(50, 80, 153)

    this.SEARCHED_COLOR = [
      color(255, 179, 71, 200), // Orange fluo plus clair
      color(255, 204, 0, 200),  // Jaune fluo plus clair
      color(255, 105, 97, 200), // Rouge fluo plus clair
      color(255, 255, 255, 200),
    ];
    this.BPM_COLOR = {
      1: color("#ccffff"),
      2: color("#99ffcc"),
      3: color("#ffcccc"),
      4: color("#cc99ff"),
      5: color("#6666ff"),
      6: color("#333399"),
    }

    this.CAMELOT_COLOR = {
      // big circle
      'G': color("#719EC6"),
      'D': color("#719EC8"),
      'A': color("#719E9E"),
      'E': color("#9EC671"),
      'B': color("#B8CC71"),
      'F#': color("#CCCC71"),
      'C#': color("#CC9E71"),
      'Ab': color("#CC719E"),
      'G#': color("#CC719E"),
      'Eb': color("#CC71B8"),
      'D#': color("#CC71CC"),
      'Bb': color("#CC71CC"),
      'A#': color("#CC71CC"),
      'F': color("#9E71CC"),
      'C': color("#7171CC"),
      // small circle
      'Em': color("#CC9ECC"),
      'Bm': color("#CC9EB8"),
      'F#m': color("#CC9E9E"),
      'C#m': color("#CCB89E"),
      'G#m': color("#CCCC9E"),
      'D#m': color("#B8CC9E"),
      'A#m': color("#9ECC9E"),
      'Fm': color("#9ECCB8"),
      'Cm': color("#9ECCCC"),
      'Gm': color("#9EB8CC"),
      'Dm': color("#9E9ECC"),
      'Am': color("#B89ECC")
    }

  }

  set_bpm_color(bpm) {
    let colorIndex;
    let lerpFactor;
    if (bpm < 50) {
      return this.BPM_COLOR['1']; // Corrected to use string key
    } else if (bpm < 90) {
      colorIndex = 1; // Start from 1 to match the keys in BPM_COLOR
      lerpFactor = map(bpm, 50, 90, 0, 1);
    } else if (bpm < 110) {
      colorIndex = 2;
      lerpFactor = map(bpm, 90, 110, 0, 1);
    } else if (bpm < 125) {
      colorIndex = 3;
      lerpFactor = map(bpm, 110, 125, 0, 1);
    } else if (bpm < 140) {
      colorIndex = 4;
      lerpFactor = map(bpm, 125, 140, 0, 1);
    } else if (bpm < 160) {
      colorIndex = 5;
      lerpFactor = map(bpm, 140, 160, 0, 1);
    } else {
      return this.BPM_COLOR['6']; // Corrected to use string key
    }
    if (bpm >= 50 && bpm <= 160) {
      // Ensure colorIndex and colorIndex + 1 are valid keys as strings
      return lerpColor(this.BPM_COLOR[String(colorIndex)], this.BPM_COLOR[String(colorIndex + 1)], lerpFactor);
    }
  }
  
}