import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
// import ConnectWalletButton from "../components/ConnectWalletButton";
import {
  useContractRead,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useAccount,
  useContract,
} from "wagmi";
import { ethers } from "ethers";
import abi from "../public/data/abi.json";
const contract = "0x00a8943B529AbE0D4df5a834ADE1D90B87b9572D";
import dynamic from "next/dynamic";
import axios from "axios";

const ConnectWalletButton = dynamic(
  () => import("../components/ConnectWalletButton"),
  { ssr: false }
);

const nftConfig = {
  address: contract,
  abi: abi,
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [totalSupply, setTotalSupply] = useState(null);
  const [amountMinted, setAmountMinted] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [mintedToken, setMintedToken] = useState(null);
  const [fortuneLoading, setFortuneLoading] = useState(false);
  const [fortune, setFortune] = useState(null);
  const [fortuneImg, setFortuneImg] = useState(null);
  const [notFafzListed, setNotFafzListed] = useState(false);

  const handleMint = async () => {
    try {
      mint?.();
    } catch (err) {
      console.log(err);
    }
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
      {
        ...nftConfig,
        functionName: "tokenOfOwner",
        args: [address],
      },
      {
        ...nftConfig,
        functionName: "isFafzlisted",
        args: [address],
      },
      {
        ...nftConfig,
        functionName: "fafzMintEnabled",
      },
    ],
  });

  const getFortune = async (tokenId) => {
    if (!tokenId) return;
    setFortuneLoading(true);
    let uri = `https://fafz.mypinata.cloud/ipfs/QmUAKhgkca4KNmURB6kUcxsvBc5pdwH9W1zvE6ms8Vw9Js/${tokenId}.json`;
    try {
      let { data } = await axios.get(uri);
      let atts = data.attributes;
      setFortuneImg(data.image);
      for (const a of atts) {
        if (a.trait_type === "Quote") {
          setFortune(a.value);
        }
      }
      setFortuneLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const { config: publicFAFZConfig } = usePrepareContractWrite({
    ...nftConfig,
    functionName: "mint",
  });

  const {
    write: mint,
    data: publicFAFZData,
    error,
  } = useContractWrite(publicFAFZConfig);

  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash: publicFAFZData?.hash,
  });

  useEffect(() => {
    if (!Array.isArray(readData)) return;
    let [
      mintedAmount,
      maxSupply,
      tokensOfOwner,
      isFafzListed,
      fafzMintEnabled,
    ] = readData;
    console.log({ isFafzListed, fafzMintEnabled });
    if (readData && readData.length > 0) {
      if (fafzMintEnabled && !isFafzListed) {
        setNotFafzListed(true);
      }
      setAmountMinted(ethers.utils.formatUnits(mintedAmount, 0));
      setTotalSupply(ethers.utils.formatUnits(maxSupply, 0));
      tokensOfOwner && tokensOfOwner.length > 0
        ? setMintedToken(ethers.utils.formatUnits(tokensOfOwner[0], 0))
        : setMintedToken(null);
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
            <span className="font-brah text-[#ff0000] text-[1.5rem]">
              {amountMinted}
              <span className="text-white"> / </span>
              {totalSupply}
            </span>
            <span className="font-brah text-[#ff0000] text-[1rem]">
              Max 1 per wallet
            </span>
            <span className="text-white font-brah w-[90%] text-center">
              This is a whitelist only mint. If you cannot mint you will need to
              reach out to TimeCop to get put on the list. Link in footer!
            </span>
          </div>
          <div>
            {isConnected && mintedToken ? (
              <span className="font-brah text-white text-[2rem] text-center">
                Already minted with this wallet
              </span>
            ) : (
              <ConnectWalletButton loading={isLoading} onMint={handleMint} />
            )}
            {isSuccess && (
              <span className="font-brah text-white">
                Successfully Minted Token!
              </span>
            )}
            {isError && (
              <span className="font-brah text-[#ff0000]">{error}</span>
            )}
          </div>
          {mintedToken && (
            <div className="w-full flex justify-center">
              {!revealed ? (
                <span
                  className="font-brah text-white cursor-pointer border-b-2 hover:border-b-4 transition-all duration-300 text-[1.25rem] border-[#ff0000] "
                  onClick={async () => {
                    setRevealed(true);
                    await getFortune(mintedToken);
                  }}
                >
                  Reveal Your Fortune
                </span>
              ) : (
                <span className="font-brah text-[#ff0000] w-[90%] text-center text-[1.5rem] flex flex-col items-center justify-center gap-[.5rem]">
                  <img
                    src={fortuneImg}
                    alt="fortune"
                    className="w-[150px] aspect-square"
                  />
                  {fortuneLoading ? "Getting Fortune" : fortune}
                </span>
              )}
            </div>
          )}
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
