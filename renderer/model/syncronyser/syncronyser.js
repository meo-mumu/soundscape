async function sync_from_db() {
  await sync_sounds_from_db();
  await sync_paths_from_db();
  await init_tags_and_mds_positions();
}

async function sync_sounds_from_db() {
  // console.log('sync_sounds_from_db')
  const back_sounds = await back_get_sounds_db();
  for (let back_sound of back_sounds) {
    sounds_handler.add_sound(build_one_sound(back_sound))
  }
  console.log('[sync] nb sounds after sync_from_db: ', sounds_handler.sounds.length)
}

async function sync_paths_from_db() {
  const back_paths = await back_get_paths_db();
  for (let back_path of back_paths) {
    const path = build_one_path(back_path);
    paths_handler.paths.push(path);
  }
  console.log('[sync] nb paths after sync_from_db: ', paths_handler.paths.length)
}

async function init_tags_and_mds_positions() {
  // 1. init tags
  tags_handler.init_tags();

  // 2. update mds positions des sounds et move to it
  guide.receive_msg("Calculating sounds positions from their tags and move to it", 1, 'staging');
  back_sounds = await back_calc_sounds_mds_position();
  sounds_handler.update_mds_positions(back_sounds);
  sounds_handler.move_to_mds_positions();

  // 3. update tags position
  guide.receive_msg("Calculating tags positions", 1, 'furtive');
  tags_handler.update_tags_positions();
}


// -------------------------------------------------------------------------------------------------------------

async function sync_from_filesystem() {
  //    Le back fait la sync entre le folder et la db pour trouver :
  //    - les nouveaux sons (il return la liste des nouveau sons)
  //    - les sons qui ont été déplacés (update in db)
  //    - les sons qui ont été supprimés (update in db)
  guide.receive_msg("Sync with your folder", 1, 'furtive');
  news_filepath = await back_get_news_filepath(root_folder);
  if (news_filepath.length > 0) {
    console.log('[sync] news_filepath : ', news_filepath)
    guide.receive_msg("Found " + news_filepath.length + " new sounds", 1, 'furtive');
    analyse_news_sound(news_filepath);
    await init_tags_and_mds_positions();
  }
}

async function analyse_news_sound(news_filepath) {
  if (news_filepath.length > 0) {
    // guide.receive_msg("I will analysed those new sounds. You will see these sounds appearing on the screen", 2, 'furtive');
    for (filepath of news_filepath) {
      // 1. analyse audio
      guide.receive_msg("Analysing " + filepath.split(/[/\\]/).pop(), 0.5, 'staging');
      const back_sound = await back_analyse_audio(root_folder, filepath)
      sounds_handler.add_sound(build_one_sound(back_sound));
      // 2. add tags
      for (let tag_name of back_sound.tags) { tags_handler.add_tag_from_name(tag_name) }
    }
  }
}


