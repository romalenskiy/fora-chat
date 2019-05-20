import React, { useState } from 'react'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'

import LoginPage from '../LoginPage'
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

  const loginPageProps = {
    username,
    isUsernameValid,
    onChange: onUsernameChange,
    onSubmit: onUsernameSubmit,
  }

  return (
    <div className="column app">
      <Switch>
        <Route
          exact
          path="/"
          render={() => <LoginPage {...loginPageProps} />}
        />

        <Route
          path="/rooms/:roomId"
          render={properties => (isUsernameSubmitted ? <ChatRoom {...properties} username={username} /> : <LoginPage {...loginPageProps} />)}
        />

        <Route
          path="*"
          render={() => <Redirect to="/" />}
        />
      </Switch>
    </div>
  )
}

export default withRouter(App)
