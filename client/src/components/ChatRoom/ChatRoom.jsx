import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Message from '../Message'
import Stickers from '../Stickers'
import UserListDropdown from '../UserListDropdown'
import useControlledInput from '../../customHooks/useControlledInput'
import useAutofocus from '../../customHooks/useAutofocus'

function ChatRoom(props) {
  const { username, match } = props
  const { roomId } = match.params

  // Ref for socket
  const socket = useRef()

  // Need for auto scrolling when new message appears
  const chatRoomMessagesRef = useRef()

  // Ref for message input autofocus
  const currentMessageRef = useRef()
  useAutofocus(currentMessageRef)

  // Ref with information of header height for user list positioning
  const headerRef = useRef()

  // User-entered message at the moment
  const [currentMessage, setCurrentMessage, isCurrentMessageValid] = useControlledInput()

  // All chat room messages
  const [messages, setMessages] = useState([])

  // Chat overlay (blackout then dorpdown with user list opened)
  const [isMessagesOverlayOn, setIsMessagesOverlayOn] = useState(false)

  // Chat room users
  const [users, setUsers] = useState([])

  // Connect user to socket on component first render (and disconnecting on cleanup)
  useEffect(() => {
    socket.current = io('/', { query: { roomId } })

    return () => {
      socket.current.disconnect()
    }
  }, [roomId])

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
  }, [username])

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

    const newMessage = { value: currentMessage, timestamp: Date.now(), isSticker: false }

    // Emit new message for users-recipients
    const newMessageForRecipients = { type: 'foreign', username, ...newMessage }
    socket.current.emit('chat message', newMessageForRecipients)

    // Render new message for user-sender
    const newMessageForSender = { type: 'my', ...newMessage }
    setMessages([...messages, newMessageForSender])
    setCurrentMessage('')

    socket.current.emit('user stopped typing', username)
    clearTimeout(typingTimeout.current)
  }

  function handleMessagesOverlayToggle() {
    setIsMessagesOverlayOn(!isMessagesOverlayOn)
  }

  function handleMessagesOverlayOff() {
    setIsMessagesOverlayOn(false)
  }

  // Send sticker
  const sendSticker = (sticker) => {
    const newMessage = { value: sticker, timestamp: Date.now(), isSticker: true }

    // Emit new message for users-recipients
    const newMessageForRecipients = { type: 'foreign', username, ...newMessage }
    socket.current.emit('chat message', newMessageForRecipients)

    // Render new message for user-sender
    const newMessageForSender = { type: 'my', ...newMessage }
    setMessages([...messages, newMessageForSender])
  }

  // Show typing users
  const typingTimeout = useRef(null)
  useEffect(() => {
    if (!currentMessage) return

    socket.current.emit('user started typing', username)

    clearTimeout(typingTimeout.current)

    const userStoppedTyping = () => {
      socket.current.emit('user stopped typing', username)
    }
    typingTimeout.current = setTimeout(userStoppedTyping, 5000)
  }, [currentMessage, username])

  const [typingUsers, setTypingUsers] = useState([])
  useEffect(() => {
    socket.current.on('add typing user', (newTypingUser) => {
      if (!typingUsers.includes(newTypingUser)) {
        typingUsers.push(newTypingUser)
        setTypingUsers([...typingUsers])
      }
    })
    socket.current.on('delete typing user', (newTypingUser) => {
      typingUsers.splice(typingUsers.indexOf(newTypingUser), 1)
      setTypingUsers([...typingUsers])
    })
  }, [typingUsers])

  useEffect(() => {
    const currentUsers = users.map(user => user.username)
    typingUsers.map((typingUser) => {
      if (!currentUsers.includes(typingUser)) {
        typingUsers.splice(typingUsers.indexOf(typingUser), 1)
        setTypingUsers([...typingUsers])
      }
    })
  }, [typingUsers, users])

  const currentTypingUsers = `${typingUsers.join(', ')} ${typingUsers.length === 1 ? 'is' : 'are'} typing`

  // Hide submit button, if message is invalid
  const submitButtonClass = `button ${isCurrentMessageValid ? 'chat-room__submit-button' : 'chat-room__submit-button_hidden'}`

  // Add a darkening overlay, then user list opened
  let messagesOverlayClass = 'overlay'
  if (isMessagesOverlayOn) { messagesOverlayClass += ' overlay_on' }

  return (
    <div className="column chat-room">
      {/* Header with user list and online users counter */}
      <div className="row chat-room__header" ref={headerRef}>
        <UserListDropdown users={users} handleMessagesOverlayToggle={handleMessagesOverlayToggle} handleMessagesOverlayOff={handleMessagesOverlayOff} headerRef={headerRef} />
        {Boolean(typingUsers.length) && (
          <div className="chat-room__headerTypingUsers">
            {currentTypingUsers}
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="column chat-room__messages" ref={chatRoomMessagesRef}>
        <div className={messagesOverlayClass} />
        { // Need to change source for "key" property if the message delete feature will be introduced
          messages.map((message, index) => {
            const {
              type, value, timestamp, isSticker,
            } = message
            return <Message key={index} type={type} username={message.username} value={value} timestamp={timestamp} isSticker={isSticker} />
          })
        }
      </div>

      {/* Input new messages */}
      <form className="row chat-room__input-form" onSubmit={onCurrentMessageSubmit}>
        <input value={currentMessage} ref={currentMessageRef} onChange={onCurrentMessageChange} type="text" className="input chat-room__input" placeholder="Message" />
        <Stickers sendSticker={sendSticker} />
        <button className={submitButtonClass} type="submit">
          <FontAwesomeIcon icon="arrow-right" />
        </button>
      </form>
    </div>
  )
}

export default ChatRoom
