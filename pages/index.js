import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import ConnectWalletButton from "../components/ConnectWalletButton";
import {
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import abi from "../public/data/abi.json";
const contract = "0x4019D203B34583b304496F0EB9e557E1B4788A7c";

export default function Home() {
  const [totalSupply, setTotalSupply] = useState();
  const [amountMinted, setAmountMinted] = useState();
  const [revealed, setRevealed] = useState(false);
  const handleMint = async () => {
    write?.();
  };

  const nftConfig = {
    address: contract,
    abi: abi,
  };

  const { data: readData } = useContractReads({
    contracts: [
      {
        ...nftConfig,
        functionName: "totalSupply",
        watch: true,
      },
      {
        ...nftConfig,
        functionName: "maxSupply",
      },
    ],
  });

  const { config } = usePrepareContractWrite({
    ...nftConfig,
    functionName: "mint",
    args: [],
    // enabled: Boolean(tokenId),
  });

  const { write, data } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    console.log({ readData });
    if (readData && readData.length > 0) {
      // setAmountMinted(ethers.utils.formatUnits(readData[0], 0));
      // setTotalSupply(ethers.utils.formatUnits(readData[1], 0));
    }
  }, [readData]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="Fortunate NFT is a free to mint project for the people who find themselves rekt in the crypto space. A world full of people who are only out to take advantage, this project is here to remind you that YOU ARE VALUABLE! Each piece comes with a special message to encourage you. Along with that, the metadata description is a letter to you, take a moment to read the attributes. You are all the things that your fortune says you are. I truly believe every owner was meant to receive their fortune and hopefully, you get just a brief moment of joy from it. "
        />
        <title>Fortunate NFT</title>
        <link rel="icon" href="/logo.png" type="image/x-icon" />
      </Head>
      <main
        className={`min-w-screen min-full-height flex flex-col items-center bg-[#6bc4d1] overflow-hidden`}
      >
        <header className="flex gap-[1rem] justify-center items-center w-full md:w-[50%]">
          <div className="relative min-h-[100px] lg:min-h-[250px] aspect-square bg-red-500">
            <Image
              src="/logo.png"
              alt="FORTUNE NFT LOGO"
              fill
              quality={100}
              priority
            />
          </div>
          <div className="h-full flex flex-col w-full">
            <h1 className="text-white font-brah text-[1.8rem] md:text-[5rem] whitespace-nowrap">
              Fortunate NFT
            </h1>
            <h3 className="text-[#ff0000] text-[1.2rem] md:text-[2.5rem] font-brah mt-[-10px] lg:mt-[-25px]">
              You deserve Good Fortune
            </h3>
          </div>
        </header>
        <div className="flex flex-col flex-grow justify-center items-center">
          <p className="text-white font-brah text-center my-[1.5rem] flex flex-col w-[90%] md:w-[65%] ">
            Fortunate NFT is a free to mint project for the people who find
            themselves rekt in the crypto space. A world full of people who are
            only out to take advantage, this project is here to remind you that
            YOU ARE VALUABLE! Each piece comes with a special message to
            encourage you. Along with that, the metadata description is a letter
            to you, take a moment to read the attributes. You are all the things
            that your fortune says you are. I truly believe every owner was
            meant to receive their fortune and hopefully, you get just a brief
            moment of joy from it. <span>Thanks! - Timecop</span>
          </p>
          <div className="flex flex-col justify-center items-center gap-[.5rem]">
            <span>{amountMinted && { amountMinted } / { totalSupply }}</span>
            <span className="font-brah text-[#ff0000] text-[1rem]">
              Max 1 per wallet
            </span>
          </div>
          <ConnectWalletButton loading={isLoading} onMint={handleMint} />
          <div>
            {!revealed ? (
              <span
                className="font-brah text-white cursor-pointer border-b-2 hover:border-b-4 transition-all duration-300 text-[1.25rem] border-[#ff0000] "
                onClick={() => {
                  setRevealed(true);
                }}
              >
                Reveal Your Fortune
              </span>
            ) : (
              <span className="font-brah text-white w-[90%]">
                This is your fortune -your fortune teller
              </span>
            )}
          </div>
        </div>
        <footer className="min-h-[100px] flex flex-col justify-center items-center text-white font-brah text-center px-4 gap-[.5rem] mt-[50px]">
          <span>
            Disclaimer: No discord, No twitter, No roadmap - Free Mint - Collect
            your fortune and may it come true
          </span>
          <span>
            Created by:{" "}
            <a
              href="https://twitter.com/b0nesFAFZ"
              target="_blank"
              className="cursor-pointer hover:text-[#ff0000]"
            >
              @b0nes
            </a>{" "}
            <a
              href="https://twitter.com/TimeCop0487"
              target="_blank"
              className="cursor-pointer hover:text-[#ff0000]"
            >
              @TimeCop
            </a>
          </span>
        </footer>
      </main>
    </>
  );
}
