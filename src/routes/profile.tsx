import { useState, useEffect } from 'react';
import {Client, AccountNFTsRequest, AccountNFToken, convertHexToString} from 'xrpl';
import Header from "../components/Header";
import ItemList from "../components/ItemList";
import HeroImage from "../components/HeroImage";
import { xumm } from "../store/XummStore";

export default function Profile() {
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [nfts, setNfts] = useState<AccountNFToken[] >([]);

    useEffect(() => {
        xumm.user.account.then((account) => setAccount(account));
    }, []);

    useEffect(() => {
        // If no account available, skip fetching NFTs
        if (!account) return;

        const fetchNFTs = async () => {
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

        fetchNFTs();
    }, [account]); // fetchNFTs is called when 'account' state changes.

    const connect = async () => {
        await xumm.authorize();
    };

    const disconnect = async () => {
        await xumm.logout();
        setAccount(undefined);
        setNfts([]);
    };


    return (
        <main>
            <Header account={account} onConnect={connect} disConnect={disconnect}/>
            <HeroImage account={account} onConnect={connect} />
            <ItemList account={account} />
            {account && (
                <div className="max-w-3xl mx-auto">
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
                                        {nft.URI && <p>{convertHexToString(nft.URI)}</p>}
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
