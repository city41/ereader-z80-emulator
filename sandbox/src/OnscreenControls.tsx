type OnscreenControlsProps = {
  onKeyDown: (key: string) => void;
  onKeyUp: (key: string) => void;
};

function OnscreenControls({ onKeyDown, onKeyUp }: OnscreenControlsProps) {
  return (
    <div className="grid grid-cols-2 mt-8">
      <div className="grid grid-cols-3 grid-rows-3 w-48 h-48 mx-auto">
        <div />
        <div
          className="bg-slate-800"
          onMouseDown={() => onKeyDown("up")}
          onMouseUp={() => onKeyUp("up")}
          onMouseLeave={() => onKeyUp("up")}
          onTouchStart={() => onKeyDown("up")}
          onTouchEnd={() => onKeyUp("up")}
          onTouchCancel={() => onKeyUp("up")}
        />
        <div />
        <div
          className="bg-slate-800"
          onMouseDown={() => onKeyDown("left")}
          onMouseUp={() => onKeyUp("left")}
          onMouseLeave={() => onKeyUp("left")}
          onTouchStart={() => onKeyDown("left")}
          onTouchEnd={() => onKeyUp("left")}
          onTouchCancel={() => onKeyUp("left")}
        />
        <div className="bg-slate-800" />
        <div
          className="bg-slate-800"
          onMouseDown={() => onKeyDown("right")}
          onMouseUp={() => onKeyUp("right")}
          onMouseLeave={() => onKeyUp("right")}
          onTouchStart={() => onKeyDown("right")}
          onTouchEnd={() => onKeyUp("right")}
          onTouchCancel={() => onKeyUp("right")}
        />
        <div />
        <div
          className="bg-slate-800"
          onMouseDown={() => onKeyDown("down")}
          onMouseUp={() => onKeyUp("down")}
          onMouseLeave={() => onKeyUp("down")}
          onTouchStart={() => onKeyDown("down")}
          onTouchEnd={() => onKeyUp("down")}
          onTouchCancel={() => onKeyUp("down")}
        />
        <div />
      </div>
      <div className="grid grid-cols-2 place-items-center">
        <div
          className="bg-slate-800 rounded-full w-20 h-20 sm:w-32 sm:h-32 text-white grid place-items-center text-4xl sm:text-6xl select-none"
          onMouseDown={() => onKeyDown("b")}
          onMouseUp={() => onKeyUp("b")}
          onMouseLeave={() => onKeyUp("b")}
          onTouchStart={() => onKeyDown("b")}
          onTouchEnd={() => onKeyUp("b")}
          onTouchCancel={() => onKeyUp("b")}
        >
          B
        </div>
        <div
          className="bg-slate-800 rounded-full w-20 h-20 sm:w-32 sm:h-32 text-white grid place-items-center text-4xl sm:text-6xl select-none"
          onMouseDown={() => onKeyDown("a")}
          onMouseUp={() => onKeyUp("a")}
          onMouseLeave={() => onKeyUp("a")}
          onTouchStart={() => onKeyDown("a")}
          onTouchEnd={() => onKeyUp("a")}
          onTouchCancel={() => onKeyUp("a")}
        >
          A
        </div>
      </div>
    </div>
  );
}

export { OnscreenControls };
