import React, { useState } from 'react'
import { withRouter, Route, Redirect, Switch } from 'react-router-dom'

import LoginPage from '../LoginPage'
import ChatRoom from '../ChatRoom'

import useInputControl from '../../customHooks/useInputControl'

function App(props) {
  const { history } = props

  const [username, setUsername, isUsernameValid] = useInputControl()
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  function onUsernameChange(event) {
    setUsername(event.target.value)
  }

  function onUsernameSubmit(event) {
    event.preventDefault()
    if (!isUsernameValid) return

    setIsUsernameSubmitted(true)

    if (history.location.pathname === '/') {
      (async () => {
        try {
          const response = await fetch('/api/generateRoomId')
          if (response.ok) {
            const newRoomId = await response.text()
            history.push(`/rooms/${newRoomId}`)
            setErrorMessage('')
          } else {
            setErrorMessage('Error :( Try to reload page!')
          }
        } catch (error) {
          setErrorMessage(`Internal server error: ${error}`)
        }
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
      {errorMessage && <div className="row error">{errorMessage}</div>}

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
