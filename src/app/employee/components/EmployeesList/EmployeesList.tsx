"use client";

import { Web3Context } from "@/context";
import { VestingWallet } from "@/types";
import { contractAddress } from "@/web3";
import { useContext, useEffect, useState } from "react";

export const EmployeesList = () => {
  const { contract, web3 } = useContext(Web3Context);

  const [wallets, setWallets] = useState<VestingWallet[]>([]);

  console.log(wallets);
  useEffect(() => {
    const getAllWalletsAddresses = async () => {
      try {
        const walletsArr: VestingWallet[] = await contract?.methods
          .retrieveAllWallets()
          .call();

        const addresses = new Set(walletsArr.map((el) => el.employee));

        const wallets = [];
        for (const wallet of [...addresses.values()]) {
          const vestingWallet: VestingWallet = await contract?.methods
            .wallets(wallet)
            .call();

          wallets.push(vestingWallet);
        }
        setWallets(wallets);
      } catch (error) {
        console.error(error);
      }
    };

    getAllWalletsAddresses();
    const timer = setInterval(getAllWalletsAddresses, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-4xl">Vesting Wallets</h2>
      <hr />
      <p>Updates every 2 seconds</p>

      <div className="overflow-auto">
        <table className="table-fixed border-separate border-slate-500 border-spacing-2">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Start time</th>
              <th>Duration seconds</th>
              <th>Amount</th>
              <th>Token Address(empty fot Eth)</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet, index) => (
              <tr key={index}>
                <td>{wallet.employee}</td>
                <td>{new Date(+wallet.startTime * 1000).toLocaleString()}</td>
                <td>{wallet.durationSeconds}</td>
                <td>
                  {wallet?.token_address === contractAddress
                    ? web3!.utils.fromWei(wallet?.amount, "ether")
                    : wallet?.amount}
                </td>
                <td>
                  {wallet?.token_address === contractAddress
                    ? ""
                    : wallet?.token_address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
