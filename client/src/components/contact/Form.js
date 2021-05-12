import React from 'react'
import axios from '../../config/axios.js'

export default class Form extends React.Component {
    constructor() {
        super()
        this.state = {
            email: '',
            subject: '',
            mobile: '',
            message: ''
        }
        this.formSubmit = this.formSubmit.bind(this)
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    formSubmit(e) {
        e.preventDefault()
        console.log('Message form submitted !')

        const formData = this.state
        console.log("formDate : ", formData)

        axios.post('/contactus', formData, {
            headers: {
                "x-auth": localStorage.getItem('token')
            }
        })
            .then(response => {
                if (response.data.errors) {
                    console.log('Validation Error : ', response.data.errors)
                    window.alert(response.data.message)
                }
                else {
                    console.log('success', response.data)
                    // this.props.history.push('/')
                    window.alert("Querry submitted successfully!")
                }
            })


    }

    render() {
        return (
            <form id="messageForm" onSubmit={(e) => { this.formSubmit(e) }}>
                <input className="Qurrie-form" onChange={this.handleChange} name="email" placeholder="Your Email" /><br />
                <input className="Qurrie-form" onChange={this.handleChange} name="subject" placeholder="Subject" /><br />
                <input className="Qurrie-form" onChange={this.handleChange} name="mobile" placeholder="Phone number" /><br />
                <textarea className="Qurrie-form" style={{ "height": "150px", "border": "2px solid #767676" }}
                    onChange={this.handleChange} name="message" placeholder="Message" /><br />
                <input id="sendMessage" type="submit" value="Send Message" />
            </form>

        )
    }
}