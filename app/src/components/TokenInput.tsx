import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { formatUnits } from "viem";

type TokenInputType = {
  side: "from" | "to";
  value: string;
  network: string;
  networkImage: string;
  balance?: bigint;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onMax?: () => void;
  className?: string;
};

const TokenInput: React.FC<TokenInputType> = ({
  side,
  network,
  networkImage,
  value,
  balance,
  onChange,
  onMax,
  className,
}) => {
  return (
    <div
      className={`w-full p-4 border border-[#f7f8fa] dark:border-[#2c2f36] rounded-[20px] ${
        className ?? ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="capitalize text-[#565a69] dark:text-[#c3c5cb] font-medium text-sm">
          {side}
        </div>
        <div className="text-[#565a69] dark:text-[#c3c5cb] font-medium text-sm">
          Balance:{" "}
          {balance === undefined
            ? "-"
            : parseFloat(formatUnits(balance, 18)).toLocaleString("en-US", {
                maximumFractionDigits: 4,
              })}
        </div>
      </div>
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center">
          <img
            src={networkImage}
            alt="network"
            className="w-[20px] h-[20px] mr-1"
          />
          <span className="text-sm font-medium text-[#565a69] dark:text-[#c3c5cb]">
            {network}
          </span>
        </div>
        <div className="flex items-center ml-2">
          <input
            type="text"
            placeholder="0.0"
            className="w-full text-right text-base bg-transparent border-none outline-none [&::-webkit-inner-spin-button]:hidden font-medium text-black dark:text-white"
            value={value}
            onChange={onChange ?? (() => {})}
            disabled={!onChange}
          />
          {onMax && (
            <button
              className="ml-1 text-sm font-medium text-[#3183ff] dark:text-[#1dfff1]"
              onClick={onMax}
            >
              MAX
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenInput;
