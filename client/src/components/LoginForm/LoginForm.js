import React from 'react'

function LoginForm(props) {
  const { username, isUsernameValid, onChange, onSubmit } = props

  const submitButtonClass = `button ${isUsernameValid ? 'login-form__submit-button' : 'login-form__submit-button_disabled'}`

  return (
    <div className="row login-form" onSubmit={onSubmit}>
      <form className="column login-form__form">
        <span className="login-form__input-description">USERNAME</span>
        <input value={username} onChange={onChange} type="text" className="input login-form__input" id="userName" autoComplete="off" />
        <button className={submitButtonClass} type="submit">
          Go chat!
        </button>
      </form>
    </div>
  )
}

export default LoginForm
