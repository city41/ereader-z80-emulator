import { createRoot } from "react-dom/client";
import { Emulator } from "./Emulator.tsx";
import "./global.css";

createRoot(document.getElementById("root")!).render(<Emulator />);
