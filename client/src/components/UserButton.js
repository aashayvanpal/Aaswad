import React, { useState } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import axios from '../config/axios';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import ReactAnime from 'react-animejs'
const { Anime, stagger } = ReactAnime

const UserButton = (props) => {

  const [dropdownOpen, setOpen] = useState(false);

  const toggle = () => setOpen(!dropdownOpen);

  const logout = () => {
    // Logout axios delete for /logout api goes here 
    console.log("logout clicked !")
    // console.log('username :',localStorage.getItem('username'))

    axios.delete('/logout', {
      headers: { 'x-auth': localStorage.getItem('token') }
    })
      .then((response) => {
        // console.log("response after logout :", response)
        console.log("response after logout :", response.data.notice)
        // props.history.push("/")
        window.location.href = '/'
      })
      .catch(err => { console.log(err) })
    // window.alert('you have logged out successfully!')

  }

  return (
    <ButtonDropdown direction="left" isOpen={dropdownOpen} toggle={toggle}>
      <Anime
        initial={[
          {
            targets: ".user",
            translateX: [10, 0],
            easing: "easeInOutSine",
            opacity: [0, 1],
            delay: 500
          }
        ]}
      >
        <DropdownToggle className="user" style={{ "border": "none", "backgroundColor": "#dbc268" }} />
      </Anime>
      <DropdownMenu>
        <DropdownItem header>Username</DropdownItem>
        <DropdownItem disabled>Action</DropdownItem>
        <DropdownItem>Another Action</DropdownItem>
        <DropdownItem><Link to="/profile">Profile</Link></DropdownItem>
        <DropdownItem><Link to="/myOrders">My Orders</Link></DropdownItem>
        <DropdownItem><Link to="/settings">Settings</Link></DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={logout}>Logout</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
}

export default withRouter(UserButton)
