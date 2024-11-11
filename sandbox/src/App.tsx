import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { EreaderEmulator } from "../../src/EreaderEmulator";
import { OnscreenControls } from "./OnscreenControls";

async function loadBinary(url: string): Promise<Uint8Array> {
  const result = await fetch(url);
  const data = await result.arrayBuffer();

  return new Uint8Array(data);
}

type EmulationState = "ready-to-start" | "preloading" | "running" | "paused";

// this is assuming the sandbox is running solitaire
const DECK_SPRITE = 0x4766;
const PLAYFIELD_BG = 0x3a3e;

const keyMapping: Record<string, string> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowDown: "down",
  ArrowUp: "up",
  z: "b",
  x: "a",
  a: "l",
  s: "s",
  q: "select",
  w: "start",
};

function App() {
  const [emulator, setEmulator] = useState<EreaderEmulator | null>(null);
  const [emulationState, setEmulationState] =
    useState<EmulationState>("preloading");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function onCanvas(canvas: HTMLCanvasElement) {
      const binData = await loadBinary("/main.bin");
      const emulator = new EreaderEmulator(binData, canvas);
      setEmulator(emulator);

      emulator
        .preload({
          sprites: [DECK_SPRITE],
          customBackgrounds: [PLAYFIELD_BG],
        })
        .then(() => {
          setEmulationState("ready-to-start");
        });

      window.addEventListener("keydown", (e) => {
        const mappedKey = keyMapping[e.key];

        if (mappedKey) {
          e.preventDefault();
          emulator.onKeyDown(mappedKey);
        }
      });

      window.addEventListener("keyup", (e) => {
        const mappedKey = keyMapping[e.key];

        if (mappedKey) {
          e.preventDefault();
          emulator.onKeyUp(mappedKey);
        }
      });
    }

    if (canvasRef.current) {
      onCanvas(canvasRef.current);
    }
  }, []);

  return (
    <>
      <div className="w-full h-full sm:w-1/2 sm:mx-auto">
        <div
          className={clsx("border border-black", {
            relative:
              emulationState === "preloading" ||
              emulationState === "ready-to-start",
          })}
        >
          {(emulationState === "preloading" ||
            emulationState === "ready-to-start") && (
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none grid place-items-center text-2xl">
              <div>
                {emulationState === "preloading"
                  ? "Loading..."
                  : "Ready, tap here to start"}
              </div>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={240}
            height={160}
            style={{
              width: "100%",
              height: "auto",
              imageRendering: "pixelated",
            }}
            onClick={() => {
              setEmulationState((r) => {
                if (r === "running") {
                  emulator!.pause();
                  return "paused";
                } else {
                  emulator!.run();
                  return "running";
                }
              });
            }}
          />
        </div>
        <OnscreenControls
          onKeyDown={(key) => {
            emulator?.onKeyDown(key);
          }}
          onKeyUp={(key) => {
            emulator?.onKeyUp(key);
          }}
        />
      </div>
    </>
  );
}

export default App;
