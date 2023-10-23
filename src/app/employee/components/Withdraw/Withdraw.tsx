"use client";

import { Web3Context } from "@/context";
import { useContext, useState } from "react";

export const Withdraw = () => {
  const { contract, web3 } = useContext(Web3Context);

  const [beneficiary, setBeneficiary] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const [transationResult, setTransationResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleWithdraw = async () => {
    const accounts = await web3!.eth.getAccounts();
    const senderAddress = accounts[0];

    setTransationResult("Processing...");
    setIsLoading(true);

    try {
      const result = await contract?.methods
        .withdraw(beneficiary, amount)
        .send({
          from: senderAddress,
        });
      console.log("Transaction: ", result);
      setTransationResult(`${result.blockHash} done`);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setTransationResult("Processing fail");
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-4xl">Withdraw</h2>
      <hr />

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
        Amount:{" "}
        <input
          className="text-black"
          id="title"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </label>

      <button
        className="bg-sky-500 w-fit px-6 py-2 rounded"
        type="button"
        onClick={handleWithdraw}
        disabled={isLoading}
      >
        Withdraw
      </button>
      <p>Transaction: {transationResult}</p>
    </section>
  );
};
