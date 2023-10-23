import Link from "next/link";
import { CreateVestingWallet, EmployeesList, Withdraw } from "./employee/components";

export default function Home() {
  return (
    <main className="flex flex-col items-center p-5">
      <div className="min-w-[30%] max-w-5xl overflow-auto flex flex-col gap-5">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-4xl">Manager page</h1>

          <div className="flex flex-row items-center gap-5">
            <Link href="/">Manager page</Link>
            <Link href="/employee">Employee page</Link>
          </div>
        </div>
        <hr />

        <CreateVestingWallet />

        <hr />

        <Withdraw />

        <hr />

        <EmployeesList />
      </div>
    </main>
  );
}
