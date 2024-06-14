import { useState, useEffect } from 'react';
import {Client, AccountNFTsRequest, AccountNFToken, convertHexToString} from 'xrpl';
import Header from "./components/Header";
import ItemList from "./components/ItemList";
import HeroImage from "./components/HeroImage";
import { xumm } from "./store/XummStore";

export default function Home() {
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [nfts, setNfts] = useState<AccountNFToken[] >([]);

    useEffect(() => {
        xumm.user.account.then((account) => setAccount(account));
    }, []);

    const connect = async () => {
        await xumm.authorize();
    };

    const disconnect = async () => {
        await xumm.logout();
        setAccount(undefined);
        setNfts([]);
    };

    const fetchNFTs = async () => {
        if (!account) return;

        const client = new Client('wss://testnet.xrpl-labs.com');
        await client.connect();

        const request: AccountNFTsRequest = {
            command: 'account_nfts',
            account: account,
        };

        const response = await client.request(request);
        setNfts(response.result.account_nfts);

        await client.disconnect();
    };

    return (
        <main>
            <Header account={account} onConnect={connect} disConnect={disconnect}/>
            <HeroImage account={account} onConnect={connect} />
            <ItemList account={account} />
            {account && (
                <div className="max-w-3xl mx-auto">
                    <button className="btn" onClick={fetchNFTs}>所有しているNFTを確認する</button>
                    {nfts.length > 0 && (
                        <div>
                            <h3>所有している NFTs</h3>
                            <ul>
                                {nfts.map((nft: AccountNFToken, index) => (
                                    <li key={index}>
                                        {JSON.stringify(nft)}
                                        {nft.URI && <img
                                            alt={nft.NFTokenID}
                                            src={`${convertHexToString(nft.URI).replace("ipfs://", "")}`}
                                        />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
