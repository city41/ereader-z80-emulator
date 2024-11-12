import { ErapiApiCallHandler } from "./types";

const idToSoundType: Record<number, "sfx" | "music"> = {
  34: "music",
  58: "music",
  59: "music",
  755: "sfx",
  756: "sfx",
};

const rst8ApiCallHandler: Record<number, ErapiApiCallHandler> = {
  [0x0]: {
    /**
     * a = 1, restart app, 2=return to ereader rom
     */
    functionName: "Exit",
    handle(state, _memory, _handleGenerator, erapiState) {
      erapiState.exit = state.a === 1 ? "reset" : "exit";
    },
  },
  [0x1]: {
    /**
     * hl = a*e
     */
    functionName: "Mul8",
    handle(state) {
      const result = state.a * state.e;
      state.h = result >> 8;
      state.l = result & 0xff;
    },
  },
  [0x2]: {
    functionName: "Mul16",
    /**
     * hl = hl * de
     */
    handle(state) {
      const hl = (state.h << 8) | state.l;
      const de = (state.d << 8) | state.e;

      const result = hl * de;
      state.h = result >> 8;
      state.l = result & 0xff;
    },
  },
  [0x3]: {
    /**
     * hl = hl / de
     */
    functionName: "Div",
    handle(state) {
      const hl = (state.h << 8) | state.l;
      const de = (state.d << 8) | state.e;

      const result = Math.floor(hl / de);
      state.h = result >> 8;
      state.l = result & 0xff;
    },
  },
  [0x4]: {
    /**
     * hl = hl % de
     */
    functionName: "Mod",
    handle(state) {
      const hl = (state.h << 8) | state.l;
      const de = (state.d << 8) | state.e;

      const result = hl % de;
      state.h = result >> 8;
      state.l = result & 0xff;
    },
  },
  [0x5]: {
    /**
     * hl = sound id
     */
    functionName: "PlaySystemSound",
    handle(state, _memory, _handleGenerator, erapiState) {
      const id = (state.h << 8) | state.l;
      erapiState.sounds.push({ id, type: idToSoundType[id] });
    },
  },
  [0x7]: {
    /**
     * a = rand from 0-ff
     */
    functionName: "Rand",
    handle(state) {
      state.a = Math.floor(Math.random() * 0xff);
    },
  },
  [0x12]: {
    /**
     * a = rand up to a max of a
     */
    functionName: "RandomMax",
    handle(state) {
      state.a = Math.floor(Math.random() * state.a);
    },
  },
  [0x16]: {
    /**
     * hl = sound id
     */
    functionName: "PauseSound",
  },
  [0x19]: {
    /**
     * hl = sound id?
     */
    functionName: "IsSoundPlaying",
  },
  [0x35]: {
    functionName: "ClearSpritesAndBackground",
    handle(_state, _memory, _handleGenerator, erapiState) {
      erapiState.sprites = [];
      erapiState.backgrounds = erapiState.backgrounds.map(() => {
        return { type: "null" };
      });
    },
  },
};

export { rst8ApiCallHandler };
