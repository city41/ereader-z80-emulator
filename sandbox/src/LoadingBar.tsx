import clsx from "clsx";

type LoadingBarProps = {
  className?: string;
  percentage: number;
};

function LoadingBar({ className, percentage }: LoadingBarProps) {
  return (
    <div className={clsx(className, "rounded-xl border-4 border-white h-4")}>
      <div
        className="bg-green-400 h-full rounded-xl"
        style={{ width: `${percentage * 100}%` }}
      />
    </div>
  );
}

export { LoadingBar };
