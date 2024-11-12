import clsx from "clsx";

type DifferencesProps = {
  className?: string;
  onDismissed: () => void;
};

function Differences({ className, onDismissed }: DifferencesProps) {
  return (
    <div className={clsx(className, "w-full h-full")}>
      <div className="absolute left-0 top-0 right-0 bottom-0 bg-black opacity-50" />
      <div className="absolute left-4 top-16 right-4 bg-orange-600 flex flex-col items-center gap-y-4 p-4 rounded-xl sm:w-1/2 sm:mx-auto">
        <p>
          This is an E-Reader emulator, and it is playing the actual E-Reader
          Solitaire game.
        </p>
        <p>
          But the sound effects and the rocky background are a little different.
        </p>
        <p>
          That is because those sounds and graphics were made by Nintendo, so we
          can not legally use them on this website.
        </p>

        <button
          className="p-4 border border-orange-800 bg-orange-400 text-orange-950 font-bold"
          onClick={onDismissed}
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export { Differences };
