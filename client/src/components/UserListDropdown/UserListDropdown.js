import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function UserListDropdown(props) {
  const { users, handleMessagesOverlayToggle, handleMessagesOverlayOff } = props

  // Chat room user list
  const [isUserListVisible, setIsUserListVisible] = useState(false)

  // Open dropdown and adding messages overlay on trigger click
  function onDropdownClick() {
    setIsUserListVisible(!isUserListVisible)
    handleMessagesOverlayToggle()
  }

  // Close dropdown when focus lost
  function onDropdownBlur() {
    setIsUserListVisible(false)
    handleMessagesOverlayOff()
  }

  let usersListClass = 'user-list-dropdown__list'
  if (isUserListVisible) { usersListClass += ' user-list-dropdown__list_open' }

  // Different word ending depending on number of users in the chat room
  const numberOfUsers = `${users.length} ${users.length === 1 ? 'user' : 'users'} online`

  return (
    <div className="row user-list-dropdown" role="button" tabIndex="0" onClick={onDropdownClick} onBlur={onDropdownBlur}>
      <div className="user-list-dropdown__quantity">{numberOfUsers}</div>
      <FontAwesomeIcon icon="angle-down" />

      <div className={usersListClass}>
        {
          users.length && users.map((user) => {
            const { id, username } = user
            return <div key={id} className="user-list-dropdown__user">{username}</div>
          })
        }
      </div>
    </div>
  )
}

export default UserListDropdown