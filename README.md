# E-Reader Z80 Emulator

This is a web based emulator written in JavaScript and TypeScript for the Nintendo E-Reader.

It allows running E-Reader applications without using any of Nintendo's proprietary IP. The application runs completely outside of a GBA and an E-Reader, so there are no copyright or IP implications.

## Status: Pre Alpha

This is very raw and was just started at time of writing this.

Almost none of ERAPI is implemented, so almost no games will work. So far just `LoadCustomBackground`, `CreateSprite` and `SetSpritePos` are implemented, and not very well at that :)

## How to use

### Get a z80 bin

You will need the binary of a Nintendo z80 E-Reader app. This is not `.raw`, `.bmp` or `.vpk` files.

TODO: explain how to convert from `.raw` to `.bin`

### Create an emulator

```typescript
const result = await fetch("/url/To/The/Z80.bin");
const buffer = await result.arrayBuffer();
const data = new Uint8Array(buffer);

const emulator = new EreaderEmulator(data);

const canvas = document.getElementById("someCanvasOnAWebPage");
canvas.width = 240;
canvas.height = 160;

for (let i = 0; i < 100; ++i) {
  await emulator.frame(canvas);
}
```

## Sandbox

In `sandbox` is a simple implementation of the emulator. To use:

1. `yarn install` at the root of the repo
2. Get a `.bin` file and place it at `sandbox/public/main.bin`
3. `yarn sandbox-dev`
4. visit `http://localhost:5173`
