import { useState, useEffect } from 'react';
import {Client, AccountNFTsRequest, convertStringToHex, AccountNFToken} from 'xrpl';
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

    const mintNFT = async () => {
        const payload = await xumm.payload?.create({
            TransactionType: "NFTokenMint",
            Account: account,
            TransferFee: 5 * 1000, // 5%
            URI: convertStringToHex('ipfs://QmTu17csW1DrFY9xcgH9efBNvMgo39JZwK2adHLpmsJQFR'),
            NFTokenTaxon: 0, // 0は一般的なトークン
            Flags: 1 + 8, // Burnable, Transferable
        });

        if (!payload?.pushed) {
            console.log(payload?.refs.qr_png);
            payload?.refs.qr_png && alert('QRコードを表示しました');
        }
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
            {account && (
                <div className="max-w-3xl mx-auto">
                    <button className="btn btn-primary" onClick={mintNFT}>Mint NFT</button>
                    <button className="btn" onClick={fetchNFTs}>Fetch NFTs</button>
                    {nfts.length > 0 && (
                        <div>
                            <h3>My NFTs</h3>
                            <ul>
                                {nfts.map((nft, index) => (
                                    <li key={index}>{JSON.stringify(nft)}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
            <ItemList account={account} />
        </main>
    );
}
