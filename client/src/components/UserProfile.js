//User type is not required 

import React, { useState, useEffect } from 'react'
import heroUser from '../images/heroUser.svg'
import { getUserDetails } from '../assets/user-functions.js'
import "../css/profile.css"
const UserProfile = () => {

    const [username, setUserName] = useState('')
    const [userType, setUserType] = useState('')
    const [phonenumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        getUserDetails()
            .then(res => {
                console.log("user data inside component did mount :", res)

                setUserName(res.username)
                setUserType(res.userType)
                setEmail(res.email)
                setPhoneNumber(res.phonenumber)
                setAddress(res.address)

            })
            .catch(err => {
                console.log(err)
                window.alert('Please login ,you will be redirected')
                window.location.href = '/signin'
            })

    }, [])

    return (
        <div id="profile-container">
            <div id="profile-Overlap">
                <img src={heroUser} alt="" style={{
                    "display": "block",
                    "marginLeft": "auto",
                    "marginRight": "auto",
                    "height": "100px",
                }} />
                <h2 style={{
                    "textAlign": "center"
                }}
                >{username}</h2>

            </div>

            <div id="profile-inner-container">
                <div id="profileDiv">
                    <table >
                        <tbody>
                            {/* <tr>
                                <td style={{ "padding": "10px" }}>UserType</td>
                                <td style={{ "padding": "10px" }}>{this.state.userType}</td>
                            </tr> */}
                            <tr style={{ "width": "100%" }}>
                                <td style={{ "padding": "10px" }}>Email</td>
                                <td style={{ "padding": "10px" }}>{email}</td>
                            </tr>
                            <tr>
                                <td style={{ "padding": "10px" }}>Phone Number</td>
                                <td style={{ "padding": "10px" }}>{phonenumber}</td>
                            </tr>
                            <tr>
                                <td style={{ "padding": "10px" }}>Address</td>
                                <td style={{ "padding": "10px" }}>{address}</td>
                                <td style={{ "padding": "10px", "maxWidth": "50px" }}></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button style={{
                    "display": "block",
                    "margin": "10px auto",
                    "padding": "10px 40px",
                    "borderRadius": "10px",
                    "fontSize": "20px",
                    "fontWeight": "bold",
                    "cursor": "pointer",
                    "backgroundColor": "#ff881a",
                    "boxShadow": "0px 4px 4px rgba(0, 0, 0, 0.25)"

                }}>Change Password</button>
            </div>
            <h5 id="footer-style">
                © Copyrights Reserved 2021
            </h5>
        </div>
    )
}

export default UserProfile