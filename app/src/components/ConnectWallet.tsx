import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { Address, useAccount, useBalance } from "wagmi";
import { ORIGIN_TOKEN_ADDR } from "../contracts";
import { bscTestnet } from "viem/chains";
import BSC from "../assets/BSC.png";

const ConnectWallet = () => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();
  const { data: balance } = useBalance({
    token: ORIGIN_TOKEN_ADDR[bscTestnet.id] as Address,
    chainId: bscTestnet.id,
    address,
    watch: true,
  });

  const onConnect = () => {
    if (!address) openConnectModal?.();
    else openAccountModal?.();
  };

  return !address ? (
    <button
      className="bg-[#d9f4fd] dark:bg-[#153d6f70] text-[#00aee9] dark:text-[#6da8ff] font-semibold rounded-xl border border-[#d9f4fd] dark:border-[#153d6f70] py-2 px-3 hover:border-[#a3e5fc] hover:text-[#009bd0] dark:hover:border-[#315f9a70] dark:hover:text-[#5399ff] transition-all focus:shadow-[#bcecfd_0px_0px_0px_1pt] dark:focus:shadow-[#376bad70_0_0_0_1pt]"
      onClick={onConnect}
    >
      Connect Wallet
    </button>
  ) : (
    <div
      className="flex items-center bg-[#edeef2] dark:bg-[#40444f] text-black dark:text-white rounded-xl whitespace-nowrap cursor-pointer transition-all"
      onClick={onConnect}
    >
      <div className="font-medium pl-3 pr-2 flex items-center max-md:hidden">
        <img src={BSC} alt="bsc" className="w-[20px] h-[20px] mr-1" />
        {parseFloat(balance?.formatted ?? "0").toLocaleString("en-US", {
          maximumFractionDigits: 4,
        })}{" "}
        {balance?.symbol}
      </div>
      <button className="text-center outline-none py-2 px-2.5 rounded-xl bg-[#f7f8fa] dark:bg-[#2c2f36] border border-[#edeef2] dark:border-[#40444f] font-medium hover:border-[#00c5eb] dark:hover:border-[#4d8fea] focus:border-[#cfd2dd] focus:shadow-[#bcecfd_0_0_0_1pt] dark:focus:shadow-[#376bad70_0_0_0_1pt] transition-all">
        {address.slice(0, 6) + "..." + address.slice(-4)}
      </button>
    </div>
  );
};

export default ConnectWallet;
