import { LoaderFunction } from 'react-router-dom';
import {Client} from 'xrpl';

interface NFTInfo {
    NFTokenID: string;
    Issuer: string;
    NFTokenTaxon: number;
    owner: string;
    URI?: string;
}

export const nftLoader: LoaderFunction = async ({ params }) => {
    const { accountId, nftId } = params;

    if (!accountId || !nftId) {
        throw new Response("Missing accountId or nftId", { status: 400 });
    }

    const client = new Client('wss://testnet.xrpl-labs.com');
    await client.connect();

    try {
        const response = await client.request({
            command: 'account_nfts',
            account: accountId
        });

        await client.disconnect();

        const nft = response.result.account_nfts.find((nft: any) => nft.NFTokenID === nftId);

        if (!nft) {
            throw new Response("NFT not found", { status: 404 });
        }

        console.log('NFT:', nft);

        return { ...nft, owner: accountId } as NFTInfo;
    } catch (error) {
        console.error('Error fetching NFT:', error);
        throw new Response("Error fetching NFT information", { status: 500 });
    }
};
