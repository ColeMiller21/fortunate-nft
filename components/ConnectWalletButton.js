import React, { useState, useEffect } from "react";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const ConnectWalletButton = ({ onMint, loading }) => {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  return (
    <>
      {isConnected ? (
        <div className="flex flex-col items-center justify-center gap-[.8rem]">
          <ConnectButton />
          <button
            aria-label="Mint Button"
            className={`text-white text-[3rem] rounded-full w-[250px] font-brah`}
            onClick={onMint}
          >
            {loading ? "MINT" : "MINTING"}
          </button>
        </div>
      ) : (
        <button
          aria-label="Connect Wallet Button"
          className={`text-white text-[2.5rem] rounded-full w-full  font-brah`}
          onClick={openConnectModal}
        >
          CONNECT WALLET
        </button>
      )}
    </>
  );
};

export default ConnectWalletButton;
