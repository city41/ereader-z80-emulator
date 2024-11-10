import {
  ERAPICustomBackground,
  ERAPICustomSprite,
  ERAPIState,
} from "./ERAPI/types";

const backgroundCache: Record<string, HTMLCanvasElement> = {};
const backgroundTileCache: Record<string, HTMLCanvasElement[]> = {};
const spriteCache: Record<string, HTMLCanvasElement> = {};

const BYTES_PER_TILE = 32;

// TODO: this assumes custom backgrounds are always 32tx32t (256pxx256px)
const MAP_TILES_HEIGHT = 32;
const MAP_TILES_WIDTH = 32;

function gba16ToRgb(gba16: number): [number, number, number] {
  const red5 = gba16 & 0x1f;
  const green5 = (gba16 >> 5) & 0x1f;
  const blue5 = (gba16 >> 10) & 0x1f;

  const red8 = Math.floor((red5 / 31) * 255);
  const green8 = Math.floor((green5 / 31) * 255);
  const blue8 = Math.floor((blue5 / 31) * 255);

  return [red8, green8, blue8];
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas") as HTMLCanvasElement;
  canvas.width = width;
  canvas.height = height;

  return canvas;
}

function drawTile(
  tileData: number[],
  palette: number[],
  options: { firstColorOpaque: boolean } = { firstColorOpaque: false }
): HTMLCanvasElement {
  const canvas = createCanvas(8, 8);
  const context = canvas.getContext("2d")!;

  const imageData = context.getImageData(0, 0, 8, 8);

  for (let p = 0; p < tileData.length; ++p) {
    const lowerPixel = (tileData[p] >> 4) & 0xf;
    const upperPixel = tileData[p] & 0xf;

    const upperColor = gba16ToRgb(palette[upperPixel]);
    const lowerColor = gba16ToRgb(palette[lowerPixel]);

    imageData.data[p * 8 + 0] = upperColor[0];
    imageData.data[p * 8 + 1] = upperColor[1];
    imageData.data[p * 8 + 2] = upperColor[2];
    imageData.data[p * 8 + 3] =
      upperPixel === 0 && !options.firstColorOpaque ? 0 : 255;

    imageData.data[p * 8 + 4] = lowerColor[0];
    imageData.data[p * 8 + 5] = lowerColor[1];
    imageData.data[p * 8 + 6] = lowerColor[2];
    imageData.data[p * 8 + 7] =
      lowerPixel === 0 && !options.firstColorOpaque ? 0 : 255;
  }

  context.putImageData(imageData, 0, 0);

  return canvas;
}

export function renderPalette(palette: number[]): HTMLCanvasElement {
  const canvas = createCanvas(16 * 8, 8);
  const context = canvas.getContext("2d")!;

  for (let i = 0; i < palette.length; ++i) {
    const rgbColor = gba16ToRgb(palette[i]);
    context.fillStyle = `rgb(${rgbColor[0]},${rgbColor[1]}, ${rgbColor[2]})`;
    context.fillRect(i * 8, 0, 8, 8);
  }

  return canvas;
}

function drawBackgroundTiles(
  tiles: number[],
  palette: number[]
): HTMLCanvasElement[] {
  const tileCount = tiles.length / BYTES_PER_TILE;

  const tileCanvases: HTMLCanvasElement[] = [];

  for (let i = 0; i < tileCount; ++i) {
    const tileData = tiles.slice(i * BYTES_PER_TILE, (i + 1) * BYTES_PER_TILE);
    const tileCanvas = drawTile(tileData, palette);
    tileCanvases.push(tileCanvas);
  }

  return tileCanvases;
}

function flipTile(tile: HTMLCanvasElement, flip: number): HTMLCanvasElement {
  if (flip === 0) {
    return tile;
  }

  const flippedTile = createCanvas(8, 8);
  const ctx = flippedTile.getContext("2d")!;

  let xTranslate = 0;
  let yTranslate = 0;
  let xScale = 1;
  let yScale = 1;

  if (flip & 1) {
    xTranslate = 8;
    xScale = -1;
  }

  if (flip & 2) {
    yTranslate = 8;
    yScale = -1;
  }

  ctx.translate(xTranslate, yTranslate);
  ctx.scale(xScale, yScale);

  ctx.drawImage(tile, 0, 0);

  return flippedTile;
}

// TODO: backgrounds with more than one palette
// the palette a tile in the map wants is at bits C-F
// palette = tileEntry >> 0xc
function drawBackground(
  map: number[],
  tiles: HTMLCanvasElement[]
): HTMLCanvasElement {
  const canvas = createCanvas(256, 256);
  const context = canvas.getContext("2d")!;

  for (let y = 0; y < MAP_TILES_HEIGHT; ++y) {
    for (let x = 0; x < MAP_TILES_WIDTH; ++x) {
      const mapIndex = y * MAP_TILES_WIDTH + x;
      const tileEntry = map[mapIndex];

      const tileId = tileEntry & 0x1ff;

      const tile = tiles[tileId];

      if (tile) {
        const flip = (tileEntry >> 10) & 0x3;
        const finalTile = flipTile(tile, flip);
        context.drawImage(finalTile, x * 8, y * 8);
        // } else {
        // errors.push(`Failed to find tile for id: ${tileId}`);
      }
    }
  }

  return canvas;
}

function createBackgroundTiles(bg: ERAPICustomBackground): HTMLCanvasElement[] {
  const cachedBgTiles = backgroundTileCache[bg.tileHash];

  if (cachedBgTiles) {
    return cachedBgTiles;
  }
  console.log("background tiles cache miss", bg.tileHash);

  const tiles = drawBackgroundTiles(bg.tiles, bg.palettes);

  backgroundTileCache[bg.tileHash] = tiles;

  return tiles;
}

function createCustomBackground(bg: ERAPICustomBackground): HTMLCanvasElement {
  const cachedBg = backgroundCache[bg.fullHash];

  if (cachedBg) {
    return cachedBg;
  }
  console.log("background cache miss", bg.fullHash);

  const tiles = createBackgroundTiles(bg);

  const bgCanvas = drawBackground(bg.map, tiles);

  backgroundCache[bg.fullHash] = bgCanvas;

  return bgCanvas;
}

function drawSprite(sprite: ERAPICustomSprite): HTMLCanvasElement {
  const canvas = createCanvas(sprite.width * 8, sprite.height * 8);
  const context = canvas.getContext("2d")!;

  const spriteSizeInTiles = sprite.width * sprite.height;

  for (let y = 0; y < sprite.height; ++y) {
    for (let x = 0; x < sprite.width; ++x) {
      const tileIndex =
        y * sprite.width + x + spriteSizeInTiles * sprite.currentFrame;
      const tileData = sprite.tiles.slice(
        tileIndex * BYTES_PER_TILE,
        (tileIndex + 1) * BYTES_PER_TILE
      );

      const tileCanvas = drawTile(tileData, sprite.palette);
      context.drawImage(tileCanvas, x * 8, y * 8);
    }
  }

  return canvas;
}

function createCustomSprite(sprite: ERAPICustomSprite): HTMLCanvasElement {
  const cachedSprite = spriteCache[`${sprite.handle}-${sprite.currentFrame}`];

  if (!cachedSprite) {
    // when caching, cache all the frames
    for (let i = 0; i < sprite.frames; ++i) {
      const spriteAtFrame = { ...sprite, currentFrame: i };
      const spriteCanvas = drawSprite(spriteAtFrame);
      spriteCache[`${sprite.handle}-${i}`] = spriteCanvas;
    }
  }

  return spriteCache[`${sprite.handle}-${sprite.currentFrame}`];
}

function renderFrame(canvas: HTMLCanvasElement, state: ERAPIState) {
  const context = canvas.getContext("2d")!;

  context.fillStyle = "green";
  context.fillRect(0, 0, canvas.width, canvas.height);

  state.backgrounds.forEach((bg) => {
    if (bg.type === "custom") {
      const bgCanvas = createCustomBackground(bg);
      context.drawImage(bgCanvas, 0, 0);
    }
  });

  state.sprites.forEach((sprite) => {
    // always create the sprite. this lets us load up and get ready for
    // sprites that have been created but are not yet visible or positioned
    const spriteCanvas = createCustomSprite(sprite);

    if (!sprite.visible || sprite.x === undefined || sprite.y === undefined) {
      return;
    }

    const halfWidthPx = (sprite.width * 8) / 2;
    const halfHeightPx = (sprite.height * 8) / 2;
    const spriteX = sprite.x - halfWidthPx;
    const spriteY = sprite.y - halfHeightPx;

    context.drawImage(spriteCanvas, spriteX, spriteY);
  });
}

export { renderFrame };
