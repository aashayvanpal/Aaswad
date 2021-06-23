//User type is not required 

import React from 'react'
// import axios from '../config/axios.js'
import { getUserDetails, test } from '../assets/user-functions.js'

export default class UserProfile extends React.Component {
    constructor() {
        super()
        this.state = {
            username: '',
            userType: '',
            phonenumber: '',

        }
    }

    componentDidMount() {
        getUserDetails()
            .then(res => {
                console.log("user data inside component did mount :", res)
                this.setState({
                    username: res.username,
                    userType: res.userType,
                    email: res.email,
                    phonenumber: res.phonenumber

                })

            })
            .catch(err => {
                console.log(err)
                window.alert('Please login ,you will be redirected')
                window.location.href='/signin'
            })

    }

    render() {
        return (
            <div>
                <h1>Name:{this.state.username}</h1>
                <h1>UserType:{this.state.userType}</h1>
                <h1>email:{this.state.email}</h1>
                <h1>phonenumber:{this.state.phonenumber}</h1>
            </div>
        )
    }
}

