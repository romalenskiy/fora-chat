import React, { useState, useEffect } from 'react'
import logo from './logo.svg'
import './App.css'

function App() {
  const [test, setTest] = useState('')

  async function connectToServer() {
    try {
      const data = await fetch('/api/test')
      const text = await data.text()
      setTest(text)
    } catch (error) {
      setTest(error)
    }
  }

  useEffect(() => {
    connectToServer()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {test}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
