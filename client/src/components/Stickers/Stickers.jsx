import React, { useState, useCallback } from 'react'
import useComponentFocus from '../../customHooks/useComponentFocus'
import stickersList from './stickersList'

export default function Stickers({ sendSticker }) {
  const [isStickersVisible, setIsStickersVisible] = useState(false)

  const [stickersRef] = useComponentFocus(() => { setIsStickersVisible(false) })

  const changeStickersDisplay = useCallback(() => {
    setIsStickersVisible(!isStickersVisible)
  }, [isStickersVisible])

  const onStickerSend = useCallback(value => () => {
    setIsStickersVisible(false)
    sendSticker(value)
  }, [sendSticker])

  const stickersBlockClass = `stickers__block ${!isStickersVisible ? 'stickers__block_hidden' : ''}`.trim()

  return (
    <div className="stickers" ref={stickersRef}>
      <button className="button stickers__icon" onClick={changeStickersDisplay} type="button" />
      <div className="stickers__container">
        <div className={stickersBlockClass}>
          <div className="stickers__list">
            {Object.entries(stickersList).map(([key, value]) => (
              <button
                type="button"
                className="button stickers__item"
                onClick={onStickerSend(value)}
                key={key}
                title={key}
                style={{ backgroundImage: `url(${value})` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
