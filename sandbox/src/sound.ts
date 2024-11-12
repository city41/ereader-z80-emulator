import { emulatorSounds } from "./emulatorSounds";

const audioCache: Record<string, HTMLAudioElement> = {};

function createAudio(sound: string): HTMLAudioElement | null {
  const data = emulatorSounds[sound];

  if (!data) {
    return null;
  }

  const audio = document.createElement("audio");
  const blob = new Blob([data], { type: "audio/ogg" });
  audio.src = window.URL.createObjectURL(blob);

  return audio;
}

function playSound(sound: string) {
  const cachedAudio = audioCache[sound];

  if (cachedAudio) {
    cachedAudio.play();
    return;
  }

  const audio = createAudio(sound);

  if (audio) {
    audioCache[sound] = audio;
    audio.play();
  }
}

export { playSound };
