import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const USERS = [
  'USER 1',
  'USER 2',
  'USER 3',
]

function UserListDropdown(props) {
  const { handleMessagesOverlayToggle, handleMessagesOverlayOff } = props

  // Chat room users
  const [users, setUsers] = useState(USERS)
  const [isUserListVisible, setIsUserListVisible] = useState(false)

  function onDropdownClick() {
    setIsUserListVisible(!isUserListVisible)
    handleMessagesOverlayToggle()
  }

  function onDropdownBlur() {
    setIsUserListVisible(false)
    handleMessagesOverlayOff()
  }

  let usersListClass = 'user-list-dropdown__list'
  if (isUserListVisible) { usersListClass += ' user-list-dropdown__list_open' }

  const numberOfUsers = `${users.length} ${users.length === 1 ? 'user' : 'users'} online`

  return (
    <div className="row user-list-dropdown" role="button" tabIndex="0" onClick={onDropdownClick} onBlur={onDropdownBlur}>
      <div className="user-list-dropdown__quantity">{numberOfUsers}</div>
      <FontAwesomeIcon icon="angle-down" />

      <div className={usersListClass}>
        {
          users.map(user => <div className="user-list-dropdown__user">{user}</div>)
        }
      </div>
    </div>
  )
}

export default UserListDropdown
