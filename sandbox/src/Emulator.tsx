import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { EreaderEmulator } from "../../src/EreaderEmulator";
import { OnscreenControlsLRUDAB } from "./OnscreenControlsLRUDAB";
import frannybwPng from "./frannybw.png";
import { CardSwipe } from "./CardSwipe";
import { OnscreenControlsLR } from "./OnscreenControlsLR";
import { Differences } from "./Differences";
import { KeyboardControls } from "./KeyboardControls";
import { Hinge } from "./Hinge";

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

function Emulator() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [swipeDone, setSwipeDone] = useState(false);
  const [emulator, setEmulator] = useState<EreaderEmulator | null>(null);
  const [emulationState, setEmulationState] =
    useState<EmulationState>("preloading");
  const [showDifferences, setShowDifferences] = useState(false);
  const [showKeyboardControls, setShowKeyboardControls] = useState(false);

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
      <div
        className={clsx(
          "relative w-full xh-full sm:mx-auto drop-shadow-lg mt-0 sm:mt-6"
        )}
        style={{ maxWidth: 480 }}
      >
        {showDifferences && (
          <Differences
            className="absolute left-0 top-0 right-0 bottom-0 z-20"
            onDismissed={() => {
              setShowDifferences(false);
            }}
          />
        )}
        {showKeyboardControls && (
          <KeyboardControls
            className="absolute left-0 top-0 right-0 bottom-0 z-20"
            onDismissed={() => {
              setShowKeyboardControls(false);
            }}
          />
        )}
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
        <div className="overflow-hidden px-4">
          <div className="rounded-xl overflow-hidden bg-lime-600 -mx-4 p-4">
            <div>
              <OnscreenControlsLR
                className="-mx-4 pb-2"
                onKeyDown={(key) => {
                  emulator?.onKeyDown(key);
                }}
                onKeyUp={(key) => {
                  emulator?.onKeyUp(key);
                }}
              />
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
              <div className="text-center w-full py-1 font-bold italic text-2xl text-slate-400 bg-black rounded-b-xl overflow-hidden flex flex-row items-center justify-center gap-x-4 mb-4">
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
          </div>
          <div className="rounded-xl overflow-hidden bg-lime-600 -mx-4 px-4">
            <Hinge className="-mx-4" />
            <OnscreenControlsLRUDAB
              className="mt-24 mb-4 sm:mb-24"
              onKeyDown={(key) => {
                emulator?.onKeyDown(key);
              }}
              onKeyUp={(key) => {
                emulator?.onKeyUp(key);
              }}
            />
            <div className="flex flex-row justify-between sm:justify-around pb-4 invisible">
              <a
                className="text-white underline text-xl sm:text-base w-2/5 sm:w-auto invisible xsm:visible cursor-pointer"
                onClick={() => setShowKeyboardControls(true)}
              >
                keyboard controls
              </a>
              <a
                className="text-white underline text-xl sm:text-base w-2/5 sm:w-auto cursor-pointer"
                onClick={() => setShowDifferences(true)}
              >
                This version is a little different...
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { Emulator };
