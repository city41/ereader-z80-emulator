import { ERAPISystemSound } from "./ERAPI/types";
import { systemSounds } from "./systemSounds";

type SoundCacheEntry = {
  type: "sfx" | "music";
  audio: HTMLAudioElement;
};

const audioCache: Record<number, SoundCacheEntry> = {};

async function createAudio(
  sound: ERAPISystemSound
): Promise<HTMLAudioElement | null> {
  const data = systemSounds[sound.id];

  if (!data) {
    return null;
  }

  //   const context = new AudioContext();

  //   await context.decodeAudioData(data);
  const audio = document.createElement("audio");
  const blob = new Blob([data], { type: "audio/ogg" });
  audio.src = window.URL.createObjectURL(blob);

  return audio;
}

function stopAllSounds(type: "sfx" | "music") {
  Object.values(audioCache).forEach((a) => {
    if (a.type === type) {
      a.audio.pause();
    }
  });
}

async function playSound(sound: ERAPISystemSound) {
  stopAllSounds(sound.type);
  const cachedAudio = audioCache[sound.id];

  if (cachedAudio) {
    cachedAudio.audio.play();
    return;
  }

  const audio = await createAudio(sound);

  if (audio) {
    audioCache[sound.id] = {
      type: sound.type,
      audio,
    };
    audio.play();
  }
}

export { playSound };
