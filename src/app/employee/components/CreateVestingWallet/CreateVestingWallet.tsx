"use client";

import { Web3Context } from "@/context";
import { ERC20ABI, contractAddress } from "@/web3";
import { useContext, useState } from "react";

export const CreateVestingWallet = () => {
  const { contract, web3 } = useContext(Web3Context);

  const [beneficiary, setBeneficiary] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [tokenAddress, setTokenAddress] = useState<string>("");

  const [transationResult, setTransationResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreate = async () => {
    const accounts = await web3!.eth.getAccounts();
    const senderAddress = accounts[0];

    setTransationResult("Processing...");
    setIsLoading(true);

    try {
      if (tokenAddress) {
        const tokenContract = new web3!.eth.Contract(ERC20ABI, tokenAddress);
        await tokenContract.methods.approve(contractAddress, amount).send({
          from: senderAddress,
        });

        const result = await contract?.methods
          .createVestingWallet(beneficiary, duration, tokenAddress, amount)
          .send({
            from: senderAddress,
          });
        console.log("Transaction: ", result);
        setTransationResult(`${result.blockHash} done`);
        setIsLoading(false);
      } else {
        const result = await contract?.methods
          .createVestingWallet(
            beneficiary,
            duration,
            contractAddress,
            web3!.utils.toWei(amount, "ether")
          )
          .send({
            from: senderAddress,
            value: web3!.utils.toWei(amount, "ether"),
          });
        console.log("Transaction: ", result);
        setTransationResult(`${result.blockHash} done`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setTransationResult("Processing fail");
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl">Create Vesting Wallet for employee</h2>

      <label>
        Beneficiary(employee address):{" "}
        <input
          className="text-black"
          id="title"
          type="text"
          value={beneficiary}
          onChange={(e) => setBeneficiary(e.target.value)}
        />
      </label>
      <label>
        Duration(seconds):{" "}
        <input
          className="text-black"
          id="title" 
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </label>
      <label>
        Amount:{" "}
        <input
          className="text-black"
          id="title"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>
      <label>
        Token address(empty for Eth):{" "}
        <input
          className="text-black"
          id="title"
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
      </label>

      <button
        className="bg-sky-500 w-fit px-6 py-2 rounded"
        type="button"
        onClick={handleCreate}
        disabled={isLoading}
      >
        Create wallet
      </button>
      <p>Transaction: {transationResult}</p>
    </section>
  );
};
