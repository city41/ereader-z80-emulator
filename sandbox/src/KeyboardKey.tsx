import clsx from "clsx";
import { ReactNode } from "react";

type KeyboardKeyProps = {
  className?: string;
  children: ReactNode;
};

function KeyboardKey({ className, children }: KeyboardKeyProps) {
  return (
    <kbd
      style={{ minWidth: "2rem" }}
      className={clsx(
        className,
        "inline-block text-center p-1 rounded-lg bg-lime-200 text-lime-900 font-mono font-bold border-b-2 border-lime-700"
      )}
    >
      {children}
    </kbd>
  );
}

export { KeyboardKey };
