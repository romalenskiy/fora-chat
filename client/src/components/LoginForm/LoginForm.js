import React, { useState, useEffect } from 'react'

function LoginForm(props) {
  const { username, onChange } = props

  return (
    <div className="row login-form">
      <form className="column login-form__form">
        <span className="login-form__input-description">USERNAME</span>
        <input value={username} onChange={onChange} type="text" className="input login-form__input" id="userName" />
        <button className="button login-form__submit-button" type="submit">
          Go chat!
        </button>
      </form>
    </div>
  )
}

export default LoginForm
