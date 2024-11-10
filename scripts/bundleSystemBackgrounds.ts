import * as path from "node:path";
import * as fsp from "fs/promises";
import { createCanvas, Image, Canvas } from "canvas";

async function createCanvasFromPath(pngPath: string): Promise<Canvas> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = createCanvas(img.width, img.height);
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      resolve(canvas);
    };

    img.src = pngPath;
  });
}

const SRC_TEMPLATE = `export const systemBgs: Record<number, string> = {
    %%ENTRIES%%
};`;

async function main(systemBgDir: string, outPath: string) {
  const bgs = (await fsp.readdir(systemBgDir)).filter((f) =>
    f.endsWith(".png")
  );

  const dataUrls: Record<string, string> = {};

  for (const bg of bgs) {
    const id = path.basename(bg, path.extname(bg));
    const imageCanvas = await createCanvasFromPath(
      path.resolve(systemBgDir, bg)
    );
    const dataUrl = imageCanvas.toDataURL();
    dataUrls[id] = dataUrl;
  }

  const entries = Object.entries(dataUrls).map((e) => {
    return `    ${e[0]}: "${e[1]}"`;
  });

  const src = SRC_TEMPLATE.replace("%%ENTRIES%%", entries.join("\n"));

  await fsp.writeFile(outPath, src);
  console.log("wrote", outPath);
}

if (require.main === module) {
  const [_tsNode, _dumpHeader, systemBgDir, outPath] = process.argv;

  if (!systemBgDir || !outPath) {
    console.error(
      "usage: ts-node bundleSystemBackgrounds.ts <system-bg-dir> <out-path>"
    );
    process.exit(1);
  }

  main(path.resolve(systemBgDir), path.resolve(outPath))
    .then(() => console.log("done"))
    .catch((e) => console.error(e));
}
