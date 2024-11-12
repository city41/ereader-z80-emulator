import clsx from "clsx";
import styles from "./OnscreenControlsLRUDAB.module.css";

type OnscreenControlsLRUDABProps = {
  className?: string;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
};

type DpadButtonProps = {
  onKeyUp: OnscreenControlsLRUDABProps["onKeyUp"];
  onKeyDown: OnscreenControlsLRUDABProps["onKeyDown"];
  direction: "left" | "right" | "up" | "down";
};

type ABButtonProps = {
  onKeyUp: OnscreenControlsLRUDABProps["onKeyUp"];
  onKeyDown: OnscreenControlsLRUDABProps["onKeyDown"];
  button: "a" | "b";
};

function DpadButton({ onKeyDown, onKeyUp, direction }: DpadButtonProps) {
  return (
    <div className="relative w-full h-full">
      <div
        className={clsx("absolute bg-orange-700 rounded-xl", {
          "-left-2 -top-2 -right-2 bottom-0": direction === "up",
          "-left-2 top-0 -right-2 -bottom-2": direction === "down",
          "-left-2 -top-2 right-0 -bottom-2": direction === "left",
          "left-0 -top-2 -right-2 -bottom-2": direction === "right",
        })}
      />
      <div
        className={clsx(
          "absolute top-0 left-0 right-0 bottom-0 bg-slate-800 grid place-items-center active:bg-slate-500 w-full h-full",
          {
            "rounded-t-lg": direction === "up",
            "rounded-l-lg": direction === "left",
            "rounded-r-lg": direction === "right",
            "rounded-b-lg": direction === "down",
          }
        )}
        onMouseDown={() => onKeyDown(direction)}
        onMouseUp={() => onKeyUp(direction)}
        onMouseLeave={() => onKeyUp(direction)}
        onTouchStart={() => onKeyDown(direction)}
        onTouchEnd={() => onKeyUp(direction)}
        onTouchCancel={() => onKeyUp(direction)}
      >
        <div
          className={clsx(styles[direction], {
            "mb-4": direction === "up",
            "mr-4": direction === "left",
            "ml-4": direction === "right",
            "mt-4": direction === "down",
          })}
        />
      </div>
    </div>
  );
}

function ABButton({ onKeyDown, onKeyUp, button }: ABButtonProps) {
  return (
    <div
      className="bg-slate-800 rounded-full w-20 h-20 sm:w-32 sm:h-32 text-white grid place-items-center text-4xl sm:text-6xl select-none active:bg-slate-500 border-8 border-orange-700"
      onMouseDown={() => onKeyDown(button)}
      onMouseUp={() => onKeyUp(button)}
      onMouseLeave={() => onKeyUp(button)}
      onTouchStart={() => onKeyDown(button)}
      onTouchEnd={() => onKeyUp(button)}
      onTouchCancel={() => onKeyUp(button)}
    >
      {button.toUpperCase()}
    </div>
  );
}

function OnscreenControlsLRUDAB({
  className,
  onKeyDown,
  onKeyUp,
}: OnscreenControlsLRUDABProps) {
  return (
    <div
      className={clsx(
        className,
        "grid grid-cols-2 mt-8 xbg-orange-700 sm:rounded-xl pt-8 pb-4 -mx-4 sm:mx-0"
      )}
    >
      <div className="grid grid-cols-3 grid-rows-3 w-40 h-40 mx-auto">
        <div />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="up" />
        <div />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="left" />
        <div className="bg-slate-800" />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="right" />
        <div />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="down" />
        <div />
      </div>
      <div className="grid grid-cols-2 place-items-center">
        <ABButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} button="b" />
        <ABButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} button="a" />
      </div>
    </div>
  );
}

export { OnscreenControlsLRUDAB };
