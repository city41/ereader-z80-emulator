import clsx from "clsx";
import styles from "./CardSwipe.module.css";
import { useState } from "react";
import { solitaireSvg } from "./solitaireCardSvg";
import { SoundManager } from "./SoundManager";
import { LoadingBar } from "./LoadingBar";

type CardSwipeProps = {
  className?: string;
  loadPercent: number;
  onSwipeDone: () => void;
};

function CardSwipe({ className, loadPercent, onSwipeDone }: CardSwipeProps) {
  const [swipeStarted, setSwipeStarted] = useState(false);

  return (
    <div
      className={clsx(className, "w-full h-full flex flex-col bg-slate-800")}
    >
      <div
        className=" text-white grid place-items-center h-2/3"
        onClick={loadPercent < 1 ? undefined : () => setSwipeStarted(true)}
      >
        {!swipeStarted && (
          <div className="flex flex-col gap-y-4">
            <div
              className={clsx("text-center text-3xl font-bold", {
                "cursor-pointer": loadPercent === 1,
              })}
            >
              {loadPercent < 1 ? "Just a moment..." : "Tap here to start"}
            </div>
            <LoadingBar percentage={loadPercent} />
          </div>
        )}
      </div>
      <div className="bg-slate-600 h-1/3" />

      <img
        className={clsx("absolute w-screen sm:w-full", {
          [styles.swipeAnimation]: swipeStarted,
          hidden: !swipeStarted,
        })}
        style={{ marginLeft: "-130%", bottom: "19%" }}
        src={solitaireSvg}
        onAnimationEnd={() => {
          SoundManager.playSound("swipeSuccess");
          setTimeout(onSwipeDone, 1200);
        }}
      />
      <div
        className="absolute bottom-0 sm:h-64 w-full border-t-black border-t-8 grid grid-rows-2"
        style={{ height: "25%" }}
      >
        <div className="w-full h-full bg-slate-600" />
        <div className="w-full h-full bg-slate-800" />
      </div>
    </div>
  );
}

export { CardSwipe };
