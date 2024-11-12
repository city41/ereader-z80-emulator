import clsx from "clsx";
import solitaireCardSvg from "./solitaireCard.svg";
import styles from "./CardSwipe.module.css";
import { useState } from "react";
import { playSound } from "./sound";

type CardSwipeProps = {
  className?: string;
  onSwipeDone: () => void;
};

function CardSwipe({ className, onSwipeDone }: CardSwipeProps) {
  const [swipeStarted, setSwipeStarted] = useState(false);

  return (
    <div
      className={clsx(className, "w-full h-full grid grid-rows-6 bg-slate-800")}
    >
      <div
        className="row-span-4 text-white grid place-items-center"
        onClick={() => setSwipeStarted(true)}
      >
        {!swipeStarted && (
          <div className="text-center text-3xl font-bold cursor-pointer">
            Tap here to start
          </div>
        )}
      </div>
      <div className="row-start-5 bg-slate-600" />

      <img
        className={clsx("absolute bottom-32 w-screen sm:w-full", {
          [styles.swipeAnimation]: swipeStarted,
        })}
        style={{ marginLeft: "-150%" }}
        src={solitaireCardSvg}
        onAnimationEnd={() => {
          playSound("swipeSuccess");
          setTimeout(onSwipeDone, 1200);
        }}
      />
      <div className="absolute bottom-0 h-64 w-full border-t-black border-t-8 grid grid-rows-2">
        <div className="w-full h-full bg-slate-600" />
        <div className="w-full h-full bg-slate-800" />
      </div>
    </div>
  );
}

export { CardSwipe };
