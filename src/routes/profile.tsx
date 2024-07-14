import {useState, useEffect} from 'react';
import { Client, AccountNFTsRequest, AccountNFToken, convertHexToString } from 'xrpl';
import Header from "../components/Header";
import HeroImage from "../components/HeroImage";
import { xumm } from "../store/XummStore";
import ItemListOwn from "../components/ItemListOwn.tsx";

const fetchMetadata = async (uri: string) => {
    const response = await fetch(uri);
    const metadata = await response.json();
    return metadata;
};

export default function Profile() {
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [nfts, setNfts] = useState<AccountNFToken[]>([]);
    const [metadataList, setMetadataList] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        xumm.user.account.then((account) => setAccount(account));
    }, []);

    useEffect(() => {
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
    }, [account]);

    useEffect(() => {
        const fetchAllMetadata = async () => {
            const metadataPromises = nfts.map(async (nft) => {
                if (nft.URI) {
                    const uri = convertHexToString(nft.URI).replace("ipfs://", "https://tan-tragic-hippopotamus-246.mypinata.cloud/ipfs/");
                    try {
                        const metadata = await fetchMetadata(uri);
                        return { nftId: nft.NFTokenID, metadata };
                    } catch (error) {
                        console.error(`Error fetching metadata for URI: ${uri}`, error);
                        return { nftId: nft.NFTokenID, metadata: null };
                    }
                }
                return { nftId: nft.NFTokenID, metadata: null };
            });

            const resolvedMetadata = await Promise.all(metadataPromises);
            const newMetadataList = resolvedMetadata.reduce((acc, { nftId, metadata }) => {
                acc[nftId] = metadata;
                return acc;
            }, {} as { [key: string]: any });

            setMetadataList(newMetadataList);
        };

        if (nfts.length > 0) {
            fetchAllMetadata();
        }
    }, [nfts]);

    const connect = async () => {
        await xumm.authorize();
    };

    const disconnect = async () => {
        await xumm.logout();
        setAccount(undefined);
        setNfts([]);
        setMetadataList({});
    };

    const createOfferNFT = async (tokenId: string) => {
        const payload = await xumm.payload?.create({
            TransactionType: "NFTokenCreateOffer",
            NFTokenID: tokenId,
            Amount: "1310000",
            Destination: "r4aNu6fs5HuS6vBrHrTbNQhp2QbsX9qPSw",
            Flags : 1 // sell flag,
        });
        payload?.refs.qr_png && alert('オファーを作成しました');

        if (!payload?.pushed) {
            console.log(payload?.refs.qr_png);
            payload?.refs.qr_png && alert('QRコードを表示しました');
        }
    };

    const createPresentOfferNFT = async (tokenId: string) => {
        const payload = await xumm.payload?.create({
            TransactionType: "NFTokenCreateOffer",
            NFTokenID: tokenId,
            Amount: "0",
            Flags : 1 // sell flag,
        });
        payload?.refs.qr_png && alert('プレゼントオファーを作成しました');

        if (!payload?.pushed) {
            console.log(payload?.refs.qr_png);
            payload?.refs.qr_png && alert('QRコードを表示しました');
        }
    };

    const burnNFT = async (tokenId: string) => {
        const payload = await xumm.payload?.create({
            "TransactionType": "NFTokenBurn",
            "Account": account,
            "Fee": "10",
            "NFTokenID": tokenId
        });
        payload?.refs.qr_png && alert('NFTを削除しました');

        if (!payload?.pushed) {
            console.log(payload?.refs.qr_png);
            payload?.refs.qr_png && alert('QRコードを表示しました');
        }
    };

    return (
        <main>
            <Header account={account} onConnect={connect} disConnect={disconnect} />
            <HeroImage account={account} onConnect={connect} />
            {account && (
                <div className="bg-white">
                    {nfts.length > 0 && (
                        <ItemListOwn account={account} nfts={nfts} metadataList={metadataList} createOfferNFT={createOfferNFT} createPresentOfferNFT={createPresentOfferNFT} burnNFT={burnNFT} />
                    )}
                </div>
            )}
        </main>
    );
}
