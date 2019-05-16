import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Message from '../Message'

function ChatRoom(props) {
  const { messages, currentMessage, chatRoomMessagesRef, isCurrentMessageValid, onChange, onSubmit } = props

  const submitButtonClass = `button ${isCurrentMessageValid ? 'chat-room__submit-button' : 'chat-room__submit-button_hidden'}`

  return (
    <div className="column chat-room">
      <div className="row chat-room__header">
        <span className="chat-room__name">Global chat room</span>
      </div>

      <div className="column chat-room__messages" ref={chatRoomMessagesRef}>
        {
          messages.map((message, index) => {
            const { type, username, value } = message
            return <Message key={index} type={type} username={username} value={value} />
          })
        }
      </div>

      <form className="row chat-room__input-form" onSubmit={onSubmit}>
        <input value={currentMessage} onChange={onChange} type="text" className="input chat-room__input" placeholder="Message" />
        <button className={submitButtonClass} type="submit">
          <FontAwesomeIcon icon="arrow-right" />
        </button>
      </form>
    </div>
  )
}

export default ChatRoom
