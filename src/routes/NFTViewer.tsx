import { useLoaderData, useParams } from 'react-router-dom';
import {convertHexToString} from 'xrpl';
import '../gift.css';

interface NFTInfo {
    NFTokenID: string;
    Issuer: string;
    NFTokenTaxon: number;
    owner: string;
    URI?: string;
    // 他の必要なプロパティがあれば追加してください
}

export default function NFTViewer() {
    const nftInfo = useLoaderData() as NFTInfo;
    const { accountId, nftId } = useParams<{ accountId: string; nftId: string }>();

    return (
        <div>
            <div className="container">
                <div className="movie-card">
                    <div className="movie-header babyDriver">
                    </div>
                    <div className="movie-content">
                        <div className="movie-content-header">
                            <div>誕生日おめでとう！いつもありがとう！</div>
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
        </div>
    );
}
