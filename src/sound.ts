import { ERAPISystemSound } from "./ERAPI/types";
import { systemSounds } from "./systemSounds";

type SoundCacheEntry = {
  type: "sfx" | "music";
  audio: HTMLAudioElement;
};

const audioCache: Record<number, SoundCacheEntry> = {};

function createAudio(sound: ERAPISystemSound): HTMLAudioElement | null {
  const data = systemSounds[sound.id];

  if (!data) {
    return null;
  }

  const audio = document.createElement("audio");
  const blob = new Blob([data], { type: "audio/ogg" });
  audio.src = window.URL.createObjectURL(blob);

  return audio;
}

// function stopAllSounds(type: "sfx" | "music") {
//   Object.values(audioCache).forEach((a) => {
//     if (a.type === type) {
//       a.audio.pause();
//     }
//   });
// }

function playSound(sound: ERAPISystemSound) {
  // stopAllSounds(sound.type);

  // HACK: this is top stop the drum roll and play the cymbol
  // we don't want to stop other sounds as they often naturally overlap
  if (sound.id === 756) {
    audioCache[755].audio.pause();
  }

  const cachedAudio = audioCache[sound.id];

  if (cachedAudio) {
    cachedAudio.audio.play();
    return;
  }

  const audio = createAudio(sound);

  if (audio) {
    audioCache[sound.id] = {
      type: sound.type,
      audio,
    };
    audio.play();
  }
}

export { playSound };
