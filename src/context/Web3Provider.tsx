"use client";

import { PropsWithChildren, createContext, useEffect, useState } from "react";
import Web3 from "web3";

import { ABI, contractAddress } from "@/web3";
import { Contract } from "web3-eth-contract";

export const Web3Context = createContext<{
  web3: Web3 | null;
  contract: Contract | null;
  address: string | null;
}>({
  web3: null,
  contract: null,
  address: null,
});

export const Web3Provider = ({ children }: PropsWithChildren) => {
  const [web3, setWeb3] = useState<Web3>();
  const [contract, setContract] = useState<Contract>();
  const [address, setAddress] = useState<string>();

  useEffect(() => {
    window.ethereum
      ? window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((accounts: string[]) => {
            setAddress(accounts[0]);

            const w3 = new Web3(window.ethereum);
            setWeb3(w3);

            const contract = new w3.eth.Contract(ABI, contractAddress);
            setContract(contract);
          })
          .catch((err: any) => console.log(err))
      : alert("Please install MetaMask");
  }, []);

  if (!contract || !web3 || !address) return <>Loading...</>;

  return (
    <Web3Context.Provider value={{ web3, contract, address }}>
      {children}
    </Web3Context.Provider>
  );
};
