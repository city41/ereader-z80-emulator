import { useEffect, useRef, useState } from "react";
import { EreaderEmulator } from "../../EreaderEmulator";

async function loadBinary(url: string): Promise<Uint8Array> {
  const result = await fetch(url);
  const data = await result.arrayBuffer();

  return new Uint8Array(data);
}

function App() {
  const [emulator, setEmulator] = useState<EreaderEmulator | null>(null);
  const [running, setRunning] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function onCanvas(canvas: HTMLCanvasElement) {
      const binData = await loadBinary("/main.bin");
      const emulator = new EreaderEmulator(binData, canvas);
      emulator.run();
      setEmulator(emulator);
    }

    if (canvasRef.current) {
      onCanvas(canvasRef.current);
    }
  }, []);

  return (
    <div style={{ width: "50%" }}>
      <canvas
        ref={canvasRef}
        width={240}
        height={160}
        style={{
          width: "100%",
          height: "auto",
          imageRendering: "pixelated",
        }}
      />
      <button
        onClick={() => {
          setRunning((r) => {
            if (r) {
              emulator!.pause();
            } else {
              emulator!.run();
            }
            return !r;
          });
        }}
      >
        {running ? "pause" : "resume"}
      </button>
    </div>
  );
}

export default App;
