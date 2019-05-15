import React, { useState, useEffect } from 'react'
import LoginForm from '../LoginForm'

function App() {
  const [username, setUsername] = useState('')

  function onUsernameChange(event) {
    setUsername(event.target.value)
  }

  return (
    <div className="column app">
      <span className="row logo">Fora Chat</span>
      <LoginForm username={username} onChange={onUsernameChange} />
    </div>
  )
}

export default App
