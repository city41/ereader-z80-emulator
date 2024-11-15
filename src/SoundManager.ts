import { ERAPISystemSound } from "./ERAPI/types";

class _SoundManager {
  private sounds: Record<number, HTMLAudioElement> = {};

  // private stopAllSounds(type: "sfx" | "music") {
  //   Object.values(audioCache).forEach((a) => {
  //     if (a.type === type) {
  //       a.audio.pause();
  //     }
  //   });
  // }

  setSounds(sounds: Record<number, HTMLAudioElement>) {
    this.sounds = sounds;
  }

  playSound(sound: ERAPISystemSound) {
    // HACK: this is top stop the drum roll and play the cymbol
    // we don't want to stop other sounds as they often naturally overlap
    if (sound.id === 756) {
      this.sounds[755]?.pause();
    }

    this.sounds[sound.id]?.play();
  }
}

const SoundManager = new _SoundManager();

export { SoundManager };
