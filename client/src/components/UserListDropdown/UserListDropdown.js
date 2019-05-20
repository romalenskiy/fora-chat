import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withResizeDetector } from 'react-resize-detector'

function UserListDropdown(props) {
  const { height, users, handleMessagesOverlayToggle, handleMessagesOverlayOff, headerRef } = props

  // Chat room user list
  const [isUserListVisible, setIsUserListVisible] = useState(false)

  // Change top position of user list depending on chat header size, when window resize event triggers
  const [userListTop, setUserListTop] = useState(0)
  useEffect(() => {
    const headerHeight = Math.floor(headerRef.current.getBoundingClientRect().height)
    setUserListTop(headerHeight)
  }, [height])

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

  const userListStyle = { top: userListTop }
  let usersListClass = 'user-list-dropdown__list'
  if (isUserListVisible) { usersListClass += ' user-list-dropdown__list_open' }

  // Different word ending depending on number of users in the chat room
  const numberOfUsers = `${users.length} ${users.length === 1 ? 'user' : 'users'} online`

  return (
    <div className="row user-list-dropdown" role="button" tabIndex="0" onClick={onDropdownClick} onBlur={onDropdownBlur}>
      <div className="user-list-dropdown__quantity">{numberOfUsers}</div>
      <FontAwesomeIcon icon="angle-down" />

      <div className={usersListClass} style={userListStyle}>
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

export default withResizeDetector(UserListDropdown)