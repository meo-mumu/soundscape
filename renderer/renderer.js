/*
cd /home/mumu/soundscape ; npx electron-forge start
*/

// let panes_handler;

function preload() {
  soundDesign.load_all_samples();
}

async function setup() {
  // frameRate(1);
  canvas = createCanvas(windowWidth, windowHeight);
  config = new Config();
  guide = new Guide();
  user_interactions = new UserInteractions();
  canvas_bg_color = config.CANVAS_BG_COLOR_IDLE;

  sounds_handler = new SoundsHandler();
  tags_handler = new TagsHandler();
  paths_handler = new PathsHandler();
  

  await sync_from_db();
  panes_handler = new PanesHandler();
  // sync_from_filesystem();
}

function draw() {

  background(canvas_bg_color[0], canvas_bg_color[1], canvas_bg_color[2]);


  mouseX_panned_scaled = (mouseX - user_interactions.panX) / user_interactions.zoom_scale_value;
  mouseY_panned_scaled = (mouseY - user_interactions.panY) / user_interactions.zoom_scale_value;

  push();

  translate(user_interactions.panX, user_interactions.panY);
  scale(user_interactions.zoom_scale_value);

  guide.draw_message();
  paths_handler.draw_paths();
  sounds_handler.draw_sounds();
  tags_handler.draw_tags();

  multi_selection_with_dragging();
  // show_position_mouse()

  pop();

  // console log la postion de la souris

  // let fps = frameRate();
  // text(fps, 50, 50);

}

function show_position_mouse() {
  // console log la postion de la souris
  mouse_pos_str = mouseX + ' : ' + mouseY;
  text(mouse_pos_str, mouseX, mouseY);
}



