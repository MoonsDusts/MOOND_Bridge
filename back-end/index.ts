import {
  createPublicClient,
  createWalletClient,
  http,
  getEventSelector,
  decodeAbiParameters,
  Log,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { bsc, arbitrumNova } from "viem/chains";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import dotenv from "dotenv";
import axios from "axios";

import BridgeABI from "./contracts/Bridge.js";
import TokenABI from "./contracts/Token.js";
import { BRIDGE_ADDR, DEST_TOKEN_ADDR } from "./contracts/index.js";

type Bridges = {
  origin: `0x${string}`[];
  dest: `0x${string}`;
}[];

const adapter = new JSONFile<Bridges>("db.json");
const db = new Low<Bridges>(adapter, []);

dotenv.config();

const account = privateKeyToAccount(
  (process.env.PRIVATE_KEY ?? "") as `0x${string}`
);

const bscPublicClient = createPublicClient({
  chain: bsc,
  transport: http(bsc.rpcUrls.default.http[0]),
});

const arbPublicClient = createPublicClient({
  chain: arbitrumNova,
  transport: http(arbitrumNova.rpcUrls.default.http[0]),
});

const arbWalletClient = createWalletClient({
  chain: arbitrumNova,
  account,
  transport: http(arbitrumNova.rpcUrls.default.http[0]),
});

const getLogs = async () => {
  try {
    const res = await axios.post(
      "https://api.thegraph.com/subgraphs/name/sunlightluck/moond-bridge",
      {
        query: `{
          bridgeInitializeds(orderBy: blockTimestamp, orderDirection: desc) {
            amount
            sender
            transactionHash
            blockTimestamp
          }
        }`,
      }
    );
    return res.data.data.bridgeInitializeds;
  } catch (err) {
    console.log(err);
  }
};

const main = async () => {
  console.log("--------------start-----------------");
  bscPublicClient.watchContractEvent({
    abi: BridgeABI,
    address: BRIDGE_ADDR[bsc.id] as `0x${string}`,
    eventName: "BridgeInitialized",
    pollingInterval: 10000,
    onLogs: async (logs) => {
      await db.read();

      const latestTx = db.data[db.data.length - 1]?.origin;
      const allLogs = await getLogs();

      const data = logs.filter(
        (log) =>
          log.topics?.[0]?.toLowerCase() ===
          getEventSelector("BridgeInitialized(address,uint256)")
      );

      console.log(data);

      if (data.length === 0) return;

      const filterId = allLogs?.findIndex((log: any) =>
        latestTx?.find(
          (tx) => tx.toLowerCase() === log?.transactionHash?.toLowerCase()
        )
      );

      const filterLogs = allLogs
        ?.slice(0, filterId === -1 ? undefined : filterId)
        ?.filter(
          (log: any) =>
            data.find(
              (tx) =>
                tx.transactionHash?.toLowerCase() ===
                log.transactionHash.toLowerCase()
            ) === undefined
        );

      console.log(filterLogs);

      try {
        const senders = [
          ...filterLogs.map((log: any) => log.sender),
          ...data.map(
            (log) =>
              decodeAbiParameters(
                [{ type: "address" }],
                log.topics?.[1] ?? "0x"
              )[0]
          ),
        ];
        const amounts = [
          ...filterLogs.map((log: any) => BigInt(log.amount ?? 0)),
          ...data.map(
            (log) =>
              decodeAbiParameters(
                [{ type: "uint256" }],
                log.topics?.[2] ?? "0x"
              )[0]
          ),
        ];
        const txs = [
          ...filterLogs.map((log: any) => log.transactionHash),
          ...data.map((log) => log.transactionHash ?? "0x"),
        ];
        const { request } = await arbPublicClient.simulateContract({
          account: arbWalletClient.account,
          abi: TokenABI,
          address: DEST_TOKEN_ADDR[arbitrumNova.id] as `0x${string}`,
          functionName: "mint",
          args: [senders, amounts],
        });
        const tx = await arbWalletClient.writeContract(request);
        const res = await arbPublicClient.waitForTransactionReceipt({
          hash: tx,
        });
        console.log(tx);
        db.data = [...db.data, { origin: txs, dest: tx }];
        await db.write();
      } catch (err) {
        console.log(err);
      }
    },
  });
};

main();
