import {useEffect, useState} from "react";
import { Client, AccountNFTsRequest, AccountNFToken, convertHexToString } from 'xrpl';

type ItemListProps = {
    account: string | undefined;
};

const fetchMetadata = async (uri: string) => {
    const response = await fetch(uri);
    const metadata = await response.json();
    return metadata;
};

export default function ItemListMarket({ account }: ItemListProps) {
    const [nfts, setNfts] = useState<AccountNFToken[]>([]);
    const [metadataList, setMetadataList] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        if (!account) return;

        const fetchNFTs = async () => {
            const client = new Client('wss://testnet.xrpl-labs.com');
            await client.connect();

            const request: AccountNFTsRequest = {
                command: 'account_nfts',
                account: account,
            };

            const response = await client.request(request);
            setNfts(response.result.account_nfts);

            await client.disconnect();
        };

        fetchNFTs();
    }, [account]);

    useEffect(() => {
        const fetchAllMetadata = async () => {
            const metadataPromises = nfts.map(async (nft) => {
                if (nft.URI) {
                    const uri = convertHexToString(nft.URI).replace("ipfs://", " https://tan-tragic-hippopotamus-246.mypinata.cloud/ipfs/");
                    try {
                        const metadata = await fetchMetadata(uri);
                        return { nftId: nft.NFTokenID, metadata };
                    } catch (error) {
                        console.error(`Error fetching metadata for URI: ${uri}`, error);
                        return { nftId: nft.NFTokenID, metadata: null };
                    }
                }
                return { nftId: nft.NFTokenID, metadata: null };
            });

            const resolvedMetadata = await Promise.all(metadataPromises);
            const newMetadataList = resolvedMetadata.reduce((acc, { nftId, metadata }) => {
                acc[nftId] = metadata;
                return acc;
            }, {} as { [key: string]: any });

            setMetadataList(newMetadataList);
        };

        if (nfts.length > 0) {
            fetchAllMetadata();
        }
    }, [nfts]);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 pt-16 sm:px-6 sm:pt-24 lg:max-w-7xl lg:px-8">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">NFT Market</span>
                    </div>
                </div>
                <h2 className="sr-only">Products</h2>
                <div
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {nfts.map((nft: AccountNFToken, index) => (
                        <div key={index}>
                            <div
                                onClick={() => (document.getElementById(`market_modal_${index}`) as HTMLDialogElement).showModal()}
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
                                <p className="flex mt-1 text-lg font-medium text-gray-900">
                                    <img
                                        className={"mr-1"}
                                        src="/icon-xrp-heavy.svg"
                                        alt="XRP Icon"
                                        width={15}
                                        height={15}
                                    />
                                    Price:
                                </p>
                            </div>
                            <dialog key={index} id={`market_modal_${index}`} className="modal">
                                <div className="modal-box w-10/12 max-w-5xl">
                                    <h3 className="font-bold text-lg">{metadataList[nft.NFTokenID]?.name}</h3>
                                    <p className="py-4"></p>
                                    <div
                                        className="overflow-hidden rounded-lg flex items-center justify-center">
                                        <img
                                            src={metadataList[nft.NFTokenID]?.image}
                                            alt={metadataList[nft.NFTokenID]?.name}
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
                                            Price:
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center mt-8">
                                        <button className="btn btn-primary">ギフトをmintする
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
