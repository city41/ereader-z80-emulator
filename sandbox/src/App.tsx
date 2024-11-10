import { useEffect, useRef, useState } from "react";
import { EreaderEmulator } from "../../src/EreaderEmulator";

async function loadBinary(url: string): Promise<Uint8Array> {
  const result = await fetch(url);
  const data = await result.arrayBuffer();

  return new Uint8Array(data);
}

type EmulationState = "not-started" | "running" | "paused";

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

function Button(props: JSX.IntrinsicElements["button"]) {
  return <button {...props} className="border border-black p-2 m-2" />;
}

function App() {
  const [emulator, setEmulator] = useState<EreaderEmulator | null>(null);
  const [, setEmulationState] = useState<EmulationState>("not-started");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function onCanvas(canvas: HTMLCanvasElement) {
      const binData = await loadBinary("/main.bin");
      const emulator = new EreaderEmulator(binData, canvas);
      setEmulator(emulator);

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
    <div className="w-full sm:w-1/2 sm:mx-auto">
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
      <Button
        onClick={() => {
          emulator?.onKeyDown("up");
          setTimeout(() => {
            emulator?.onKeyUp("up");
          }, 20);
        }}
      >
        up
      </Button>
      <Button
        onClick={() => {
          emulator?.onKeyDown("down");
          setTimeout(() => {
            emulator?.onKeyUp("down");
          }, 20);
        }}
      >
        down
      </Button>
      <Button
        onClick={() => {
          emulator?.onKeyDown("left");
          setTimeout(() => {
            emulator?.onKeyUp("left");
          }, 20);
        }}
      >
        left
      </Button>
      <Button
        onClick={() => {
          emulator?.onKeyDown("right");
          setTimeout(() => {
            emulator?.onKeyUp("right");
          }, 20);
        }}
      >
        right
      </Button>
      <Button
        onClick={() => {
          emulator?.onKeyDown("b");
          setTimeout(() => {
            emulator?.onKeyUp("b");
          }, 20);
        }}
      >
        B
      </Button>
      <Button
        onClick={() => {
          emulator?.onKeyDown("a");
          setTimeout(() => {
            emulator?.onKeyUp("a");
          }, 20);
        }}
      >
        A
      </Button>
    </div>
  );
}

export default App;
