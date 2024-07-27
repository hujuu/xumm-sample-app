import './GiftList.css';

export default function GiftList() {
    return (
        <div className="">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-start">
                        <span className="bg-[#e9e9e9] pr-3 text-base font-semibold leading-6 text-gray-900">ギフト</span>
                    </div>
                </div>
                <div
                    className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    <div className="nft">
                        <div className='main'>
                            <img className='tokenImage'
                                 src="https://images.unsplash.com/photo-1621075160523-b936ad96132a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                                 alt="NFT"/>
                            <p className='description'>Xaman Voucher</p>
                            <div className='tokenInfo'>
                                <div className="price">
                                    <p>2 XAH</p>
                                </div>
                            </div>
                            <hr/>
                            <div className='creator'>
                                <a
                                    className="btn btn-active btn-neutral"
                                    href="https://xumm.app/detect/xapp:xaman.voucher/qr?xAppVoucher=EDA8D7B8094EF810C4CF4FF0F9F6DA9DBD3CAC60D53D95E62232EDAE50347D7278"
                                    target={"_blank"}
                                >
                                    <ins>ギフトを開く</ins>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
