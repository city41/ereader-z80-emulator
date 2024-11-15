import { Howl } from "howler";

async function loadAudioFile(url: string, volume = 1): Promise<Howl> {
  return new Promise((resolve, reject) => {
    const sound = new Howl({
      src: [url],
      volume,
      onload: () => {
        resolve(sound);
      },
      onloaderror: reject,
    });
  });
}

async function loadImageFile(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");

    img.onload = () => {
      resolve(img);
    };
    img.onerror = reject;

    img.src = url;
  });
}

async function loadUiAudio(onLoad: () => void): Promise<Record<string, Howl>> {
  console.log("about to load swipe success");
  const swipeSuccess = await loadAudioFile(
    "/resources/emulatorSounds/swipeSuccess.mp3"
  );
  console.log("loaded swipe success");
  onLoad();

  return { swipeSuccess };
}

const soundEntries = [
  {
    id: 1,
    file: "1.mp3",
  },
  {
    id: 24,
    file: "24.wav",
    volume: 0.2,
  },
  {
    id: 31,
    file: "31.mp3",
  },
  {
    id: 32,
    file: "32.mp3",
  },
  {
    id: 80,
    file: "80.mp3",
  },
  {
    id: 84,
    file: "84.mp3",
  },
  {
    id: 121,
    file: "121.mp3",
  },
  {
    id: 755,
    file: "755.mp3",
  },
  {
    id: 756,
    file: "756.mp3",
  },
];

async function loadEmuAudio(onLoad: () => void): Promise<Record<number, Howl>> {
  const emuAudio: Record<number, Howl> = {};

  for (const soundEntry of soundEntries) {
    const audio = await loadAudioFile(
      `/resources/systemSounds/${soundEntry.file}`,
      soundEntry.volume
    );
    onLoad();
    emuAudio[soundEntry.id] = audio;
  }

  return emuAudio;
}

async function loadSystemBackgrounds(
  onLoad: () => void
): Promise<Record<number, HTMLImageElement>> {
  const bgIds = [19];
  const bgImages: Record<number, HTMLImageElement> = {};

  for (const bgId of bgIds) {
    const bgImg = await loadImageFile(
      `/resources/systemBackgrounds/${bgId}.png`
    );
    onLoad();
    bgImages[bgId] = bgImg;
  }

  return bgImages;
}

export const TOTAL_LOAD_COUNT = 1 + 1 + soundEntries.length;

export { loadUiAudio, loadEmuAudio, loadSystemBackgrounds };
