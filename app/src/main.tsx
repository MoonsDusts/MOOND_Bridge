import "./style.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { Toaster } from "react-hot-toast";

import { App } from "./App";
import { chains, config } from "./wagmi";
import { ThemeModeProvider } from "./hooks/useThemeMode";
import Layout from "./layout";
import WrongNetworkModal from "./components/WrongNetworkModal";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <ThemeModeProvider>
          <Layout>
            <App />
            <WrongNetworkModal />
          </Layout>
        </ThemeModeProvider>
      </RainbowKitProvider>
      <Toaster />
    </WagmiConfig>
  </React.StrictMode>
);
