import clsx from "clsx";

type HingeProps = {
  className?: string;
};

function Hinge({ className }: HingeProps) {
  return (
    <div className={clsx(className, "grid grid-cols-12 h-10")}>
      <div className="border-4 border-lime-700 rounded-l-xl" />
      <div className="border-4 border-lime-700 col-span-5" />
      <div className="border-4 border-lime-700 col-span-4" />
      <div className="border-4 border-lime-700" />
      <div className="border-4 border-lime-700 rounded-r-xl" />
    </div>
  );
}

export { Hinge };
