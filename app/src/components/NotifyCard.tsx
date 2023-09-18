import { useState } from "react";
import CloseSVG from "./svg/Close";

const NotifyCard = () => {
  const [close, setClose] = useState(false);
  return (
    !close && (
      <div className="bg-[#ddfef0] border-2 border-[#7eb09b] text-[#338639] dark:bg-[#5fa365] dark:border-[#2b5e48] dark:text-[#f8f8f8] rounded-[30px] pt-8 p-4 w-11/12 max-w-[420px] min-w-[320px] text-xs relative">
        <button
          className="absolute top-4 right-4"
          onClick={() => setClose(true)}
        >
          <CloseSVG />
        </button>
        We are migrating MoonsDust from Binance Smart Chain (BSC) to Arbitrum
        Nova.
        <br />
        The bridge will close in 30 days. Please bridge your MOOND before the
        deadline, you won’t be able to bridge once the bridge is closed.
        Unbridged tokens will be worthless once the bridge is closed.
      </div>
    )
  );
};

export default NotifyCard;
