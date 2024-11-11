import { SimulatedMemory } from "../SimulatedMemory";
import { hash } from "./hash";
import { ERAPICustomSprite } from "./types";

function extractSprite(
  spriteStructAddress: number,
  memory: SimulatedMemory
): ERAPICustomSprite {
  const tilePointer = memory.getMemory16(spriteStructAddress);
  const palettePointer = memory.getMemory16(spriteStructAddress + 2);
  const width = memory.read8(spriteStructAddress + 4);
  const height = memory.read8(spriteStructAddress + 5);
  const frames = memory.read8(spriteStructAddress + 6);

  const BYTES_PER_TILE = 32;
  const tileDataSize = width * height * BYTES_PER_TILE * frames;

  const tiles = Array.from(memory.readBlock(tilePointer, tileDataSize));

  const palette: number[] = [];

  for (let i = 0; i < 16; ++i) {
    const paletteEntry = memory.getMemory16(palettePointer + i * 2);
    palette.push(paletteEntry);
  }

  const sprite: ERAPICustomSprite = {
    type: "custom",
    handle: 0,
    width,
    height,
    frames,
    tiles,
    palette,
    tilePaletteHash: hash(tiles.concat(palette)),
    paletteNumber: 0,
    visible: false,
    currentFrame: 0,
  };

  return sprite;
}

export { extractSprite };
