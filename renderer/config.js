const API_BACK_URL = 'http://localhost:5000'
const root_folder = '/home/mumu/sound/little'

// ---------------------------------------------- user interraction
let lastClickTime = 0
const doubleClickDelay = 250
let current_dragging_sound
let panning_canvas = false
const panning_scale_factor = 0.8
let panX = 0
let panY = 0
let zoom_scale_value = 1
let mouseX_panned_scaled = 0
let mouseY_panned_scaled = 0

const dynamic_state = {
  IDLE: 'idle',
  GRABBED: 'grabbed'
}

const selected_state = {
  IDLE: 'idle',
  SELECTED: 'selected'
}

const playing_state = {
  PLAYED: 'playing',
  STOPPED: 'stopped',
  PAUSED: 'paused'
}




class Config {
  constructor() {
    // ---------------------------------------------- particules physics
    this.DAMPENING_BORDER_FACTOR = 0.9
    this.CANVAS_FRICTION_FORCE = 0.85
    this.PARTICULE_CHECKING_AREA = 30
    this.MAXVEL = 10
    this.MAXFORCE = 4

    // ---------------------------------------------- sound appearence
    this.R_CIRCLE = 10
    this.ROUNDNESS_SQUARE = 3

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

    this.SEARCHED_COLOR = color(255, 105, 180);

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
  
}