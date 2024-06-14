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
        price: '48',
        imageSrc: '/images/carnation01.webp',
        imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
    },
    {
        id: 2,
        name: 'Mimosa',
        href: '#',
        price: '35',
        imageSrc: '/images/mimosa01.webp',
        imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
    },
    {
        id: 3,
        name: 'Ranunculus',
        href: '#',
        price: '89',
        imageSrc: '/images/ranunculus01.webp',
        imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
    },
    {
        id: 4,
        name: 'Tulip',
        href: '#',
        price: '35',
        imageSrc: '/images/tulip01.webp',
        imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
    },
]

export default function ItemList({ account }: ItemListProps) {
    const mintNFT = async () => {
        const payload = await xumm.payload?.create({
            TransactionType: "NFTokenMint",
            Account: account,
            TransferFee: 5 * 1000, // 5%
            URI: convertStringToHex('ipfs://QmTu17csW1DrFY9xcgH9efBNvMgo39JZwK2adHLpmsJQFR'),
            NFTokenTaxon: 0, // 0は一般的なトークン
            Flags: 1 + 8, // Burnable, Transferable
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
                <h2 className="sr-only">Products</h2>

                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
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
                                <div className="modal-box w-11/12 max-w-5xl">
                                    <h3 className="font-bold text-lg">{product.name}</h3>
                                    <p className="py-4"></p>
                                    <div
                                        className="overflow-hidden rounded-lg flex items-center justify-center">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.imageAlt}
                                            className="w-1/2 h-1/2 rounded-lg"
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
                                        <button className="btn btn-primary" onClick={mintNFT}>ギフトをmintする</button>
                                    </div>
                                    <div className="modal-action">
                                        <form method="dialog">
                                            {/* if there is a button, it will close the modal */}
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
