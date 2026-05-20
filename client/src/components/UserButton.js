import React, { useState, useEffect } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MuiButton from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import axios from '../config/axios'
import { Link } from 'react-router-dom'
import anime from 'animejs'

import '../css/UserButton.css'
import profileImg from '../images/profile-icon.png'
import myOrdersImg from '../images/myOrders-icon.png'
import settingsImg from '../images/settings-icon.png'
import logoutImg from '../images/logout-icon.png'

const UserButton = (props) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  useEffect(() => {
    anime({ targets: '.user', translateX: [10, 0], easing: 'easeInOutSine', opacity: [0, 1], delay: 500 })
  }, [])

  const logout = () => {
    handleClose()
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
    <>
      <MuiButton
        className="user"
        onClick={handleOpen}
        style={{ border: 'none', backgroundColor: '#dbc268', minWidth: 0 }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem disabled id="dropdown-item">
          {props.userName}
        </MenuItem>
        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/profile">
          <MenuItem id="dropdown-item" onClick={handleClose}>
            <img src={profileImg} alt="" />
            &nbsp;Profile
          </MenuItem>
        </Link>
        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/myOrders">
          <MenuItem id="dropdown-item" onClick={handleClose}>
            <img src={myOrdersImg} alt="" />
            &nbsp;My Orders
          </MenuItem>
        </Link>
        <Link style={{ textDecoration: 'none', color: 'inherit' }} to="/settings">
          <MenuItem id="dropdown-item" onClick={handleClose}>
            <img src={settingsImg} alt="" />
            &nbsp;Settings
          </MenuItem>
        </Link>
        <Divider />
        <MenuItem id="dropdown-item" onClick={logout}>
          <img src={logoutImg} alt="" height="20px" width="20px" />
          &nbsp;Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserButton
