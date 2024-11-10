import { SimulatedMemory } from "../SimulatedMemory";
import { Z80State } from "../types";

export type ERAPINullBackground = {
  type: "null";
};

export type ERAPISystemBackground = {
  type: "system";
  backgroundId: number;
};

export type ERAPICustomBackground = {
  type: "custom";
  tiles: number[];
  palettes: number[];
  map: number[];

  tileHash: string;
  fullHash: string;
};

// TODO: text backgrounds
export type ERAPIBackground =
  | ERAPINullBackground
  | ERAPISystemBackground
  | ERAPICustomBackground;

export type ERAPIBaseSprite = {
  handle: number;
  width: number;
  height: number;
  x?: number;
  y?: number;
  visible: boolean;
  frames: number;
  currentFrame: number;
  autoAnimate?: {
    frameDuration: number;
    animationDuration: number;
    curFrameCount: number;
    curAnimationCount: number;
  };
};

export type ERAPISystemSprite = ERAPIBaseSprite & {
  type: "system";
  spriteId: number;
};

export type ERAPICustomSprite = ERAPIBaseSprite & {
  type: "custom";
  tiles: number[];
  palette: number[];
  paletteNumber: number;
};

export type ERAPIState = {
  backgrounds: ERAPIBackground[];
  sprites: ERAPICustomSprite[];
};

export type ErapiApiCallHandler = {
  functionName: string;
  handle?: (
    state: Z80State,
    memory: SimulatedMemory,
    handleGenerator: () => number,
    erapiState: ERAPIState
  ) => void;
};
