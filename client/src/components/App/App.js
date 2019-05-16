import React, { Fragment, useState, useEffect, useRef } from 'react'
import { withRouter, Route, Redirect } from 'react-router-dom'

import LoginForm from '../LoginForm'
import ChatRoom from '../ChatRoom'

import useInputControl from '../../customHooks/useInputControl'

const MESSAGES = [
  { type: 'my', value: 'Fugiat qui ipsum labore et aliquip ad ipsum qui sit nulla non.' },
  { type: 'my', value: 'Qui nisi quis cupidatat dolor enim sunt dolore culpa exercitation minim. Nostrud eiusmod anim cupidatat fugiat.' },
  { type: 'my', value: 'Amet laboris anim exercitation sunt dolor. Labore consequat deserunt do incididunt labore tempor culpa minim nisi officia. Sint laborum laborum eiusmod minim officia anim in fugiat aute. Duis enim irure ut ea amet ut reprehenderit.' },
  { type: 'foreign', username: 'User 1', value: 'In consequat commodo nulla ipsum irure commodo tempor enim.' },
  { type: 'foreign', username: 'User 2', value: 'Quis est incididunt id do sint anim proident sunt. Fugiat dolore fugiat do cupidatat.' },
  { type: 'foreign', username: 'User 3', value: 'Enim Lorem commodo cupidatat sit. Nulla dolor magna aute ea labore proident nostrud ad culpa culpa. Ex dolor qui officia deserunt laborum mollit velit culpa ipsum mollit laborum laboris. Est consequat nisi nostrud ad non cupidatat laborum tempor tempor.' },
]

function App(props) {
  const chatRoomMessagesRef = useRef()
  const [username, setUsername, isUsernameValid] = useInputControl()
  const [currentMessage, setCurrentMessage, isCurrentMessageValid] = useInputControl()
  const [messages, setMessages] = useState(MESSAGES)

  useEffect(() => {
    const messagesRef = chatRoomMessagesRef.current
    if (messagesRef) { messagesRef.scrollTop = messagesRef.scrollHeight }
  }, [messages])

  function onUsernameChange(event) {
    setUsername(event.target.value)
  }

  function onUsernameSubmit(event)  {
    event.preventDefault()
    if (!isUsernameValid) return
    props.history.push('/global')
  }

  function onCurrentMessageChange(event) {
    setCurrentMessage(event.target.value)
  }

  function onCurrentMessageSubmit(event) {
    event.preventDefault()
    if (!isCurrentMessageValid) return

    const newMessage = { type: 'my', value: currentMessage }
    setMessages([...messages, newMessage])
    setCurrentMessage('')
  }

  return (
    <div className="column app">
      <Route
        exact
        path="/"
        render={() => (
          <Fragment>
            <span className="row logo">Fora Chat</span>
            <LoginForm username={username} isUsernameValid={isUsernameValid} onChange={onUsernameChange} onSubmit={onUsernameSubmit} />
          </Fragment>
        )}
      />

      <Route
        path="/global"
        render={() => (isUsernameValid ? <ChatRoom messages={messages} currentMessage={currentMessage} chatRoomMessagesRef={chatRoomMessagesRef} isCurrentMessageValid={isCurrentMessageValid} onChange={onCurrentMessageChange} onSubmit={onCurrentMessageSubmit} /> : <Redirect to="/" />)}
      />
    </div>
  )
}

export default withRouter(App)
