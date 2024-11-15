import { Howl } from "howler";

class _SoundManager {
  private sounds: Record<string, Howl> = {};

  // private stopAllSounds(type: "sfx" | "music") {
  //   Object.values(audioCache).forEach((a) => {
  //     if (a.type === type) {
  //       a.audio.pause();
  //     }
  //   });
  // }

  setSounds(sounds: Record<string, Howl>) {
    this.sounds = sounds;
  }

  playSound(sound: string) {
    this.sounds[sound]?.play();
  }
}

const SoundManager = new _SoundManager();

export { SoundManager };
