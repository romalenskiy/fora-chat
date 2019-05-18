import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Message from '../Message'
import UserListDropdown from '../UserListDropdown'
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

  // Chat overlay (blackout then dorpdown with users open)
  const [isMessagesOverlayOn, setIsMessagesOverlayOn] = useState(false)

  // Chat room users
  const [users, setUsers] = useState([])

  // Connect user to socket on component first render (and disconnecting on cleanup)
  useEffect(() => {
    socket.current = io()

    return () => {
      socket.current.disconnect()
    }
  }, [])

  useEffect(() => {
    // Emit data about newly connected user to other users
    socket.current.emit('user connected chat room', username)

    // Add listener on new users connected
    socket.current.on('user connected chat room', (newUserList) => {
      setUsers(newUserList)
    })

    // Add listener on user disconnected
    socket.current.on('user disconnected chat room', (newUserList) => {
      setUsers(newUserList)
    })
  }, [])

  // Add listener on new message receive.
  // Because of subtlety in work of useEffect hook (need to provide "fresh" messages state variable on every render),
  // we have to use "once" instead of "on" to avoid registering another one listener on each effect firing.
  useEffect(() => {
    socket.current.once('chat message', (message) => {
      setMessages([...messages, message])
    })
  }, [messages])

  // Scroll to bottom when new message appears
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

    // Emit new message for users-recipients
    const newMessageForRecipients = { type: 'foreign', username, ...newMessage }
    socket.current.emit('chat message', newMessageForRecipients)

    // Render new message for user-sender
    const newMessageForSender = { type: 'my', ...newMessage }
    setMessages([...messages, newMessageForSender])
    setCurrentMessage('')
  }

  function handleMessagesOverlayToggle() {
    setIsMessagesOverlayOn(!isMessagesOverlayOn)
  }

  function handleMessagesOverlayOff() {
    setIsMessagesOverlayOn(false)
  }

  const submitButtonClass = `button ${isCurrentMessageValid ? 'chat-room__submit-button' : 'chat-room__submit-button_hidden'}`
  let messagesOverlayClass = 'overlay'
  if (isMessagesOverlayOn) { messagesOverlayClass += ' overlay_on' }

  return (
    <div className="column chat-room">
      <div className="row chat-room__header">
        <UserListDropdown users={users} handleMessagesOverlayToggle={handleMessagesOverlayToggle} handleMessagesOverlayOff={handleMessagesOverlayOff} />
      </div>

      <div className="column chat-room__messages" ref={chatRoomMessagesRef}>
        <div className={messagesOverlayClass} />
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
