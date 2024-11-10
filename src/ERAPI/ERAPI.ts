import { SimulatedMemory } from "../SimulatedMemory";
import { Z80State } from "../types";
import { rst0ApiCallHandler } from "./rst0ApiCallHandlers";
import { rst8ApiCallHandler } from "./rst8ApiCallHandlers";
import { ERAPIBackground, ERAPICustomSprite } from "./types";

class ERAPI {
  public backgrounds: ERAPIBackground[] = [];
  public sprites: ERAPICustomSprite[] = [];

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
    // TODO: things like scrolling backgrounds, auto animations, etc
  }
}

export { ERAPI };
