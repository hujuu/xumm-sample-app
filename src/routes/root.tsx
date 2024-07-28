import { useState, useEffect } from 'react';
import Header from "../components/Header";
import ItemList from "../components/ItemList";
import HeroImage from "../components/HeroImage";
import { xumm } from "../store/XummStore";
import ItemListMarket from "../components/ItemListMarket.tsx";

export default function Root() {
    const [account, setAccount] = useState<string | undefined>(undefined);
    const [networkEndpoint, setNetworkEndpoint] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchAccountAndNetwork = async () => {
            try {
                const accountInfo = await xumm.user.account;
                setAccount(accountInfo);

                if (accountInfo) {
                    const endpoint = await xumm.user.networkEndpoint;
                    setNetworkEndpoint(endpoint);
                }
            } catch (error) {
                console.error("Error fetching account or network info:", error);
            }
        };

        fetchAccountAndNetwork();
    }, []);

    const connect = async () => {
        try {
            await xumm.authorize();
            const accountInfo = await xumm.user.account;
            setAccount(accountInfo);

            if (accountInfo) {
                const endpoint = await xumm.user.networkEndpoint;
                setNetworkEndpoint(endpoint);
            }
        } catch (error) {
            console.error("Error connecting:", error);
        }
    };

    const disconnect = async () => {
        try {
            await xumm.logout();
            setAccount(undefined);
            setNetworkEndpoint(undefined);
        } catch (error) {
            console.error("Error disconnecting:", error);
        }
    };

    return (
        <main>
            <Header account={account} network={networkEndpoint} onConnect={connect} disConnect={disconnect}/>
            <HeroImage account={account} onConnect={connect} />
            <ItemListMarket account={"r9GXFFfbgcWi1d5iU5Z2UdzKRE3btfAq8G"}/>
            <ItemList account={account}/>
        </main>
    );
}
