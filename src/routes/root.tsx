import { useState, useEffect } from 'react';
import Header from "../components/Header";
import ItemList from "../components/ItemList";
import HeroImage from "../components/HeroImage";
import { xumm } from "../store/XummStore";
import ItemListMarket from "../components/ItemListMarket.tsx";

export default function Root() {
    const [account, setAccount] = useState<string | undefined>(undefined);

    useEffect(() => {
        xumm.user.account.then((account) => setAccount(account));
    }, []);

    const connect = async () => {
        await xumm.authorize();
    };

    const disconnect = async () => {
        await xumm.logout();
        setAccount(undefined);
    };

    return (
        <main>
            <Header account={account} onConnect={connect} disConnect={disconnect}/>
            <HeroImage account={account} onConnect={connect} />
            <ItemListMarket account={"r9GXFFfbgcWi1d5iU5Z2UdzKRE3btfAq8G"} />
            <ItemList account={account} />
        </main>
    );
}
