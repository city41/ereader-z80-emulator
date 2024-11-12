import clsx from "clsx";

type DifferencesProps = {
  className?: string;
  onDismissed: () => void;
};

function Differences({ className, onDismissed }: DifferencesProps) {
  return (
    <div className={clsx(className, "w-full h-full")}>
      <div className="absolute left-0 top-0 right-0 bottom-0 bg-black opacity-50" />
      <div className="absolute left-4 top-16 right-4 bg-lime-600 flex flex-col items-center gap-y-4 p-4 rounded-xl sm:w-4/5 sm:mx-auto">
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
          className="p-4 border border-lime-800 bg-lime-400 text-lime-950 font-bold"
          onClick={onDismissed}
        >
          Okay
        </button>
      </div>
    </div>
  );
}

export { Differences };
