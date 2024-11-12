import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { EreaderEmulator } from "../../src/EreaderEmulator";
import { OnscreenControls } from "./OnscreenControls";
import frannybwPng from "./frannybw.png";
import { CardSwipe } from "./CardSwipe";

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
  const [swipeDone, setSwipeDone] = useState(false);
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

  console.log("emulationState", emulationState);

  return (
    <>
      <div
        className={clsx(
          "relative w-full h-full sm:w-1/2 sm:mx-auto shadow-2xl"
        )}
      >
        <CardSwipe
          className={clsx(
            "absolute w-full h-full top-0 left-0 bottom-0 right-0 z-10",
            {
              hidden: swipeDone && emulationState !== "preloading",
            }
          )}
          onSwipeDone={() => {
            setSwipeDone(true);
            if (emulationState === "ready-to-start") {
              emulator?.run();
            }
          }}
        />
        <div className="bg-orange-600 border-2 border-black border-b-orange-800 border-b-8 rounded-b-xl sm:rounded-xl overflow-hidden p-4">
          <div>
            <div
              className={clsx(
                "overflow-hidden border-8 border-b-0 border-black rounded-xl rounded-b-none overflow-none"
              )}
            >
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
                      emulator?.pause();
                      return "paused";
                    } else {
                      emulator?.run();
                      return "running";
                    }
                  });
                }}
              />
            </div>
            <div className="text-center w-full py-4 font-bold italic text-3xl text-slate-400 bg-black rounded-b-xl overflow-hidden flex flex-row items-center justify-center gap-x-4">
              GAME DOG
              <div className="grid place-items-center">
                <img
                  src={frannybwPng}
                  className="w-10 h-auto opacity-50"
                  style={{
                    imageRendering: "pixelated",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
            </div>
          </div>
          <OnscreenControls
            className="mt-24 mb-4 sm:mb-24"
            onKeyDown={(key) => {
              emulator?.onKeyDown(key);
            }}
            onKeyUp={(key) => {
              emulator?.onKeyUp(key);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
