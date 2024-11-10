import { playSound } from "../sound";
import { SimulatedMemory } from "../SimulatedMemory";
import { Z80State } from "../types";
import { rst0ApiCallHandler } from "./rst0ApiCallHandlers";
import { rst8ApiCallHandler } from "./rst8ApiCallHandlers";
import { ERAPIBackground, ERAPICustomSprite, ERAPISystemSound } from "./types";

class ERAPI {
  public backgrounds: ERAPIBackground[] = [];
  public sprites: ERAPICustomSprite[] = [];
  public sounds: ERAPISystemSound[] = [];

  private updateSprite(sprite: ERAPICustomSprite) {
    if (sprite.autoAnimate) {
      sprite.autoAnimate.curAnimationCount += 1;

      if (
        sprite.autoAnimate.curAnimationCount >=
        sprite.autoAnimate.animationDuration
      ) {
        delete sprite.autoAnimate;
      } else {
        sprite.autoAnimate.curFrameCount += 1;
        if (
          sprite.autoAnimate.curFrameCount >= sprite.autoAnimate.frameDuration
        ) {
          sprite.currentFrame = (sprite.currentFrame + 1) % sprite.frames;
          sprite.autoAnimate.curFrameCount = 0;
        }
      }
    }
  }

  rst0(
    apiCallId: number,
    state: Z80State,
    memory: SimulatedMemory,
    handleGenerator: () => number
  ): Z80State {
    const apiHandler = rst0ApiCallHandler[apiCallId];
    if (!apiHandler) {
      console.error(`Unknown RST 0 API call: ${apiCallId.toString(16)}`);
      return state;
    }

    if (!apiHandler.handle) {
      console.error(
        `no handler for RST 0 ${apiCallId}: ${apiHandler.functionName}`
      );
      return state;
    }

    apiHandler.handle(state, memory, handleGenerator, this);

    return state;
  }

  rst8(
    apiCallId: number,
    state: Z80State,
    memory: SimulatedMemory,
    handleGenerator: () => number
  ): Z80State {
    const apiHandler = rst8ApiCallHandler[apiCallId];

    if (!apiHandler) {
      console.error(`Unknown RST 8 API call: ${apiCallId.toString(16)}`);
      return state;
    }

    if (!apiHandler.handle) {
      console.error(
        `no handler for RST 8 ${apiCallId}: ${apiHandler.functionName}`
      );
      return state;
    }

    apiHandler.handle(state, memory, handleGenerator, this);

    return state;
  }

  update() {
    this.sprites.forEach((s) => this.updateSprite(s));

    this.sounds.forEach((s) => playSound(s));
    this.sounds = [];
  }
}

export { ERAPI };
