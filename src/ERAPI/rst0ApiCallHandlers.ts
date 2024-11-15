import { extractCustomBackground } from "./backgrounds";
import { extractSprite } from "./sprites";
import { ERAPIBackground, ErapiApiCallHandler } from "./types";

const rst0ApiCallHandler: Record<number, ErapiApiCallHandler> = {
  [0x0]: {
    functionName: "FadeIn",
  },
  [0x1]: {
    functionName: "FadeOut",
  },
  [0x10]: {
    /**
     * a: system background id
     * e: background index
     */
    functionName: "LoadSystemBackground",
    handle(state, _memory, _handleGenerator, erapiState) {
      erapiState.backgrounds = erapiState.backgrounds.map<ERAPIBackground>(
        (b, i) => {
          if (i === state.e) {
            return {
              type: "system",
              backgroundId: state.a,
            };
          } else {
            return b;
          }
        }
      );
    },
  },
  [0x11]: {
    functionName: "SetBackgroundOffset",
  },
  [0x12]: {
    functionName: "SetBackgroundAutoScroll",
  },
  [0x19]: {
    /**
     * a = mode 0, 1 or 2
     * 0 - 4 2d backgrounds
     * 1 - 2 2d backgrounds, 1 affine background
     * 2 - 2 affine backgrounds
     */
    functionName: "SetBackgroundMode",
    handle(state, _match, _handleGenerator, erapiState) {
      if (state.a !== 0) {
        throw new Error(
          "SetBackgroundMode: only mode zero is supported so far"
        );
      }

      erapiState.backgrounds = [
        { type: "null" },
        { type: "null" },
        { type: "null" },
        { type: "null" },
      ];
    },
  },
  [0x20]: {
    functionName: "LayerShow",
  },
  [0x21]: {
    functionName: "LayerHide",
  },
  [0x2d]: {
    /**
     * a = background index (0-3)
     * de = pointer to background struct
     * background struct
     *   (word) pointer to tiles
     *   (word) pointer to palettes
     *   (word) pointer to map
     *   (word) number of tiles
     *   (word) number of palettes
     */
    functionName: "LoadCustomBackground",
    // this call takes 4 frames on a real GBA
    frameDelay: 4,
    handle(state, memory, _handleGenerator, erapiState) {
      const backgroundIndex = state.a;

      if (backgroundIndex < 0 || backgroundIndex > 3) {
        // TODO: deal with different background modes being set
        return;
      }

      const structPointer = (state.d << 8) | state.e;

      const background = extractCustomBackground(structPointer, memory);

      erapiState.backgrounds[state.a] = background;
    },
  },
  [0x30]: {
    functionName: "CreateSystemSprite",
  },
  [0x31]: {
    /**
     * hl = handle
     */
    functionName: "SpriteFree",
    handle(state, _memory, _handleGenerator, erapiState) {
      const spriteHandle = (state.h << 8) | state.l;
      erapiState.sprites = erapiState.sprites.filter(
        (s) => s.handle !== spriteHandle
      );
    },
  },
  [0x32]: {
    /**
     * hl = handle
     * de = x
     * bc = y
     */
    functionName: "SetSpritePos",
    handle(state, _memory, _handleGenerator, erapiState) {
      const spriteHandle = (state.h << 8) | state.l;
      const sprite = erapiState.sprites.find((s) => s.handle === spriteHandle);

      if (sprite) {
        const x = (state.d << 8) | state.e;
        const y = (state.b << 8) | state.c;
        sprite.x = x;
        sprite.y = y;
        sprite.visible = true;
      }
    },
  },
  [0x36]: {
    /**
     * hl = sprite handle
     * e = frame
     */
    functionName: "SetSpriteFrame",
    handle(state, _memory, _handleGenerator, erapiState) {
      const spriteHandle = (state.h << 8) | state.l;
      const sprite = erapiState.sprites.find((s) => s.handle === spriteHandle);

      if (sprite) {
        sprite.currentFrame = state.e;
      }
    },
  },
  [0x39]: {
    functionName: "SpriteAutoMove",
  },
  [0x3c]: {
    /**
     * hl = sprite handle
     * de = sprite frame duration in system frames
     * bc: 0 = Start Animating Forever
     *     1 = Stop Animation
     *     2 > Number of frames to animate for -2 (ex. 12 animates for 10 frames)
     */
    functionName: "SpriteAutoAnimate",
    handle(state, _memory, _handleGenerator, erapiState) {
      const spriteHandle = (state.h << 8) | state.l;
      const sprite = erapiState.sprites.find((s) => s.handle === spriteHandle);

      const frameDuration = (state.d << 8) | state.e;
      const animationDurationRaw = (state.b << 8) | state.c;
      const animationDuration =
        animationDurationRaw === 0
          ? Infinity
          : animationDurationRaw === 1
          ? 0
          : animationDurationRaw - 2;

      if (sprite) {
        sprite.visible = true;
        sprite.autoAnimate = {
          frameDuration,
          animationDuration,
          curFrameCount: 0,
          curAnimationCount: 0,
        };
      }
    },
  },
  [0x40]: {
    functionName: "SpriteAutoRotateByTime",
  },
  [0x45]: {
    functionName: "SpriteDrawOnBackground",
  },
  [0x46]: {
    /**
     * hl = sprite handle
     */
    functionName: "SpriteShow",
    handle(state, _memory, _handleGenerator, erapiState) {
      const spriteHandle = (state.h << 8) | state.l;
      const sprite = erapiState.sprites.find((s) => s.handle === spriteHandle);

      if (sprite) {
        sprite.visible = true;
      }
    },
  },
  [0x47]: {
    /**
     * hl = sprite handle
     */
    functionName: "SpriteHide",
    handle(state, _memory, _handleGenerator, erapiState) {
      const spriteHandle = (state.h << 8) | state.l;
      const sprite = erapiState.sprites.find((s) => s.handle === spriteHandle);

      if (sprite) {
        sprite.visible = false;
      }
    },
  },
  [0x48]: {
    functionName: "SpriteMirrorToggle",
  },
  [0x4d]: {
    /**
     * e = palette number
     * hl = pointer to sprite struct
     * sprite struct
     *  word: tiles pointer
     *  word: palette pointer
     *  byte: width in tiles
     *  byte: height in tiles
     *  byte: frames
     *  byte: ? (seems frame related?)
     *  byte: ?
     *  byte: ?
     *  byte: ? (seems frame related?)
     */
    functionName: "SpriteCreate",
    handle(state, memory, handleGenerator, erapiState) {
      const spriteStructAddress = (state.h << 8) | state.l;

      const sprite = extractSprite(spriteStructAddress, memory);
      sprite.handle = handleGenerator();
      sprite.paletteNumber = state.e;

      state.h = sprite.handle >> 8;
      state.l = sprite.handle & 0xff;

      erapiState.sprites = erapiState.sprites.concat(sprite);
    },
  },
  [0x5b]: {
    functionName: "SpriteAutoScaleUntilSize",
  },
  [0x7e]: {
    functionName: "SetBackgroundPalette",
  },
  [0x90]: {
    functionName: "CreateRegion",
  },
  [0x91]: {
    functionName: "SetRegionColor",
  },
  [0x92]: {
    functionName: "ClearRegion",
  },
  [0x98]: {
    functionName: "SetTextColor",
  },
  [0x99]: {
    functionName: "DrawText",
  },
  [0x9a]: {
    functionName: "SetTextSize",
  },
  [0xc0]: {
    functionName: "GetTextWidth",
  },
  [0xda]: {
    functionName: "SpriteSetPosAniamtedSpeed",
  },
  [0xf0]: {
    functionName: "SystemSpriteIdIsValid",
  },
};

export { rst0ApiCallHandler };
