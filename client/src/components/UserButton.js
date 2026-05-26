import React, { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import axios from '../config/axios'
import { Link } from 'react-router-dom'

const UserButton = ({ userName }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleOpen = (e) => setAnchorEl(e.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const logout = () => {
    handleClose()
    axios.delete('/logout', { headers: { 'x-auth': localStorage.getItem('token') } })
      .then(() => {
        localStorage.removeItem('cartItems')
        window.location.href = '/'
      })
      .catch(err => console.error('[UserButton] logout error', err))
  }

  const initial = userName ? userName.charAt(0).toUpperCase() : '?'

  const menuItemSx = {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.82rem',
    py: 1,
    px: 2,
    gap: 1.5,
    '&:hover': { bgcolor: 'rgba(201,162,39,0.1)', color: '#C9A227' },
    '& .MuiListItemIcon-root': { minWidth: 'unset', color: 'inherit' },
    transition: 'all 0.13s ease',
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        size="small"
        sx={{
          p: 0,
          '&:hover .user-avatar': { boxShadow: '0 0 0 2px #C9A227' },
        }}
      >
        <Avatar
          className="user-avatar"
          sx={{
            width: 32,
            height: 32,
            bgcolor: open ? '#C9A227' : 'rgba(201,162,39,0.15)',
            color: open ? '#1a1400' : '#C9A227',
            fontSize: '0.82rem',
            fontWeight: 800,
            border: '1.5px solid rgba(201,162,39,0.45)',
            transition: 'all 0.15s ease',
            letterSpacing: 0.5,
          }}
        >
          {initial}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              bgcolor: '#1a1800',
              border: '1px solid rgba(201,162,39,0.25)',
              borderRadius: '10px',
              minWidth: 180,
              mt: 0.75,
              boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
              overflow: 'visible',
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: -6,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: '#1a1800',
                border: '1px solid rgba(201,162,39,0.25)',
                borderRight: 'none',
                borderBottom: 'none',
                transform: 'rotate(45deg)',
              },
            },
          },
        }}
      >
        <MenuItem disabled sx={{ color: '#C9A227', fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', opacity: '1 !important', py: 0.75, px: 2 }}>
          {userName}
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(201,162,39,0.15)', my: 0.25 }} />

        <MenuItem component={Link} to="/profile" onClick={handleClose} sx={menuItemSx}>
          <ListItemIcon><Person2OutlinedIcon sx={{ fontSize: '1rem' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.82rem' }}>Profile</ListItemText>
        </MenuItem>

        <MenuItem component={Link} to="/myOrders" onClick={handleClose} sx={menuItemSx}>
          <ListItemIcon><ReceiptLongIcon sx={{ fontSize: '1rem' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.82rem' }}>My Orders</ListItemText>
        </MenuItem>

        <MenuItem component={Link} to="/settings" onClick={handleClose} sx={menuItemSx}>
          <ListItemIcon><SettingsOutlinedIcon sx={{ fontSize: '1rem' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.82rem' }}>Settings</ListItemText>
        </MenuItem>

        <Divider sx={{ borderColor: 'rgba(201,162,39,0.15)', my: 0.25 }} />

        <MenuItem onClick={logout} sx={{ ...menuItemSx, color: 'rgba(255,100,100,0.75)', '&:hover': { bgcolor: 'rgba(255,60,60,0.08)', color: '#ff6b6b' } }}>
          <ListItemIcon><LogoutIcon sx={{ fontSize: '1rem' }} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: '0.82rem' }}>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

export default UserButton
