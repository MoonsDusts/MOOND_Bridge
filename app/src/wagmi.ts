import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { bsc, arbitrumNova } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const walletConnectProjectId = "c63cb5ea3806fd4fc3ab0e40f96b9881";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bsc, arbitrumNova],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "MOOD_BRIDGE",
  chains,
  projectId: walletConnectProjectId,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
