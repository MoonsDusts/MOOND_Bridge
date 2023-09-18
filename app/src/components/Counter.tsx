import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ClockSVG from "./svg/Clock";

type CounterType = {
  left: number;
  setLeft: Dispatch<SetStateAction<number>>;
  start: bigint;
};

const Counter: React.FC<CounterType> = ({ left, setLeft, start }) => {
  let timerId = 0;

  useEffect(() => {
    const endTime = Number(start) + 30 * 24 * 3600;
    const curTime = Math.floor(Date.now() / 1000);

    setLeft(endTime - curTime);

    timerId = setInterval(
      () => setLeft((prev) => Math.max(prev - 1, 0)),
      1000
    ) as unknown as number;

    return () => {
      clearInterval(timerId);
    };
  }, [start]);

  const days = Math.floor(left / (24 * 3600));
  const hours = Math.floor((left % (24 * 3600)) / 3600);
  const minutes = Math.floor((left % 3600) / 60);
  const seconds = Math.floor(left % 60);

  return (
    <div className="flex justify-end items-center text-sm mt-4 pr-2 font-medium text-black dark:text-white">
      <ClockSVG />
      <span className="mx-1">Time Left:</span>
      <span className="ml-1">
        {start === 0n
          ? "Not Started Yet"
          : `${days} ${hours.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
            })}:${minutes.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
            })}:${seconds.toLocaleString("en-US", {
              minimumIntegerDigits: 2,
            })}`}
      </span>
    </div>
  );
};

export default Counter;
