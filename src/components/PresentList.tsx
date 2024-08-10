import { Player } from '@lottiefiles/react-lottie-player'
import Animation from './animation.json'

export default function PresentList() {
    return (
        <div className="">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
                <div className="relative mb-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"/>
                    </div>
                    <div className="relative flex justify-start">
                        <span
                            className="bg-[#e9e9e9] pr-3 text-base font-semibold leading-6 text-gray-900">ギフト</span>
                    </div>
                </div>
                <div className="relative flex justify-center">
                    <div className="nft">
                        <Player
                            autoplay
                            loop
                            src={Animation}
                            style={{
                                width: '400px',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                </div>
                <div className='flex justify-center'>
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
    )
}
