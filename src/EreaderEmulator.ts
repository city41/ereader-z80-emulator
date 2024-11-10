import { ERAPI } from "./ERAPI/ERAPI";
import { renderFrame } from "./Screen";
import { SimulatedMemory } from "./SimulatedMemory";
import * as Z80 from "./Z80";
import { Z80Core, Z80State } from "./types";

type EmulationState = "stopped" | "running";

class EreaderEmulator implements Z80Core {
  private z80: any;
  private erapi: ERAPI;
  private memory: SimulatedMemory;
  private handleCounter = 1;
  private framesToRender = 0;
  private emulationState: EmulationState = "stopped";
  private canvas: HTMLCanvasElement;

  private handleGenerator: () => number;

  constructor(game: Uint8Array, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.z80 = new (Z80 as any).Z80(this);
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
    this.erapi.update();
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

    this.framesToRender = Math.max(this.z80.getState().a, 1);

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
    const state = this.z80.getState();
    state.pc = 0x100;
    state.halted = false;
    this.z80.setState(state);

    this.run();
  }
}

export { EreaderEmulator };
