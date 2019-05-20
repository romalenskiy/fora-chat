import React, { Fragment } from 'react'

import LoginForm from './LoginForm'

function LoginPage(props) {
  return (
    <Fragment>
      <div className="row logo">Fora Chat</div>
      <LoginForm {...props} />
    </Fragment>
  )
}

export default LoginPage
