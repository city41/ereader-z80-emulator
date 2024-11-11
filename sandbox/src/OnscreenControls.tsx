import styles from "./OnscreenControls.module.css";

type OnscreenControlsProps = {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
};

type DpadButtonProps = {
  onKeyUp: OnscreenControlsProps["onKeyUp"];
  onKeyDown: OnscreenControlsProps["onKeyDown"];
  direction: "left" | "right" | "up" | "down";
};

type ABButtonProps = {
  onKeyUp: OnscreenControlsProps["onKeyUp"];
  onKeyDown: OnscreenControlsProps["onKeyDown"];
  button: "a" | "b";
};

function DpadButton({ onKeyDown, onKeyUp, direction }: DpadButtonProps) {
  return (
    <div
      className="bg-slate-800 grid place-items-center active:bg-slate-500"
      onMouseDown={() => onKeyDown(direction)}
      onMouseUp={() => onKeyUp(direction)}
      onMouseLeave={() => onKeyUp(direction)}
      onTouchStart={() => onKeyDown(direction)}
      onTouchEnd={() => onKeyUp(direction)}
      onTouchCancel={() => onKeyUp(direction)}
    >
      <div className={styles[direction]} />
    </div>
  );
}

function ABButton({ onKeyDown, onKeyUp, button }: ABButtonProps) {
  return (
    <div
      className="bg-slate-800 rounded-full w-20 h-20 sm:w-32 sm:h-32 text-white grid place-items-center text-4xl sm:text-6xl select-none active:bg-slate-500"
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

function OnscreenControls({ onKeyDown, onKeyUp }: OnscreenControlsProps) {
  return (
    <div className="grid grid-cols-2 mt-8">
      <div className="grid grid-cols-3 grid-rows-3 w-48 h-48 mx-auto">
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

export { OnscreenControls };
