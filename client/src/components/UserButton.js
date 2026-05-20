import React, { useState, useEffect } from 'react'
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import axios from '../config/axios'
import { Link } from 'react-router-dom'
import anime from 'animejs'

import '../css/UserButton.css'
import profileImg from '../images/profile-icon.png'
import myOrdersImg from '../images/myOrders-icon.png'
import settingsImg from '../images/settings-icon.png'
import logoutImg from '../images/logout-icon.png'

const UserButton = (props) => {
  const [dropdownOpen, setOpen] = useState(false)

  const toggle = () => setOpen(!dropdownOpen)

  useEffect(() => {
    anime({ targets: '.user', translateX: [10, 0], easing: 'easeInOutSine', opacity: [0, 1], delay: 500 })
  }, [])

  const logout = () => {
    console.log('logout clicked!')
    axios.delete('/logout', {
      headers: { 'x-auth': localStorage.getItem('token') }
    })
      .then(response => {
        console.log('response after logout:', response.data.notice)
        localStorage.removeItem('cartItems')
        window.location.href = '/'
      })
      .catch(err => console.log(err))
  }

  return (
    <ButtonDropdown direction="left" isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle className="user" style={{ border: 'none', backgroundColor: '#dbc268' }} />
      <DropdownMenu>
        <DropdownItem id="dropdown-item" header>
          {props.userName}
        </DropdownItem>
        <Link style={{ textDecoration: 'none' }} to="/profile">
          <DropdownItem id="dropdown-item">
            <img src={profileImg} alt="" />
            Profile
          </DropdownItem>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/myOrders">
          <DropdownItem id="dropdown-item">
            <img src={myOrdersImg} alt="" />
            My Orders
          </DropdownItem>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/settings">
          <DropdownItem id="dropdown-item">
            <img src={settingsImg} alt="" />
            Settings
          </DropdownItem>
        </Link>
        <DropdownItem divider />
        <DropdownItem id="dropdown-item" onClick={logout}>
          <img src={logoutImg} alt="" height="20px" width="20px" />
          Logout
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  )
}

export default UserButton
