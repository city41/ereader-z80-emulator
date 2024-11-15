async function loadAudioFile(url: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = document.createElement("audio");

    audio.oncanplaythrough = () => {
      resolve(audio);
    };
    audio.onerror = reject;

    audio.src = url;
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

async function loadUiAudio(): Promise<Record<string, HTMLAudioElement>> {
  const swipeSuccess = await loadAudioFile(
    "/resources/emulatorSounds/swipeSuccess.ogg"
  );

  return { swipeSuccess };
}

async function loadEmuAudio(): Promise<Record<number, HTMLAudioElement>> {
  const soundIds = [1, 24, 31, 32, 80, 84, 121, 755, 756];
  const emuAudio: Record<number, HTMLAudioElement> = {};

  for (const soundId of soundIds) {
    const audio = await loadAudioFile(`/resources/systemSounds/${soundId}.ogg`);
    emuAudio[soundId] = audio;
  }

  return emuAudio;
}

async function loadSystemBackgrounds(): Promise<
  Record<number, HTMLImageElement>
> {
  const bgIds = [19];
  const bgImages: Record<number, HTMLImageElement> = {};

  for (const bgId of bgIds) {
    const bgImg = await loadImageFile(
      `/resources/systemBackgrounds/${bgId}.png`
    );
    bgImages[bgId] = bgImg;
  }

  return bgImages;
}

export { loadUiAudio, loadEmuAudio, loadSystemBackgrounds };
