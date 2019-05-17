import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Message from '../Message'
import useInputControl from '../../customHooks/useInputControl'

const MESSAGES = [
  { type: 'my', value: 'Fugiat qui ipsum labore et aliquip ad ipsum qui sit nulla non.' },
  { type: 'my', value: 'Qui nisi quis cupidatat dolor enim sunt dolore culpa exercitation minim. Nostrud eiusmod anim cupidatat fugiat.' },
  { type: 'my', value: 'Amet laboris anim exercitation sunt dolor. Labore consequat deserunt do incididunt labore tempor culpa minim nisi officia. Sint laborum laborum eiusmod minim officia anim in fugiat aute. Duis enim irure ut ea amet ut reprehenderit.' },
  { type: 'foreign', username: 'User 1', value: 'In consequat commodo nulla ipsum irure commodo tempor enim.' },
  { type: 'foreign', username: 'User 2', value: 'Quis est incididunt id do sint anim proident sunt. Fugiat dolore fugiat do cupidatat.' },
  { type: 'foreign', username: 'User 3', value: 'Enim Lorem commodo cupidatat sit. Nulla dolor magna aute ea labore proident nostrud ad culpa culpa. Ex dolor qui officia deserunt laborum mollit velit culpa ipsum mollit laborum laboris. Est consequat nisi nostrud ad non cupidatat laborum tempor tempor.' },
]

function ChatRoom() {
  const socket = useRef()
  const chatRoomMessagesRef = useRef()
  const [currentMessage, setCurrentMessage, isCurrentMessageValid] = useInputControl()
  const [messages, setMessages] = useState(MESSAGES)

  // Connecting use to socket on component first render (and disconnecting on cleanup)
  useEffect(() => {
    socket.current = io('http://localhost:5000')

    return () => {
      socket.current.disconnect()
    }
  }, [])

  // Adding listener on new message receive.
  // Because of subtlety in work of useEffect hook (need to provide "fresh" messages state variable on every render),
  // we have to use "once" instead of "on" to avoid registering another one listener on each effect firing.
  useEffect(() => {
    socket.current.once('chat message', (message) => {
      setMessages([...messages, { type: 'foreign', username: 'User', value: message }])
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

    socket.current.emit('chat message', currentMessage)

    const newMessage = { type: 'my', value: currentMessage }
    setMessages([...messages, newMessage])
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
            const { type, username, value } = message
            return <Message key={index} type={type} username={username} value={value} />
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
