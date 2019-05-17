import React from 'react'

function Message(props) {
  const { value, type, username, timestamp } = props

  const timestampFormatted = new Date(timestamp).toTimeString().slice(0, 5)

  let messageBalloonClass = 'message__balloon '
  let messageTimestampClass = 'message__timestamp '

  switch (type) {
    case 'my':
      messageBalloonClass += 'message__balloon_my'
      messageTimestampClass += 'message__timestamp_my'
      break

    case 'foreign':
      messageBalloonClass += 'message__balloon_foreign'
      messageTimestampClass += 'message__timestamp_foreign'
      break

    default:
      break
  }

  return (
    <div className="row message">
      <div className={messageBalloonClass}>
        {username && <div className="message__username">{username}</div>}
        <div className="message__text">{value}</div>
        <div className={messageTimestampClass}>{timestampFormatted}</div>
      </div>
    </div>
  )
}

export default Message
