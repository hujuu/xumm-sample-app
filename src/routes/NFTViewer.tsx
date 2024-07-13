import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import {
    Client,
    convertHexToString, NFTOffer,
    NFTSellOffersRequest,
} from 'xrpl';
import '../gift.css';

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

const acceptOffer = async (offerId: string): Promise<boolean> => {
    // This is a placeholder. You'll need to implement the actual XRPL transaction to accept an offer.
    console.log(`Accepting offer with ID: ${offerId}`);
    return true;
};

export default function NFTViewer() {
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

    const handleAcceptOffer = async (offerId: string) => {
        setIsAccepting(true);
        const success = await acceptOffer(offerId);
        if (success) {
            setOffers(offers.filter(offer => offer.nft_offer_index !== offerId));
            alert('Offer accepted successfully!');
        } else {
            alert('Failed to accept offer. Please try again.');
        }
        setIsAccepting(false);
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
                            <div>誕生日おめでとう！いつもありがとう！</div>
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
            <h2>NFT Information</h2>
            <p>Account ID: {accountId}</p>
            <p>NFT ID: {nftId}</p>
            <p>Issuer: {nftInfo.Issuer}</p>
            <p>Token Taxon: {nftInfo.NFTokenTaxon}</p>
            <p>Owner: {nftInfo.owner}</p>
            <p>URI: {nftInfo.URI ? convertHexToString(nftInfo.URI) : 'N/A'}</p>
            {metadata.name && <p>Name: {metadata.name}</p>}
            {metadata.description && (
                <div>
                    <h3>Description</h3>
                    <p>{metadata.description}</p>
                </div>
            )}

            <h2>Offers</h2>
            {offers.length > 0 ? (
                <ul>
                    {offers.map(offer => (
                        <li key={offer.nft_offer_index}>
                            Offer ID: {offer.nft_offer_index}, Amount: {offer.amount.toString()}, Owner: {offer.owner}
                            <button
                                onClick={() => handleAcceptOffer(offer.nft_offer_index)}
                                disabled={isAccepting}
                            >
                                {isAccepting ? 'Accepting...' : 'Accept Offer'}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No offers available for this NFT.</p>
            )}
        </div>
    );
}
