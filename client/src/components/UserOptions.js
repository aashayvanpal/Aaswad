import React from 'react'
import UserButton from "./UserButton.js";
import { getUserDetails } from '../assets/user-functions.js'


export default class UserOptions extends React.Component {
    constructor() {
        super()
        this.state = {
            showUserButton: false,
        }
    }

    componentDidMount() {
        getUserDetails()
            .then(res => {
                this.setState({ showUserButton: true })
            })

    }

    render() {
        return (
            <div>{this.state.showUserButton && <UserButton />}</div>
        )
    }
}