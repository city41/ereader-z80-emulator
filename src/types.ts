export type Z80State = {
  b: number;
  a: number;
  c: number;
  d: number;
  e: number;
  h: number;
  l: number;
  a_prime: number;
  b_prime: number;
  c_prime: number;
  d_prime: number;
  e_prime: number;
  h_prime: number;
  l_prime: number;
  ix: number;
  iy: number;
  i: number;
  r: number;
  sp: number;
  pc: number;
  flags: {
    S: number;
    Z: number;
    Y: number;
    H: number;
    X: number;
    P: number;
    N: number;
    C: number;
  };
  flags_prime: {
    S: number;
    Z: number;
    Y: number;
    H: number;
    X: number;
    P: number;
    N: number;
    C: number;
  };
  imode: number;
  iff1: number;
  iff2: number;
  halted: boolean;
};

export interface Z80Core {
  mem_read(address: number): number;
  mem_write(address: number, val: number): void;
  io_read(address: number): number;
  io_write(address: number, val: number): void;
  onRst0(state: Z80State): Z80State;
  onRst8(state: Z80State): Z80State;
}
