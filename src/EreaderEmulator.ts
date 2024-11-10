import { ERAPI } from "./ERAPI/ERAPI";
import { renderFrame } from "./Screen";
import { SimulatedMemory } from "./SimulatedMemory";
import * as Z80 from "./Z80";
import { Z80Core, Z80State } from "./types";

class EreaderEmulator implements Z80Core {
  private z80: any;
  private erapi: ERAPI;
  private memory: SimulatedMemory;
  private handleCounter = 1;

  private handleGenerator: () => number;

  constructor(game: Uint8Array) {
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

  private async wait(millis: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, millis);
    });
  }

  async frame(canvas: HTMLCanvasElement): Promise<void> {
    this.z80.run_instruction();

    if (this.z80.halted) {
      const state = this.z80.getState();

      for (let i = 0; i < Math.max(state.a, 1); i += 1) {
        const start = Date.now();
        this.erapi.update();
        renderFrame(canvas, this.erapi);
        const duration = Date.now() - start;
        if (duration < 20) {
          await this.wait(20 - duration);
        }
      }

      state.pc += 1;
      state.halted = false;
      this.z80.setState(state);
    }
  }
}

export { EreaderEmulator };
