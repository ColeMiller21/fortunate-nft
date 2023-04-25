import { useEffect } from "react";
import { wagmiClient, chains } from "../utils/wallet/walletConfig";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { chain, WagmiConfig } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";

export default function App({ Component, pageProps }) {
  const appHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty("--app-height", `${window.innerHeight}px`);
  };

  useEffect(() => {
    window.addEventListener("resize", appHeight);
    appHeight();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={lightTheme()} coolMode>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
