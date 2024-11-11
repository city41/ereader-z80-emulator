import { SimulatedMemory } from "../SimulatedMemory";
import { hash } from "./hash";
import { ERAPICustomBackground } from "./types";

const BYTES_PER_TILE = 32;
const BYTES_PER_PALETTE = 32;

function extractCustomBackground(bgAddress: number, memory: SimulatedMemory) {
  const pointerToTiles = memory.getMemory16(bgAddress);
  const pointerToPalettes = memory.getMemory16(bgAddress + 2);
  const pointerToMap = memory.getMemory16(bgAddress + 4);
  const numberOfTiles = memory.getMemory16(bgAddress + 6);
  const numberOfPalettes = memory.getMemory16(bgAddress + 8);

  const tileDataSize = numberOfTiles * BYTES_PER_TILE;
  const palettesSize = numberOfPalettes * BYTES_PER_PALETTE;

  const tiles = Array.from(memory.readBlock(pointerToTiles, tileDataSize));

  const palettes: number[] = [];

  for (let i = 0; i < palettesSize; ++i) {
    const paletteEntry = memory.getMemory16(pointerToPalettes + i * 2);
    palettes.push(paletteEntry);
  }

  const map: number[] = [];

  // TODO: 32x32 this is just what solitaire does...
  for (let i = 0; i < 32 * 32; ++i) {
    const mapEntry = memory.getMemory16(pointerToMap + i * 2);
    map.push(mapEntry);
  }

  const background: ERAPICustomBackground = {
    type: "custom",
    tiles,
    palettes,
    map,
    tileHash: hash(tiles),
    fullHash: hash(tiles.concat(map, palettes)),
  };

  return background;
}

export { extractCustomBackground };
