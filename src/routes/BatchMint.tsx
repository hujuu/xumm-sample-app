import { useState, useEffect } from 'react';
import { xumm } from "../store/XummStore";
import {convertStringToHex, Client} from "xrpl";
import Header from "../components/Header.tsx";

type TicketCreate = {
    TransactionType: 'TicketCreate';
    Account: string;
    TicketCount: number;
};

type NFTokenMintTransaction = {
    TransactionType: 'NFTokenMint';
    Account: string;
    URI: string;
    Flags: number;
    TransferFee: number;
    TicketSequence: number;
    NFTokenTaxon: number;
    Sequence: number;
};

const NFTBatchMinter = () => {
    const [nftCount, setNftCount] = useState(1);
    const [tokenUrl, setTokenUrl] = useState('ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf4dfuylqabf3oclgtqy55fbzdi');
    const [flags, setFlags] = useState(8);
    const [transferFee, setTransferFee] = useState(0);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tickets, setTickets] = useState<number[]>([]);
    const [step, setStep] = useState<'connect' | 'createTickets' | 'mintNFTs'>('connect');
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [networkEndpoint, setNetworkEndpoint] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchAccountAndNetwork = async () => {
            try {
                const accountInfo = await xumm.user.account;
                setAccount(accountInfo);

                if (accountInfo) {
                    const endpoint = await xumm.user.networkEndpoint;
                    setNetworkEndpoint(endpoint);
                }
            } catch (error) {
                console.error("Error fetching account or network info:", error);
            }
        };

        fetchAccountAndNetwork();
    }, []);

    const connect = async () => {
        await xumm.authorize();
    };

    const disconnect = async () => {
        await xumm.logout();
        setAccount(undefined);
    };

    useEffect(() => {
        const checkAccount = async () => {
            const userAccount = await xumm.user.account;
            if (userAccount) {
                setAccount(userAccount);
                setStep('createTickets');
            }
        };
        checkAccount();
    }, []);

    const connectWallet = async () => {
        try {
            await xumm.authorize();
            const userAccount = await xumm.user.account;
            if (userAccount) {
                setAccount(userAccount);
                setStep('createTickets');
            } else {
                throw new Error('Failed to get user account');
            }
        } catch (error) {
            setResult(`Error connecting wallet: ${(error as Error).message}`);
        }
    };

    const createTickets = async () => {
        setIsLoading(true);
        setResult('');
        try {
            if (!account) {
                throw new Error('No account connected');
            }
            const ticketCreate: TicketCreate = {
                TransactionType: 'TicketCreate',
                Account: account,
                TicketCount: nftCount,
            };

            await xumm.payload?.createAndSubscribe(ticketCreate);

            setResult('Tickets created successfully. Please check your XAMAN app for confirmation.');
            setStep('mintNFTs');
        } catch (error) {
            setResult(`Error creating tickets: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            if (!account) {
                throw new Error('No account connected');
            }
            const client = new Client('wss://s.altnet.rippletest.net:51233');
            await client.connect();

            const response = await client.request({
                command: 'account_objects',
                account: account,
                type: 'ticket'
            });

            await client.disconnect();

            if (response.result.account_objects) {
                const fetchedTickets = response.result.account_objects
                    .filter(obj => obj.LedgerEntryType === 'Ticket')
                    .map(ticket => (ticket as any).TicketSequence as number);
                setTickets(fetchedTickets);
                setResult(`Found ${fetchedTickets.length} tickets.`);
            } else {
                setResult('No tickets found.');
            }
        } catch (error) {
            setResult(`Error fetching tickets: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const mintNFTs = async () => {
        setIsLoading(true);
        setResult('');
        try {
            if (!account) {
                throw new Error('No account connected');
            }
            if (tickets.length < nftCount) {
                throw new Error(`Not enough tickets. Found ${tickets.length}, need ${nftCount}.`);
            }

            for (let i = 0; i < nftCount; i++) {
                const transactionBlob: NFTokenMintTransaction = {
                    TransactionType: 'NFTokenMint',
                    Account: account,
                    URI: convertStringToHex(tokenUrl),
                    Flags: flags,
                    TransferFee: transferFee,
                    TicketSequence: tickets[i],
                    NFTokenTaxon: i,
                    Sequence: 0,
                };

                await xumm.payload?.createAndSubscribe(transactionBlob);

                setResult((prev) => prev + `\nMinted NFT ${i + 1}/${nftCount}`);
            }

            setResult((prev) => prev + `\nSuccessfully minted ${nftCount} NFTs. Check your XAMAN app for details.`);
        } catch (error) {
            setResult(`Error minting NFTs: ${(error as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <Header account={account} network={networkEndpoint} onConnect={connect} disConnect={disconnect}/>
            <div className="p-4 max-w-xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">NFT Batch Minter (XAMAN)</h1>
                {step === 'connect' && (
                    <button
                        onClick={connectWallet}
                        className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Connect XAMAN Wallet
                    </button>
                )}
                {account && <p className="mb-4">Connected Account: {account}</p>}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1">NFT Count:</label>
                        <input
                            type="number"
                            value={nftCount}
                            onChange={(e) => setNftCount(parseInt(e.target.value))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Token URL:</label>
                        <input
                            type="text"
                            value={tokenUrl}
                            onChange={(e) => setTokenUrl(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Flags:</label>
                        <input
                            type="number"
                            value={flags}
                            onChange={(e) => setFlags(parseInt(e.target.value))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Transfer Fee:</label>
                        <input
                            type="number"
                            value={transferFee}
                            onChange={(e) => setTransferFee(parseInt(e.target.value))}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    {step === 'createTickets' && (
                        <button
                            onClick={createTickets}
                            disabled={isLoading}
                            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Creating Tickets...' : 'Create Tickets'}
                        </button>
                    )}
                    {step === 'mintNFTs' && (
                        <>
                            <button
                                onClick={fetchTickets}
                                disabled={isLoading}
                                className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400"
                            >
                                Fetch Tickets
                            </button>
                            <button
                                onClick={mintNFTs}
                                disabled={isLoading || tickets.length < nftCount}
                                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                            >
                                {isLoading ? 'Minting NFTs...' : 'Mint NFTs'}
                            </button>
                        </>
                    )}
                    {result && (
                        <div className="mt-4 p-4 bg-gray-100 rounded">
                            <h2 className="text-lg font-semibold mb-2">Result</h2>
                            <p>{result}</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default NFTBatchMinter;
