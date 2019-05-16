import React, { Fragment } from 'react'
import { withRouter, Route, Redirect } from 'react-router-dom'

import LoginForm from '../LoginForm'
import ChatRoom from '../ChatRoom'

import useInputControl from '../../customHooks/useInputControl'

function App(props) {
  const [username, setUsername, isUsernameValid] = useInputControl()
  const [currentMessage, setCurrentMessage, isCurrentMessageValid] = useInputControl()

  function onUsernameChange(event) {
    setUsername(event.target.value)
  }

  function onUsernameSubmit(event) {
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
        render={() => (isUsernameValid ? <ChatRoom currentMessage={currentMessage} isCurrentMessageValid={isCurrentMessageValid} onChange={onCurrentMessageChange} onSubmit={onCurrentMessageSubmit} /> : <Redirect to="/" />)}
      />
    </div>
  )
}

export default withRouter(App)
