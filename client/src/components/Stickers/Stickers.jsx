import React, { useState, useRef } from 'react'
import useComponentFocus from '../../customHooks/useComponentFocus'
import stickersArray from './stickersList'

export default function Stickers({ getSticker }) {
  const [stickersDisplay, showStickers] = useState(false)

  const [stickersRef] = useComponentFocus(() => { showStickers(false) })

  const changeStickersDisplay = () => {
    showStickers(!stickersDisplay)
  }

  const sendSticker = (event) => {
    showStickers(false)
    getSticker(event.target.style.backgroundImage)
  }

  return (
    <div className="stickers" ref={stickersRef}>
      <button className="stickers__icon" onClick={changeStickersDisplay} type="button" />
      <div className="stickers__container">
        <div className={stickersDisplay ? 'stickers__block' : 'stickers__block__hide'}>
          <div className="stickers__list">
            {stickersArray.map(sticker => <button type="button" className="stickers__item" onClick={sendSticker} key={sticker.key} title={sticker.key} style={{ backgroundImage: sticker.image }} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
