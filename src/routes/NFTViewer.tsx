import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import {
    Client,
    convertHexToString, NFTOffer,
    NFTSellOffersRequest,
} from 'xrpl';
import { xumm } from "../store/XummStore";
import '../gift.css';
import axios from "axios";
import PresentList from "../components/PresentList.tsx";

interface NFTInfo {
    NFTokenID: string;
    Issuer: string;
    NFTokenTaxon: number;
    owner: string;
    URI?: string;
}

interface Metadata {
    name?: string;
    description?: string;
    image?: string;
}

type GiftData = {
    _id: string;
    nft_id: string;
    message: string;
    created_at: string;
};

const fetchMetadata = async (uri: string): Promise<Metadata> => {
    try {
        const response = await fetch(uri);
        return await response.json();
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return {};
    }
};

const fetchOffers = async (nftId: string): Promise<NFTOffer[]> => {
    const client = new Client('wss://testnet.xrpl-labs.com');
    await client.connect();

    const request: NFTSellOffersRequest = {
        command: 'nft_sell_offers',
        nft_id: nftId,
    };

    try {
        const response = await client.request(request);
        console.log(`Offers for NFT ID ${nftId}:`, response.result.offers);
        return response.result.offers || [];
    } catch (error) {
        console.error(`Error fetching offers for NFT ID ${nftId}:`, error);
        return [];
    } finally {
        await client.disconnect();
    }
};

const fetchData = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        throw error;  // Here we throw the error to handle it in the place of call
    }
};

export default function NFTViewer() {
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [data, setData] = useState<GiftData | null>(null);
    const nftInfo = useLoaderData() as NFTInfo;
    const { accountId, nftId } = useParams<{ accountId: string; nftId: string }>();
    const [metadata, setMetadata] = useState<Metadata>({});
    const [offers, setOffers] = useState<NFTOffer[]>([]);
    const [isAccepting, setIsAccepting] = useState(false);

    useEffect(() => {
        const getMetadata = async () => {
            if (nftInfo.URI) {
                const uri = convertHexToString(nftInfo.URI).replace("ipfs://", "https://tan-tragic-hippopotamus-246.mypinata.cloud/ipfs/");
                const fetchedMetadata = await fetchMetadata(uri);
                setMetadata(fetchedMetadata);
            }
        };

        const getOffers = async () => {
            if (nftId) {
                const fetchedOffers = await fetchOffers(nftId);
                setOffers(fetchedOffers);
            }
        };

        getMetadata();
        getOffers();
    }, [nftInfo.URI, nftId]);

    useEffect(() => {
        xumm.user.account.then((account) => setAccount(account));
    }, []);

    useEffect(() => {
        const getApiData = async () => {
            try {
                const result = await fetchData(`https://irodori-api.vercel.app/api/gifts/${nftId}`);
                setData(result);
            } catch (error) {
                console.error(`Error in fetching: ${error}`);
            }
        };
        getApiData();
    }, []);

    const connect = async () => {
        await xumm.authorize();
    };

    const acceptOffer = async (offerId: string) => {
        setIsAccepting(true);
        const payload = await xumm.payload?.create({
            TransactionType: 'NFTokenAcceptOffer',
            NFTokenSellOffer: offerId
        });
        payload?.refs.qr_png && alert('NFTを受け取りました');

        if (!payload?.pushed) {
            console.log(payload?.refs.qr_png);
            payload?.refs.qr_png && alert('QRコードを表示しました');
        }
    };

    return (
        <div>
            <div className="container">
                <div className="movie-card">
                    <div className="movie-header">
                        {metadata.image &&
                            <img src={metadata.image}
                                 alt="NFT"
                                 className="rounded-t-lg"
                                 style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                    </div>
                    <div className="movie-content">
                        <div className="movie-content-header">
                            <div>{data && <div>{data.message}</div>}</div>
                            <div>{metadata.name || '誕生日おめでとう！いつもありがとう！'}</div>
                        </div>
                        <div className="movie-info">
                            <div className="info-section">
                                <label>Date</label>
                                <span>2024/07/05</span>
                            </div>
                            <div className="info-section">
                                <label>From</label>
                                <span>James</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { offers.length > 0 ? (
                <ul className="flex justify-center">
                    {offers.map(offer => (
                        <li key={offer.nft_offer_index}>
                            <div className="hidden">
                                Offer ID: {offer.nft_offer_index}, Amount: {offer.amount.toString()}, Owner: {offer.owner}
                            </div>
                            {account ? (
                                account === nftInfo.owner ? (
                                    <></>
                                ):(
                                    <button
                                        className="btn btn-outline btn-primary"
                                        onClick={() => acceptOffer(offer.nft_offer_index)}
                                        disabled={isAccepting}
                                    >
                                        {isAccepting ? 'Accepting...' : 'NFTを受け取る'}
                                    </button>
                                )
                            ):(
                                <div className="grid justify-items-center">
                                    <button
                                        className="btn btn-outline btn-info"
                                        onClick={connect}>ウォレットを接続する</button>
                                    <div>※ウォレットを接続するとNFTを受け取ることができます</div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="hidden">No offers available for this NFT.{accountId}</p>
            )}
            {account && (account === nftInfo.Issuer || account === nftInfo.owner ) && (
                <PresentList />
            )}
        </div>
    );
}
