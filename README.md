# E-Reader Z80 Emulator

This is a web based emulator written in JavaScript and TypeScript for the Nintendo E-Reader.

It allows running E-Reader applications without using any of Nintendo's proprietary IP. The application runs completely outside of a GBA and an E-Reader, so there are no copyright or IP implications.

https://github.com/user-attachments/assets/6bdc089c-26b9-48d8-abc2-5a2e183d29ba

## Try it out

You can try the emulator playing Solitaire here: https://www.retrodotcards.com/solitaire/play

## Status: Pre Alpha

This is very raw, but coming along. It now plays Solitaire (see video above) almost perfectly.

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

emulator.run();
emulator.pause();
emulator.reset();
```

`run()` uses `requestAnimationFrame`, so it is not asychronous in the traditional sense. `pause()` and `reset()` can be called whenever.

### System Resources

By default the emulator has no system resources loaded, ie sound effects, music or backgrounds. It will still run, just silently and with nothing happening when `LoadSystemBackground` is called.

To change this, call `SoundManager.setSounds()` and `SystemBackgroundManager.setBackgrounds()`.

```
const mySoundEffect = await loadAudioFile('mysoundeffect.ogg');
SoundManager.setSounds({
  23: mySoundEffect
});
```

Where 23 is the sound's id. Ie the parameter passed to `PlaySystemSound`.

The resources directory contains creative common resources that can be used for this purpose.

The sandbox implementation uses these sounds and can be used as a guide [here](/blob/main/sandbox/src/Emulator.tsx#L65)

### Preloading

The first time tiles are created for a sprite or background can be very slow, especially if the sprite has a lot of frames and especially on mobile. This can be mitigated with `emulator.preload`.

```typescript
// the address in the rom where the sprite or bg is located
const addressofSpriteStruct = 0x1234;
const addressofBackgroundStruct = 0x4567;

await emulator.preload({
  sprites: [addressOfSpriteStruct],
  customBackgrounds: [addressOfBackgroundStruct],
});
```

`preload` returns a promise allowing throwing up a loading screen.

Once the sprites/bgs are preloaded, they will then run in the emulator at full speed.

## Sandbox

In `sandbox` is an implementation of the emulator. To use:

NOTE: the emulator is currently assuming you are running Solitaire.

1. `yarn install` at the root of the repo
2. Get a `.bin` file and place it at `sandbox/public/main.bin`
3. `yarn sandbox-dev`
4. visit `http://localhost:5173`

## Known Issues

- Much of ERAPI remains to be implemented
- `halt` frames happen much faster in the emulator compared to a real GBA.

# Development

## Publishing

ereader-z80-emulator uses [semantic versioning](https://semver.org/)

Publishing a new version is done by bumping the version in package.json

```bash
yarn version
yarn version v1.22.19
info Current version: 0.4.0
question New version: 0.4.1
info New version: 0.4.1
Done in 16.19s.

git push
git push --tags
```

Once [the Publish action](https://github.com/city41/ereader-z80-emulator/actions/workflows/publish.yml) notices the version has changed, it will run a build and publish to npm.
