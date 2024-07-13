import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { convertHexToString } from 'xrpl';
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
    // Add other metadata fields as needed
}

const fetchMetadata = async (uri: string): Promise<Metadata> => {
    try {
        const response = await fetch(uri);
        const metadata = await response.json();
        return metadata;
    } catch (error) {
        console.error('Error fetching metadata:', error);
        return {};
    }
};

export default function NFTViewer() {
    const nftInfo = useLoaderData() as NFTInfo;
    const { accountId, nftId } = useParams<{ accountId: string; nftId: string }>();
    const [metadata, setMetadata] = useState<Metadata>({});

    useEffect(() => {
        const getMetadata = async () => {
            if (nftInfo.URI) {
                const uri = convertHexToString(nftInfo.URI).replace("ipfs://", "https://tan-tragic-hippopotamus-246.mypinata.cloud/ipfs/");
                const fetchedMetadata = await fetchMetadata(uri);
                setMetadata(fetchedMetadata);
            }
        };

        getMetadata();
    }, [nftInfo.URI]);

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
            {metadata.name}
            {metadata.description && (
                <div>
                    <h3>Description</h3>
                    <p>{metadata.description}</p>
                </div>
            )}
        </div>
    );
}
