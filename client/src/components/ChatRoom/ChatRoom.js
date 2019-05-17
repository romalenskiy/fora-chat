import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Message from '../Message'
import useInputControl from '../../customHooks/useInputControl'

function ChatRoom(props) {
  const { username } = props

  // Ref for socket
  const socket = useRef()
  // Need for auto scrolling when new message appears
  const chatRoomMessagesRef = useRef()

  // User-entered message at the moment
  const [currentMessage, setCurrentMessage, isCurrentMessageValid] = useInputControl()
  // All chat room messages
  const [messages, setMessages] = useState([])

  // Connecting use to socket on component first render (and disconnecting on cleanup)
  useEffect(() => {
    socket.current = io(`http://${process.env.NODE_ENV === 'production' ? '192.168.100.103' : 'localhost'}:5000`)

    return () => {
      socket.current.disconnect()
    }
  }, [])

  // Adding listener on new message receive.
  // Because of subtlety in work of useEffect hook (need to provide "fresh" messages state variable on every render),
  // we have to use "once" instead of "on" to avoid registering another one listener on each effect firing.
  useEffect(() => {
    socket.current.once('chat message', (message) => {
      setMessages([...messages, message])
    })
  }, [messages])

  // Scrolling to bottom when new message appears
  useEffect(() => {
    const messagesRef = chatRoomMessagesRef.current
    if (messagesRef) { messagesRef.scrollTop = messagesRef.scrollHeight }
  }, [messages])

  function onCurrentMessageChange(event) {
    setCurrentMessage(event.target.value)
  }

  function onCurrentMessageSubmit(event) {
    event.preventDefault()
    if (!isCurrentMessageValid) return

    const newMessage = { value: currentMessage, timestamp: Date.now() }
    // Emitting new message for users-recipients
    const newMessageForRecipients = { type: 'foreign', username, ...newMessage }
    socket.current.emit('chat message', newMessageForRecipients)

    // Render new message for user-sender
    const newMessageForSender = { type: 'my', ...newMessage }
    setMessages([...messages, newMessageForSender])
    setCurrentMessage('')
  }


  const submitButtonClass = `button ${isCurrentMessageValid ? 'chat-room__submit-button' : 'chat-room__submit-button_hidden'}`

  return (
    <div className="column chat-room">
      <div className="row chat-room__header">
        <span className="chat-room__name">Global chat room</span>
      </div>

      <div className="column chat-room__messages" ref={chatRoomMessagesRef}>
        {
          messages.map((message, index) => {
            const { type, value, timestamp } = message
            return <Message key={index} type={type} username={message.username} value={value} timestamp={timestamp} />
          })
        }
      </div>

      <form className="row chat-room__input-form" onSubmit={onCurrentMessageSubmit}>
        <input value={currentMessage} onChange={onCurrentMessageChange} type="text" className="input chat-room__input" placeholder="Message" />
        <button className={submitButtonClass} type="submit">
          <FontAwesomeIcon icon="arrow-right" />
        </button>
      </form>
    </div>
  )
}

export default ChatRoom
