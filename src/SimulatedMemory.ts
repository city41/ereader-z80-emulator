/**
 * ZX81 Debugger
 *
 * File:			SimulatedMemory.ts
 * Description:		Represents the simulated memory.
 * Original Author:			Sebastien Andrivet, based on Dezog my Thomas Busse (Maziac)
 * Modifications: Matt Greer
 * License:			GPLv3
 * Copyrights: 		ZX81 Debugger Copyright (C) 2023 Sebastien Andrivet
 * 					DeZog Copyright (C) 2023 Maziac
 */

/**
 * Represents the simulated memory.
 * It is a base class to allow memory paging etc.
 */
export class SimulatedMemory {
  // The memory
  public memory: Uint8Array;

  /**
   * Constructor.
   */
  constructor() {
    this.memory = new Uint8Array(64 * 1024);
  }

  /**
   * Clears the whole memorywith 0s.
   * So far only used by unit tests.
   */
  public clear() {
    this.memory.fill(0);
  }

  // Read 1 byte.
  // This is used by the Z80 CPU.
  // Note: no special check is done reading UNUSED memory. As this cannot be
  // written a read will always return the default value (0).
  public read8(addr64k: number): number {
    return this.memory[addr64k];
  }

  // Write 1 byte.
  // This is used by the Z80 CPU.
  public write8(addr64k: number, val: number) {
    this.memory[addr64k] = val;
  }

  // Reads a value from the memory. Value can span over several bytes.
  // This is **not** used by the Z80 CPU.
  // Used to read the WORD at SP or to read a 4 byte opcode.
  // @param addr64k The 64k start address
  // @param size The length of the value in bytes.
  // @returns The value (little endian)
  public getMemoryValue(addr64k: number, size: number): number {
    let value = 0;
    let shift = 1;

    for (let i = size; i > 0; i--) {
      // Read
      const val8 = this.memory[addr64k];
      // Store
      value += val8 * shift;
      // Next
      addr64k = (addr64k + 1) & 0xffff;
      shift *= 256;
    }

    return value;
  }

  // Reads 2 bytes.
  // This is **not** used by the Z80 CPU.
  // Used to read the WORD at SP.
  public getMemory16(addr64k: number): number {
    return this.getMemoryValue(addr64k, 2);
  }

  // Reads 4 bytes.
  // This is **not** used by the Z80 CPU.
  // Used to read an opcode which is max. 4 bytes.
  public getMemory32(addr64k: number): number {
    return this.getMemoryValue(addr64k, 4);
  }

  /**
   * Write to memoryData directly into memory.
   * Is e.g. used during .P file loading.
   * @param data The data to write.
   * @param dataOffset Offset into the data buffer.
   * @param size The number of bytes to write.
   */
  public writeMemoryData(data: Uint8Array, dataOffset: number, size: number) {
    // Write
    this.memory.set(data.slice(dataOffset, dataOffset + size));
  }

  /**
   * Reads a block of bytes.
   * @param startAddr64k The 64k start address
   * @param size The length of the data in bytes.
   * @returns The data as Uint8Array (a new array is returned.)
   */
  public readBlock(startAddr64k: number, size: number): Uint8Array {
    const data = new Uint8Array(size);
    data.set(this.memory.slice(startAddr64k, startAddr64k + size));
    return data;
  }

  /**
   * Writes a block of bytes.
   * @param startAddress The 64k start address.
   * @param data The block to write.
   */
  public writeBlock(startAddr64k: number, data: Uint8Array) {
    this.memory.set(data, startAddr64k);
  }
}
