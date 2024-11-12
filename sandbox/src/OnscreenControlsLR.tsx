import clsx from "clsx";

type OnscreenControlsLRProps = {
  className?: string;
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
};

type LRButtonProps = {
  className?: string;
  onKeyUp: OnscreenControlsLRProps["onKeyUp"];
  onKeyDown: OnscreenControlsLRProps["onKeyDown"];
  button: "l" | "r";
};

function LRButton({ className, onKeyDown, onKeyUp, button }: LRButtonProps) {
  return (
    <div
      className={clsx(
        className,
        "bg-slate-800 rounded-full w-20 h-12 sm:w-24 sm:h-14 text-white grid place-items-center text-2xl sm:text-4xl select-none active:bg-slate-500 border-8 border-orange-700",
        {
          "rounded-r-none border-r-0": button === "r",
          "rounded-l-none border-l-0": button === "l",
        }
      )}
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

function OnscreenControlsLR({
  className,
  onKeyDown,
  onKeyUp,
}: OnscreenControlsLRProps) {
  return (
    <div className={clsx(className, "flex flex-row justify-between")}>
      <LRButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} button="l" />
      <LRButton onKeyDown={onKeyDown} onKeyUp={onKeyUp} button="r" />
    </div>
  );
}

export { OnscreenControlsLR };
