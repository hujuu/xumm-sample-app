import {useLoaderData, useParams} from 'react-router-dom';
import {convertHexToString} from "xrpl";

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