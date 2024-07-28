import {useEffect, useState} from "react";
import { Client, AccountInfoRequest } from 'xrpl';

type HeaderProps = {
    account: string | undefined;
    network: string | undefined;
    onConnect: () => void;
    disConnect: () => void;
};

function truncateString(str: string) {
    if (str.length > 6) {
        return str.substring(0, 6) + "...";
    }
    return str;
}

export default function Header({ account, network, onConnect, disConnect } : HeaderProps) {
    const [balance, setBalance] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchBalance = async () => {
            if (account) {
                const client = new Client('wss://testnet.xrpl-labs.com');
                await client.connect();

                const request: AccountInfoRequest = {
                    command: 'account_info',
                    account: account,
                    ledger_index: 'validated'
                };

                const response = await client.request(request);
                setBalance(response.result.account_data.Balance);
                await client.disconnect();
            }
        };

        fetchBalance();
    }, [account]);


    return (
        <div className="navbar bg-amber-50 border-b border-gray-200">
            <div className="flex-1">
                <a href={"/"} className="btn btn-ghost text-xl">Fun Pass</a>
                {network && (
                    <span
                        className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-900 ring-1 ring-inset ring-gray-200">
                        <svg viewBox="0 0 6 6" aria-hidden="true" className="h-1.5 w-1.5 fill-yellow-500">
                            <circle r={3} cx={3} cy={3}/>
                        </svg>
                        {network}
                    </span>
                )}
            </div>
            {account && (
                <>
                    <div className="flex mr-4 font-semibold">
                        <a href={"/my-profile"} className="justify-between btn btn-ghost">
                            My NFTs
                        </a>
                    </div>
                    <div className="flex mr-4 font-semibold">
                        <div className="flex">
                            <img
                                className={"mr-1"}
                                src="/icon-xrp-heavy.svg"
                                alt="XRP Icon"
                                width={15}
                                height={15}
                            />
                            {balance !== undefined ? `${Number(balance) / 1000000}` : 'Fetching balance...'}
                        </div>
                    </div>
                </>
            )}
            {!account && (
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className={"flex"}>
                            <div
                                className={"mt-3 btn btn-outline btn-info"}
                                onClick={onConnect}>
                                ウォレットを接続
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {account && (
                <div className="flex-none">
                    <div className="hidden dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                     viewBox="0 0 24 24"
                                     stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                </svg>
                                <span className="badge badge-sm indicator-item">8</span>
                            </div>
                        </div>
                        <div tabIndex={0}
                             className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                            <div className="card-body">
                                <span className="text-info">Subtotal: $999</span>
                                <div className="card-actions">
                                    <button className="btn btn-primary btn-block">View cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className={"flex"}>
                            <div className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                                        width={40}
                                        height={40}
                                    />
                                </div>
                            </div>
                            <div className={"mt-3"}>{truncateString(account)}</div>
                        </div>
                        <ul tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <a href={"/my-profile"} className="justify-between">
                                    My NFTs
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li>
                                <div onClick={disConnect}>Logout</div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
