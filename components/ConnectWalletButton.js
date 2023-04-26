import React, { useState, useEffect } from "react";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import PacmanLoader from "react-spinners/PacmanLoader";

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
            className={`text-white text-[3rem] rounded-full w-[250px] font-brah flex justify-center items-center my-[10px]`}
            onClick={onMint}
          >
            {loading ? <PacmanLoader color="#ffffff" /> : "MINT"}
          </button>
        </div>
      ) : (
        <button
          aria-label="Connect Wallet Button"
          className={`text-white text-[2.5rem] rounded-full w-full  font-brah my-[10px]`}
          onClick={openConnectModal}
        >
          CONNECT WALLET
        </button>
      )}
    </>
  );
};

export default ConnectWalletButton;
