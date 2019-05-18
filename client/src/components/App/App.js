import React, { useState, Fragment } from 'react'
import { withRouter, Route } from 'react-router-dom'

import LoginForm from '../LoginForm'
import ChatRoom from '../ChatRoom'

import useInputControl from '../../customHooks/useInputControl'

function App(props) {
  const { history } = props

  const [username, setUsername, isUsernameValid] = useInputControl()
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false)

  function onUsernameChange(event) {
    setUsername(event.target.value)
  }

  function onUsernameSubmit(event) {
    event.preventDefault()
    if (!isUsernameValid) return

    setIsUsernameSubmitted(true)

    if (history.location.pathname === '/') {
      (async () => {
        const response = await fetch('/api/generateRoomId')
        const newRoomId = await response.text()
        history.push(`/rooms/${newRoomId}`)
      })()
    }
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
        path="/rooms/:roomId"
        render={properties => (
          isUsernameSubmitted
            ? <ChatRoom {...properties} username={username} />
            : (
              <Fragment>
                <span className="row logo">Fora Chat</span>
                <LoginForm username={username} isUsernameValid={isUsernameValid} onChange={onUsernameChange} onSubmit={onUsernameSubmit} />
              </Fragment>
            )
        )}
      />
    </div>
  )
}

export default withRouter(App)
