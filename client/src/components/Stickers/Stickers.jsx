import React, { useState, useRef } from 'react'
import useComponentFocus from '../../customHooks/useComponentFocus'

export default function Stickers({getSticker}) {
    const [stickersDisplay, showStickers] = useState(false);

    const stickersRef = useRef();
    useComponentFocus(stickersRef, () => { showStickers(false) });

    const changeStickersDisplay = () => {
        showStickers(!stickersDisplay)
    }

    const sendSticker = (event) => {
        showStickers(false);
        getSticker(event.target.style.backgroundImage);
    }

    return (
        <div className="stickers" ref={stickersRef}>
            <div className="stickers__icon" onClick={changeStickersDisplay}></div>
            <div className="stickers__container">
                <div className={stickersDisplay ? 'stickers__block' : 'stickers__block__hide'}>
                    <div className="stickers__list">
                        <div className="stickers__item" onClick={sendSticker} style={{backgroundImage: "url(https://img.pngio.com/poo-emoji-sticker-transparent-png-stickpng-sticker-png-517_505.png)"}}></div>
                        <div className="stickers__item" onClick={sendSticker} style={{backgroundImage: "url(https://img.pngio.com/png-png-the-panda-line-stickers-line-store-sticker-png-240_240.png)"}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
