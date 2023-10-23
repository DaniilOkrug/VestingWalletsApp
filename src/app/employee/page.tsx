"use client";

import { Web3Context } from "@/context";
import { VestingWallet } from "@/types";
import { contractAddress } from "@/web3";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const { contract, web3 } = useContext(Web3Context);

  const [vestingWallet, setViestingWallet] = useState<VestingWallet>();

  const [transationResult, setTransationResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleReleaseTokens = async () => {
    const accounts = await web3!.eth.getAccounts();
    const senderAddress = accounts[0];

    setTransationResult("Release processing...");
    setIsLoading(true);

    try {
      const result = await contract?.methods.release().send({
        from: senderAddress,
      });
      console.log("Release transaction: ", result);
      setTransationResult(`${result.blockHash} done`);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setTransationResult("Processing fail");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getUserVestingWallet = async () => {
      const accounts = await web3!.eth.getAccounts();
      const senderAddress = accounts[0];

      try {
        const vestingWallet: VestingWallet = await contract?.methods
          .wallets(senderAddress)
          .call();

        setViestingWallet(vestingWallet);
      } catch (error) {
        console.error(error);
      }
    };

    getUserVestingWallet();

    const timer = setInterval(getUserVestingWallet, 2000);

    return () => clearInterval(timer);
  }, [web3, contract]);

  return (
    <main className="flex flex-col items-center p-5">
      <div className="min-w-[30%] flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-4xl">Employee page</h1>

          <div className="flex flex-row items-center gap-5">
            <Link href="/">Manager page</Link>
            <Link href="/employee">Employee page</Link>
          </div>
        </div>
        <hr />

        <p>Updates every 2 seconds</p>

        <hr />

        <h2>
          Employee Vesting Wallet Info{" "}
          <span
            className="text-red-600"
            hidden={
              vestingWallet?.employee !==
              "0x0000000000000000000000000000000000000000"
            }
          >
            {" "}
            - No Vesting Wallet for current Employee
          </span>
        </h2>

        <p>Employee address: {vestingWallet?.employee}</p>
        <p>
          Start Time:{" "}
          {vestingWallet?.startTime
            ? new Date(+vestingWallet?.startTime * 1000).toLocaleString()
            : ""}
        </p>
        <p>Duration(seconds): {vestingWallet?.durationSeconds}</p>
        <p>
          Amount:{" "}
          {vestingWallet?.token_address === contractAddress
            ? web3!.utils.fromWei(vestingWallet?.amount, "ether")
            : vestingWallet?.amount}
        </p>
        <p>
          Token address(empty for Eth):{" "}
          {vestingWallet?.token_address === contractAddress
            ? ""
            : vestingWallet?.token_address}
        </p>

        <hr />
        <button
          className="bg-sky-500 w-fit px-6 py-2 rounded"
          type="button"
          onClick={handleReleaseTokens}
          disabled={isLoading}
        >
          Release tokens
        </button>
        <p>Transaction: {transationResult}</p>
      </div>
    </main>
  );
}
