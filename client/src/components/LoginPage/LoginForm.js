import React, { useRef } from 'react'

import useAutofocus from '../../customHooks/useAutofocus'

function LoginForm(props) {
  const { username, isUsernameValid, onChange, onSubmit } = props

  // Autofocus input on render
  const userNameInput = useRef()
  useAutofocus(userNameInput)

  // Disable submit button at the invalid username
  const submitButtonClass = `button ${isUsernameValid ? 'login-form__submit-button' : 'login-form__submit-button_disabled'}`

  return (
    <div className="row login-form" onSubmit={onSubmit}>

      <form className="column login-form__form">
        <span className="login-form__input-description">USERNAME</span>

        <input value={username} onChange={onChange} type="text" className="input login-form__input" ref={userNameInput} autoComplete="off" />

        <button className={submitButtonClass} type="submit">
          Go chat!
        </button>
      </form>

    </div>
  )
}

export default LoginForm
