import React from 'react'

function Message(props) {
  const { value, type, username } = props

  let messageTextClass

  switch (type) {
    case 'my':
      messageTextClass = 'message__text message__text_my'
      break

    case 'foreign':
      messageTextClass = 'message__text message__text_foreign'
      break

    default:
      messageTextClass = 'message__text'
      break
  }

  return (
    <div className="row message">
      <div className={messageTextClass}>
        {username && <div className="message__username">{username}</div>}
        {value}
      </div>
    </div>
  )
}

export default Message
