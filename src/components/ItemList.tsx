import { xumm } from "../store/XummStore";
import {convertStringToHex} from "xrpl";

type ItemListProps = {
    account: string | undefined;
};

const products = [
    {
        id: 1,
        name: 'Carnation',
        href: '#',
        price: '0.000012 (Only TransferFee)',
        imageSrc: 'https://ipfs.io/ipfs/Qmesi9bJdTKfupTv3GPfnXHMnoF733E1X68pgCeuhHMmZi?filename=carnation01.webp',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
        uri: 'ipfs://QmYUGmN2Px6ccqhG98nPmHe4QSyQ1hheZh9D2oEdQanQqk',
    },
    {
        id: 2,
        name: 'Mimosa',
        href: '#',
        price: '0.000012 (Only TransferFee)',
        imageSrc: 'https://ipfs.io/ipfs/QmQyo2FQFa1XwXCMtZ37pUdNEodubnn5E25PoQ8EQtv5eh?filename=mimosa01.webp',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
        uri: 'ipfs://QmYUGmN2Px6ccqhG98nPmHe4QSyQ1hheZh9D2oEdQanQqk',
    },
    {
        id: 3,
        name: 'Ranunculus',
        href: '#',
        price: '0.000012 (Only TransferFee)',
        imageSrc: 'https://ipfs.io/ipfs/QmZ5aBV23U5PksFNh8JTggaAJ6m6zecAEuvc3vgm9vfwTx?filename=ranunculus01.webp',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
        uri: 'ipfs://QmYUGmN2Px6ccqhG98nPmHe4QSyQ1hheZh9D2oEdQanQqk',
    },
    {
        id: 4,
        name: 'Tulip',
        href: '#',
        price: '0.000012 (Only TransferFee)',
        imageSrc: 'https://ipfs.io/ipfs/QmcAkzKXQaDCQjVeTxhB8B6XJLUa4mpNtt24vbuyHEfzSA?filename=tulip01.webp',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
        uri: 'ipfs://QmYUGmN2Px6ccqhG98nPmHe4QSyQ1hheZh9D2oEdQanQqk',
    },
]

export default function ItemList({ account }: ItemListProps) {
    const mintNFT = async (uriString: string, name: string) => {
        const payload = await xumm.payload?.create({
            TransactionType: "NFTokenMint",
            Account: account,
            TransferFee: 5 * 1000, // 5%
            URI: convertStringToHex(uriString),
            NFTokenTaxon: 0, // 0は一般的なトークン
            Flags: 1 + 8, // Burnable, Transferable
            Memos: [
                {
                    "Memo": {
                        "MemoType": "746578742f706c61696e", // "text/plain"
                        "MemoData": convertStringToHex(name)
                    }
                }
            ],
        });
        payload?.refs.qr_png && alert('Xummアプリからmintを確定してください');

        if (!payload?.pushed) {
            console.log(payload?.refs.qr_png);
            payload?.refs.qr_png && alert('QRコードを表示しました');
        }
    };

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">Self Mint</span>
                    </div>
                </div>
                <h2 className="sr-only">Products</h2>
                <div
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id}>
                            <div
                                onClick={() => (document.getElementById(`my_modal_${product.id}`) as HTMLDialogElement).showModal()}
                                className="group">
                                <div
                                    className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={product.imageSrc}
                                        alt={product.imageAlt}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                <p className="flex mt-1 text-lg font-medium text-gray-900">
                                    <img
                                        className={"mr-1"}
                                        src="/icon-xrp-heavy.svg"
                                        alt="XRP Icon"
                                        width={15}
                                        height={15}
                                    />
                                    {product.price}
                                </p>
                            </div>
                            <dialog key={product.id} id={`my_modal_${product.id}`} className="modal">
                                <div className="modal-box w-10/12 max-w-5xl">
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="py-4"></p>
                                    <div
                                        className="overflow-hidden rounded-lg flex items-center justify-center">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.imageAlt}
                                            className="w-1/3 h-1/3 rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center mt-8">
                                        <p className="flex mt-1 text-lg font-medium text-gray-900">
                                            <img
                                                className={"mr-1"}
                                                src="/icon-xrp-heavy.svg"
                                                alt="XRP Icon"
                                                width={15}
                                                height={15}
                                            />
                                            {product.price}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center mt-8">
                                        <button className="btn btn-primary"
                                                onClick={() => mintNFT(product.uri, product.name)}>ギフトをmintする
                                        </button>
                                    </div>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            <button className="btn">Close</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
