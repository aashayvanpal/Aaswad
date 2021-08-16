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
        <DropdownItem style={{
          "color": "green",
          "fontWeight": "bold",
          "textAlign": "center",
          "fontSize": "22px",
          "padding": "10px"

        }} header>
          {props.userName}
        </DropdownItem>
        {/* <DropdownItem style={{
          "color": "green",
          "fontWeight": "bold",
          "textAlign": "center",
          "fontSize": "22px"
        }} disabled>
          Action
        </DropdownItem>
        <DropdownItem style={{
          "color": "green",
          "fontWeight": "bold",
          "textAlign": "center",
          "fontSize": "22px"
        }} >Another
          Action
        </DropdownItem> */}
        <Link style={{ "textDecoration": "none" }} to="/profile"><DropdownItem style={{
          "color": "green",
          "fontWeight": "bold",
          "textAlign": "center",
          "fontSize": "22px",
          "cursor": "pointer",
          "padding": "10px"
        }}  >Profile</DropdownItem></Link>
        <Link style={{ "textDecoration": "none" }} to="/myOrders"><DropdownItem style={{
          "color": "green",
          "fontWeight": "bold",
          "textAlign": "center",
          "fontSize": "22px",
          "cursor": "pointer",
          "padding": "10px"
        }}> My Orders</DropdownItem></Link>
        <Link style={{ "textDecoration": "none" }} to="/settings"><DropdownItem style={{
          "color": "green",
          "fontWeight": "bold",
          "textAlign": "center",
          "fontSize": "22px",
          "cursor": "pointer",
          "padding": "10px"
        }}>Settings</DropdownItem></Link>
        <DropdownItem divider />
        <DropdownItem style={{
          "color": "green",
          "fontWeight": "bold",
          "textAlign": "center",
          "fontSize": "22px",
          "cursor": "pointer",
          "padding": "10px"
        }} onClick={logout}>Logout</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
}

export default withRouter(UserButton)
