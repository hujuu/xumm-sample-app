import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";
import './index.css'
import Root from "./routes/root";
import Profile from "./routes/profile.tsx";
import NFTViewer from "./routes/NFTViewer.tsx";
import {
    Client
} from 'xrpl';

interface NFTInfo {
    NFTokenID: string;
    Issuer: string;
    NFTokenTaxon: number;
    owner: string;
    URI?: string;
    // 他の必要なプロパティがあれば追加してください
}

export const nftLoader = async ({ params }: { params: { accountId: string; nftId: string } }) => {
    const { accountId, nftId } = params;

    if (!accountId || !nftId) {
        throw new Response("Missing accountId or nftId", { status: 400 });
    }

    const client = new Client('wss://s.altnet.rippletest.net:51233');
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

        return { ...nft, owner: accountId } as NFTInfo;
    } catch (error) {
        console.error('Error fetching NFT:', error);
        throw new Response("Error fetching NFT information", { status: 500 });
    }
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
    {
        path: "/my-profile",
        element: <Profile />,
    },
    {
        path: "/nft/:accountId/:nftId",
        element: <NFTViewer />,
        loader: nftLoader,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
