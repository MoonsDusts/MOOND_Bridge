import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    bscTestnet: {
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY ?? ""],
      url: "https://bsc-testnet.publicnode.com",
      timeout: 60000000000,
    },
    bsc: {
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY ?? ""],
      url: "https://bsc-dataseed.binance.org/",
      timeout: 600000000000,
    },
    arbitrumNova: {
      chainId: 42170,
      accounts: [process.env.PRIVATE_KEY ?? ""],
      url: "https://nova.arbitrum.io/rpc",
      timeout: 600000000000,
    },
    arbitrumGoerli: {
      chainId: 421613,
      accounts: [process.env.PRIVATE_KEY ?? ""],
      url: "https://rpc.goerli.arbitrum.gateway.fm/",
      timeout: 600000000000,
    },
  },
  etherscan: {
    apiKey: {
      bscTestnet: process.env.BSC_API_KEY ?? "",
      bsc: process.env.BSC_API_KEY ?? "",
      arbitrumNova: process.env.ARBITRUM_NOVA_API_KEY ?? "",
      arbitrumGoerli: process.env.ARBITRUM_API_KEY ?? "",
    },
    customChains: [
      {
        network: "arbitrumNova",
        chainId: 42170,
        urls: {
          apiURL: "https://api-nova.arbiscan.io/api",
          browserURL: "https://nova.arbiscan.io",
        },
      },
    ],
  },
};

export default config;
