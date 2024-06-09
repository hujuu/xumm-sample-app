import { useState } from 'react'
import { Xumm } from 'xumm'

const xumm = new Xumm("a77f5963-be7d-4451-b7ff-7717adf7fe0f");

function App() {
    const [account, setAccount] = useState<string | undefined>(undefined);
    xumm.user.account.then((account) => setAccount(account));

    const connect = async () => {
        await xumm.authorize();
    };

    const disconnect = async () => {
        // Xummからサインアウト
        await xumm.logout();
        // アカウント情報を削除
        setAccount(undefined);
    };

    const createTransaction = async () => {
        const payload = await xumm.payload?.create({
            TransactionType: "Payment",
            Destination: "r9GXFFfbgcWi1d5iU5Z2UdzKRE3btfAq8G",
            Amount: "100", // 100 drops (=0.000100XRP)
        });
        if(!payload?.pushed){
            // Xummへプッシュ通知が届かない場合
            // payload?.refs.qr_png を利用してQRコードを表示することで署名画面を表示することも可能
        }
    };

    return (
        <div>
            {account && (
                <>
                    <div>{account}</div>
                    <button onClick={disconnect}>Disonnect</button>
                    <button onClick={createTransaction}>Payment</button>
                </>
            )}
            {!account && <button onClick={connect}>Connect</button>}
        </div>
    );
}

export default App
