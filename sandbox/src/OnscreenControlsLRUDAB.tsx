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
        className={clsx("absolute bg-slate-900 rounded-xl", {
          "-left-2 -top-2 -right-2 bottom-0": direction === "up",
          "-left-2 top-0 -right-2 -bottom-2": direction === "down",
          "-left-2 -top-2 right-0 -bottom-2": direction === "left",
          "left-0 -top-2 -right-2 -bottom-2": direction === "right",
        })}
      />
      <div
        className={clsx(
          "absolute top-0 left-0 right-0 bottom-0 bg-slate-700 grid place-items-center active:bg-slate-500 w-full h-full",
          {
            "rounded-t-lg": direction === "up",
            "rounded-l-lg": direction === "left",
            "rounded-r-lg": direction === "right",
            "rounded-b-lg": direction === "down",
          }
        )}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onKeyDown(direction);
        }}
        onMouseUp={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onKeyUp(direction);
        }}
        onMouseLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onKeyUp(direction);
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onKeyDown(direction);
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onKeyUp(direction);
        }}
        onTouchCancel={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onKeyUp(direction);
        }}
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
      className="bg-slate-700 rounded-full w-20 h-20 text-white grid place-items-center text-4xl select-none active:bg-slate-500 border-8 border-slate-900 transform rotate-12"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onKeyDown(button);
      }}
      onMouseUp={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onKeyUp(button);
      }}
      onMouseLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onKeyUp(button);
      }}
      onTouchStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onKeyDown(button);
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onKeyUp(button);
      }}
      onTouchCancel={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onKeyUp(button);
      }}
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
        "grid grid-cols-2 gap-x-4 mt-8 sm:rounded-xl pt-8 pb-4 -mx-4 sm:mx-0"
      )}
    >
      <div className="grid grid-cols-3 grid-rows-3 w-40 h-40 mx-auto relative">
        <div
          className="absolute -left-7 -top-7 -right-7 -bottom-7 rounded-full border-lime-700"
          style={{ borderWidth: 6 }}
        />
        <div />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="up" />
        <div />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="left" />
        <div className="bg-slate-700" />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="right" />
        <div />
        <DpadButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} direction="down" />
        <div />
      </div>
      <div className="relative grid grid-cols-2 place-items-center transform -rotate-12">
        <div
          className="absolute -left-2 top-4 -right-2 bottom-4 rounded-full border-lime-700"
          style={{ borderWidth: 6 }}
        />
        <ABButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} button="b" />
        <ABButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} button="a" />
      </div>
    </div>
  );
}

export { OnscreenControlsLRUDAB };
