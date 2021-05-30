//User type is not required 

import React from 'react'
import axios from '../config/axios.js'

export default class UserProfile extends React.Component {
    constructor() {
        super()
        this.state = {
            username: '',
            userType: '',

        }
    }

    componentDidMount() {
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log("user data :", dataRequest)
                this.setState({
                    username: dataRequest.data.username,
                    userType: dataRequest.data.userType,
                    email: dataRequest.data.email

                })
            })
            .catch(err => console.log(err))
    }

    render() {
        return (
            <div>
                <h1>Name:{this.state.username}</h1>
                <h1>UserType:{this.state.userType}</h1>
                <h1>email:{this.state.email}</h1>
            </div>
        )
    }
}

