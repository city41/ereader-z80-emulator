import * as path from "node:path";
import * as fsp from "fs/promises";

async function getSoundData(oggPath: string): Promise<number[]> {
  const buffer = await fsp.readFile(oggPath);
  const uint8Array = new Uint8Array(buffer);

  return Array.from(uint8Array);
}

const SRC_TEMPLATE = `export const emulatorSounds: Record<string, Uint8Array> = {
    %%ENTRIES%%
};`;

async function main(systemSoundDir: string, outPath: string) {
  const sounds = (await fsp.readdir(systemSoundDir)).filter((f) =>
    f.endsWith(".ogg")
  );

  const uint8Arrays: Record<string, string> = {};

  for (const sound of sounds) {
    const id = path.basename(sound, path.extname(sound));
    const soundData = await getSoundData(path.resolve(systemSoundDir, sound));
    const soundDataStr = `new Uint8Array([${soundData.join(",")}])`;
    uint8Arrays[id] = soundDataStr;
  }

  const entries = Object.entries(uint8Arrays).map((e) => {
    return `    ${e[0]}: ${e[1]},`;
  });

  const src = SRC_TEMPLATE.replace("%%ENTRIES%%", entries.join("\n"));

  await fsp.writeFile(outPath, src);
  console.log("wrote", outPath);
}

if (require.main === module) {
  const [_tsNode, _dumpHeader, emulatorSoundDir, outPath] = process.argv;

  if (!emulatorSoundDir || !outPath) {
    console.error(
      "usage: ts-node bundleEmulatorSounds.ts <emulator-sounds-dir> <out-path>"
    );
    process.exit(1);
  }

  main(path.resolve(emulatorSoundDir), path.resolve(outPath))
    .then(() => console.log("done"))
    .catch((e) => console.error(e));
}
