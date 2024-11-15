import { ERAPI } from "./ERAPI/ERAPI";
import { preloadCustomBackground, preloadSprite, renderFrame } from "./screen";
import { SimulatedMemory } from "./SimulatedMemory";
import * as Z80 from "./Z80";
import { Z80Core, Z80State } from "./types";
import { extractSprite } from "./ERAPI/sprites";
import { extractCustomBackground } from "./ERAPI/backgrounds";

type EmulationState = "stopped" | "running";

type EreaderEmulatorPreloadConfig = {
  sprites: number[];
  customBackgrounds: number[];
};

async function wait(millis: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, millis);
  });
}

class EreaderEmulator implements Z80Core {
  private game: Uint8Array;
  private z80: any;
  private erapi: ERAPI;
  private memory: SimulatedMemory;
  private handleCounter = 1;
  private framesToRender = 0;
  private emulationState: EmulationState = "stopped";
  private canvas: HTMLCanvasElement;

  private handleGenerator: () => number;

  constructor(game: Uint8Array, canvas: HTMLCanvasElement) {
    this.game = game;
    this.canvas = canvas;

    this.z80 = new (Z80 as any).Z80(this);
    const state = this.z80.getState();
    state.pc = 0x100;
    this.z80.setState(state);

    this.memory = new SimulatedMemory();
    this.memory.writeBlock(0x100, game);
    this.erapi = new ERAPI();

    this.handleGenerator = () => {
      const handle = this.handleCounter++;
      return handle;
    };
  }

  mem_read(address: number) {
    return this.memory.read8(address);
  }

  mem_write(address: number, val: number) {
    this.memory.write8(address, val);
  }

  io_read(_address: number): number {
    throw new Error("io_read called");
  }

  io_write(_address: number, _val: number) {
    throw new Error("io_write called");
  }

  onRst0(state: Z80State): Z80State {
    const address = state.pc;
    const apiCallId = this.memory.read8(address + 1);
    const newState = this.erapi.rst0(
      apiCallId,
      state,
      this.memory,
      this.handleGenerator
    );
    newState.pc = address + 1;
    return newState;
  }

  onRst8(state: Z80State): Z80State {
    const address = state.pc;
    const apiCallId = this.memory.read8(address + 1);
    const newState = this.erapi.rst8(
      apiCallId,
      state,
      this.memory,
      this.handleGenerator
    );
    newState.pc = address + 1;
    return newState;
  }

  private frame() {
    if (this.erapi.update()) {
      this.reset();
      return;
    }

    renderFrame(this.canvas, this.erapi);
    this.framesToRender -= 1;

    if (this.framesToRender > 0) {
      requestAnimationFrame(() => {
        this.frame();
      });
    } else {
      const state = this.z80.getState();
      state.pc += 1;
      state.halted = false;
      this.z80.setState(state);

      if (this.emulationState === "running") {
        requestAnimationFrame(() => {
          this.step();
        });
      }
    }
  }

  step() {
    while (!this.z80.halted) {
      this.z80.run_instruction();
    }

    this.framesToRender = Math.max(this.z80.getState().a, 1) * 2;

    requestAnimationFrame(() => {
      this.frame();
    });
  }

  run() {
    this.emulationState = "running";
    this.step();
  }

  pause() {
    this.emulationState = "stopped";
  }

  reset() {
    this.memory = new SimulatedMemory();
    this.memory.writeBlock(0x100, this.game);

    this.z80.reset();
    const state = this.z80.getState();
    state.pc = 0x100;
    this.z80.setState(state);

    this.erapi.reset();

    this.run();
  }

  keyToBitMask: Record<string, number> = {
    a: 0x0001,
    b: 0x0002,
    select: 0x0004,
    start: 0x0008,
    right: 0x0010,
    left: 0x0020,
    up: 0x0040,
    down: 0x0080,
    r: 0x0100,
    l: 0x0200,
  };

  keyWord = 0;

  public onKeyDown(key: string) {
    const bitMask = this.keyToBitMask[key];

    if (bitMask) {
      this.keyWord |= bitMask;

      const highByte = this.keyWord >> 8;
      const lowByte = this.keyWord & 0xff;

      this.memory.write8(0xc4, lowByte);
      this.memory.write8(0xc5, highByte);
    }
  }

  public onKeyUp(key: string) {
    const bitMask = this.keyToBitMask[key];

    if (bitMask) {
      this.keyWord &= ~bitMask;

      const highByte = this.keyWord >> 8;
      const lowByte = this.keyWord & 0xf;

      this.memory.write8(0xc4, lowByte);
      this.memory.write8(0xc5, highByte);
    }
  }

  public async preload(
    preloadConfig: EreaderEmulatorPreloadConfig
  ): Promise<void> {
    for (const spriteAddress of preloadConfig.sprites) {
      const sprite = extractSprite(spriteAddress, this.memory);
      preloadSprite(sprite);
      await wait(1);
    }

    for (const bgAddress of preloadConfig.customBackgrounds) {
      const bg = extractCustomBackground(bgAddress, this.memory);
      preloadCustomBackground(bg);
      await wait(1);
    }
  }
}

export { EreaderEmulator };
