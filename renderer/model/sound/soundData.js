class SoundData {
  constructor(id, name, filepath, title, artist, bpm, key, tags, x, y, x_mds, y_mds, duration) {
    this.id = id;
    this.name = name.split('.')[0];
    this.filepath = filepath;
    this.title = title;
    this.artist = artist;
    this.bpm = bpm;
    this.key = key;
    this.tags = tags.sort();
    this.x = x;
    this.y = y;
    this.x_mds = x_mds;
    this.y_mds = y_mds;
    this.duration = duration;
  }

}