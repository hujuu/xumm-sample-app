import {AccountNFToken} from "xrpl";
import {ChangeEvent, useState} from "react";
import axios from 'axios';

export default function ItemListOwn({ account, nfts, metadataList, createOfferNFT, createPresentOfferNFT, burnNFT }: any) {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSendGift = async (nftId: string) => {
        try {
            createPresentOfferNFT(nftId)
            const response = await axios.post('https://irodori-api.vercel.app/api/gifts', {
                nft_id: nftId,
                message: inputValue
            });
            console.log('Gift sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending gift:', error);
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
                        <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">所有している NFTs</span>
                    </div>
                </div>
                <div
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {nfts.map((nft: AccountNFToken, index: number) => (
                        <div key={index}>
                            <div
                                onClick={() => (document.getElementById(`my_modal_${index}`) as HTMLDialogElement).showModal()}
                                className="group">
                                <div
                                    className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                    <img
                                        src={metadataList[nft.NFTokenID]?.image}
                                        alt={metadataList[nft.NFTokenID]?.name}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{metadataList[nft.NFTokenID]?.name}</h3>
                            </div>
                            <dialog key={index} id={`my_modal_${index}`} className="modal">
                                <div className="grid grid-cols-2 gap-4 modal-box w-10/12 max-w-5xl">
                                    <div>
                                        <h3 className="font-bold text-lg">{metadataList[nft.NFTokenID]?.name}</h3>
                                        <p className="py-4"></p>
                                        <div
                                            className="overflow-hidden rounded-lg flex items-center justify-center">
                                            <img
                                                src={metadataList[nft.NFTokenID]?.image}
                                                alt={metadataList[nft.NFTokenID]?.image}
                                                className="w-1/3 h-1/3 rounded-lg"
                                            />
                                        </div>
                                        <div className="text-center">
                                            <a href={`/nft/${account}/${nft.NFTokenID}`} className="link">
                                                ギフトページを確認する
                                            </a>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex mt-8">
                                            <label className="form-control w-full max-w-s">
                                                <div className="label">
                                                    <span className="label-text">メッセージ</span>
                                                    <span className="label-text-alt">最大全角512文字</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Type here"
                                                    className="input input-bordered w-full max-w-s"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="label">
                                                    <span className="label-text-alt"></span>
                                                    <span className="label-text-alt"></span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex mt-8">
                                            <label className="form-control w-full max-w-s">
                                                <div className="label">
                                                    <span className="label-text">ギフトURL</span>
                                                    <span className="label-text-alt">最大全角512文字</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Type here"
                                                    className="input input-bordered w-full max-w-s"
                                                    value={inputValue}
                                                    onChange={handleInputChange}
                                                />
                                                <div className="label">
                                                    <span className="label-text-alt">                                                        eGiftやvoucherなどのURLを入れることができます。このURLはNFTを受け取ってNFTの所有者となった人だけが見ることができます。
</span>
                                                    <span className="label-text-alt"></span>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="flex mt-8">
                                            <button className="btn btn-primary"
                                                    onClick={() => handleSendGift(nft.NFTokenID)}>NFTをプレゼントする
                                            </button>
                                            <button className="btn btn-primary"
                                                    onClick={() => createOfferNFT(nft.NFTokenID)}>オファーを作成する
                                            </button>
                                            <button className="btn btn-outline btn-warning"
                                                    onClick={() => burnNFT(nft.NFTokenID)}>削除する
                                            </button>
                                        </div>
                                        <div className="modal-action">
                                            <form method="dialog">
                                                <button className="btn">Close</button>
                                            </form>
                                        </div>
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
