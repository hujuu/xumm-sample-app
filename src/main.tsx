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
import {nftLoader} from "./composables/nftLoader.ts";
import NFTBatchMinter from "./routes/BatchMint.tsx";

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
    {
        path: "/nft-mint",
        element: <NFTBatchMinter />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
