class SoundDesign {
  constructor() {
    this.samples = [];
  }

  load_all_samples() {
    const sampleNames = ['Cup Large Metal.wav', 'Gun Shuck Short.wav', 'Metal Hat Closed.wav'];
    const basePath = '/home/mumu/soundscape/renderer/assets/samples/';
    sampleNames.forEach((name) => {
      const path = basePath + name;
      const sound = loadSound(path, () => {
        console.log(`[soundDesign] ${name} loaded successfully`);
      }, (e) => {
        console.error(`[soundDesign] Failed to load ${name}`, e);
      });

      const sample = new Sample(
        name,
        path,
        sound
      );
      this.samples.push(sample);
    });
  }
}

class Sample {
  constructor(name, path, sound) {
    this.name = name;
    this.path = path;
    this.sound = sound;
  }
}

let soundDesign = new SoundDesign();