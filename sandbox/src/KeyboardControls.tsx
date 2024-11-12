import clsx from "clsx";
import { KeyboardKey } from "./KeyboardKey";
import {
  FaArrowUp,
  FaArrowDown,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

type DifferencesProps = {
  className?: string;
  onDismissed: () => void;
};

function KeyboardControls({ className, onDismissed }: DifferencesProps) {
  return (
    <div className={clsx(className, "w-full h-full")}>
      <div className="absolute left-0 top-0 right-0 bottom-0 bg-black opacity-50" />
      <div className="absolute left-4 top-16 right-4 bg-lime-600 flex flex-col items-center gap-y-4 p-4 rounded-xl sm:w-4/5 sm:mx-auto">
        <dl className="grid grid-cols-2 space-y-3 gap-x-8">
          <dt className="place-self-end">
            <KeyboardKey className="text-3xl">
              <FaArrowUp />
            </KeyboardKey>
            <KeyboardKey className="text-3xl">
              <FaArrowDown />
            </KeyboardKey>
            <KeyboardKey className="text-3xl">
              <FaArrowLeft />
            </KeyboardKey>
            <KeyboardKey className="text-3xl">
              <FaArrowRight />
            </KeyboardKey>
          </dt>
          <dd>Move the cursor</dd>
          <dt className="place-self-end">
            <KeyboardKey className="text-3xl">X</KeyboardKey>
          </dt>
          <dd>A button: Grab/Drop a card</dd>
          <dt className="place-self-end">
            <KeyboardKey className="text-3xl">Z</KeyboardKey>
          </dt>
          <dd>B button: Cancel grab/go to deck</dd>
          <dt className="place-self-end">
            <KeyboardKey className="text-3xl">S</KeyboardKey>
          </dt>
          <dd>R button: hold to restart</dd>
        </dl>

        <button
          className="mt-8 mb-4 p-4 border border-lime-800 bg-lime-400 text-lime-950 font-bold"
          onClick={onDismissed}
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export { KeyboardControls };
