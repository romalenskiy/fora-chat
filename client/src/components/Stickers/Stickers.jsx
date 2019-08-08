import React, { useState, useRef } from 'react'
import useComponentFocus from '../../customHooks/useComponentFocus'
import stickersArray from './stickersList'

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
                        {stickersArray.map((sticker)=><div className="stickers__item" onClick={sendSticker} key={sticker.key} title={sticker.key} style={{backgroundImage: sticker.image}}></div>)}
                    </div>
                </div>
            </div>
        </div>
    )
}
