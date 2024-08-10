import { xumm } from "../store/XummStore";
import { convertStringToHex } from "xrpl";
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
    pinataJwt: import.meta.env.VITE_PINATA_JWT,
    pinataGateway: "https://tan-tragic-hippopotamus-246.mypinata.cloud",
});

export interface Product {
    id: number;
    name: string;
    href: string;
    price: string;
    imageSrc: string;
    imageAlt: string;
    uri: string;
}

export const mintNFT = async (product: Product, message: string, account: string) => {
    try {
        const metadata = {
            name: product.name,
            description: message,
            image: product.imageSrc,
        };

        const metadataString = JSON.stringify(metadata);
        const file = new File([metadataString], `${product.name}_metadata.json`, { type: "application/json" });

        const upload = await pinata.upload.file(file);

        const ipfsUri = `ipfs://${upload.IpfsHash}`;

        const payload = await xumm.payload?.create({
            TransactionType: "NFTokenMint",
            Account: account,
            TransferFee: 5 * 1000, // 5%
            URI: convertStringToHex(ipfsUri),
            NFTokenTaxon: 0,
            Flags: 1 + 8, // Burnable, Transferable
            Memos: [
                {
                    "Memo": {
                        "MemoType": convertStringToHex("text/plain"),
                        "MemoData": convertStringToHex(message)
                    }
                }
            ],
        });

        if (payload?.refs.qr_png) {
            alert('Xummアプリからmintを確定してください');
        }

        if (!payload?.pushed) {
            console.log(payload?.refs.qr_png);
            payload?.refs.qr_png && alert('QRコードを表示しました');
        }

        return payload;

    } catch (error) {
        console.error("NFTのミント中にエラーが発生しました:", error);
        throw error;
    }
};
