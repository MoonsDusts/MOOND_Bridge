import { useEffect, useState } from "react";
import {
  Address,
  useAccount,
  useBalance,
  useNetwork,
  useSwitchNetwork,
  usePublicClient,
  useWalletClient,
  useContractRead,
  erc20ABI,
} from "wagmi";
import { arbitrumGoerli, bsc, bscTestnet } from "viem/chains";
import { BaseError, formatUnits, parseUnits } from "viem";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-hot-toast";
import { Decimal } from "decimal.js-light";

import { BRIDGE_ADDR, DEST_TOKEN_ADDR, ORIGIN_TOKEN_ADDR } from "../contracts";
import DownSVG from "./svg/Down";
import TokenABI from "../contracts/Token.json";
import BridgeABI from "../contracts/Bridge.json";
import SpinnerSVG from "./svg/Spinner";
import TokenInput from "./TokenInput";
import BSC from "../assets/BSC.png";
import NOVA from "../assets/NOVA.png";
import Counter from "./Counter";
import MOOND from "../assets/MOOND.png";

const BridgeCard = () => {
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { data: bscBalance } = useBalance({
    token: ORIGIN_TOKEN_ADDR[bscTestnet.id] as Address,
    address: address,
    chainId: bscTestnet.id,
    watch: true,
  });
  const { data: novaBalance } = useBalance({
    token: DEST_TOKEN_ADDR[arbitrumGoerli.id] as Address,
    address: address,
    chainId: arbitrumGoerli.id,
    watch: true,
  });
  const { data: startTime } = useContractRead({
    address: BRIDGE_ADDR[bscTestnet.id] as Address,
    chainId: bscTestnet.id,
    abi: BridgeABI,
    functionName: "startTimestamp",
  });
  const { data: allowance } = useContractRead({
    address: ORIGIN_TOKEN_ADDR[bscTestnet.id] as Address,
    abi: TokenABI,
    functionName: "allowance",
    args: [address, BRIDGE_ADDR[bscTestnet.id]],
    watch: true,
  });
  const publicClient = usePublicClient({ chainId: bscTestnet.id });
  const { data: walletClient } = useWalletClient({ chainId: bscTestnet.id });
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [left, setLeft] = useState(0);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^([.]\d*|\d*([.]\d*)?)$/.test(e.target.value)) {
      const decimalLength = e.target.value.split(".")?.[1]?.length ?? 0;
      setValue(
        e.target.value.length === 0
          ? ""
          : decimalLength < 6
          ? e.target.value
          : new Decimal(parseFloat(e.target.value))
              .toDecimalPlaces(6, Decimal.ROUND_DOWN)
              .toString()
      );
    }
  };

  const onMax = () => {
    console.log(bscBalance);
    setValue(
      new Decimal(parseFloat(formatUnits(bscBalance?.value ?? 0n, 18)))
        .toDecimalPlaces(6, Decimal.ROUND_DOWN)
        .toString()
    );
  };

  const onApprove = async () => {
    if (address && walletClient) {
      if (chain?.id !== bscTestnet.id) {
        await switchNetworkAsync?.(bscTestnet.id);
      }
      setLoading(true);
      try {
        if (parseFloat(value) < 1) {
          toast.error("Should be at least 1");
          setLoading(false);
          return;
        }

        const { request } = await publicClient.simulateContract({
          account: address,
          address: ORIGIN_TOKEN_ADDR[bscTestnet.id] as Address,
          abi: TokenABI,
          functionName: "approve",
          args: [BRIDGE_ADDR[bscTestnet.id], amount],
        });

        const allowTx = await walletClient.writeContract(request);

        await publicClient.waitForTransactionReceipt({ hash: allowTx });

        toast.success("Approved successfully");
      } catch (err) {
        console.log(err);
        toast.error(
          err instanceof BaseError ? err.shortMessage : JSON.stringify(err)
        );
      }
    } else {
      openConnectModal?.();
    }
    setLoading(false);
  };

  const onBridge = async () => {
    if (address && walletClient) {
      if (chain?.id !== bscTestnet.id) {
        await switchNetworkAsync?.(bscTestnet.id);
      }
      setLoading(true);
      try {
        if (parseFloat(value) < 1) {
          toast.error("Should be at least 1");
          setLoading(false);
          return;
        }

        const { request } = await publicClient.simulateContract({
          account: address,
          address: BRIDGE_ADDR[bscTestnet.id] as Address,
          abi: BridgeABI,
          functionName: "bridge",
          args: [amount],
        });

        const bridgeTx = await walletClient.writeContract(request);

        await publicClient.waitForTransactionReceipt({ hash: bridgeTx });
        toast.success("Sent transaction successfully");
      } catch (err) {
        console.log(err);
        toast.error(
          err instanceof BaseError ? err.shortMessage : JSON.stringify(err)
        );
      }
    } else {
      openConnectModal?.();
    }
    setLoading(false);
  };

  const amount = parseUnits(value as `${number}`, 18);

  const insufficientIssue = bscBalance?.formatted
    ? parseFloat(bscBalance.formatted) < parseFloat(value)
    : false;

  const empytIssue = value.length === 0 || parseFloat(value) === 0;

  const approve = address && (allowance as bigint) < amount;

  return (
    <div className="bg-white dark:bg-[#212429] shadow-[#00000003_0_0_1px,#0000000a_0_4px_8px,#0000000a_0_16px_24px,#00000003_0_24px_32px] rounded-[30px] p-4 w-11/12 max-w-[420px] min-w-[320px]">
      <div className="flex items-center font-medium text-black dark:text-white pl-1">
        Bridge MOOND <img src={MOOND} alt="moond" className="w-[24px] ml-1" />
      </div>
      <TokenInput
        side="from"
        network="BSC"
        balance={bscBalance?.value}
        networkImage={BSC}
        value={value}
        onChange={onChange}
        onMax={onMax}
        className="mt-4"
      />
      <div className="flex justify-center my-4 text-[#565A69]">
        <DownSVG />
      </div>
      <TokenInput
        side="to"
        network="NOVA"
        balance={novaBalance?.value}
        networkImage={NOVA}
        value={value}
        className="mt-2"
      />
      <Counter left={left} setLeft={setLeft} start={startTime as bigint} />
      <button
        className="bg-[#00aee9] text-white py-[18px] rounded-[20px] w-full font-medium mt-4 disabled:bg-[#edeef2] disabled:text-[#888d9b] dark:disabled:bg-[#40444f] dark:disabled:text-[#6c7284] flex justify-center"
        onClick={approve ? onApprove : onBridge}
        disabled={
          (address && insufficientIssue) ||
          (address && empytIssue) ||
          loading ||
          left === 0
        }
      >
        {left === 0 && (startTime as bigint) > 0n ? (
          "FINISHED"
        ) : loading ? (
          <SpinnerSVG />
        ) : address ? (
          insufficientIssue ? (
            "INSUFFICIENT BALANCE"
          ) : empytIssue ? (
            "ENTER AMOUNT"
          ) : approve ? (
            "APPROVE"
          ) : (
            "BRIDGE"
          )
        ) : (
          "CONNECT WALLET"
        )}
      </button>
    </div>
  );
};

export default BridgeCard;
