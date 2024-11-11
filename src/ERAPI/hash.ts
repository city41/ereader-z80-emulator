import { createHash } from "sha256-uint8array";

function hash(data: number[]): string {
  const uint8Hash = createHash().update(Uint8Array.from(data)).digest();
  return Array.from(uint8Hash)
    .map((b) => String.fromCharCode(b))
    .join("");
}

export { hash };
