import React from 'react'
import axios from '../../config/axios.js'

export default class Form extends React.Component {
    constructor() {
        super()
        this.state = {
            email: '',
            emailError: '',
            subject: '',
            subjectError: '',
            mobile: '',
            mobileError: '',
            message: '',
            messageError: ''
        }
        this.formSubmit = this.formSubmit.bind(this)
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    validate() {
        let emailError, subjectError, mobileError, messageError = ''
        // let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


        if (!this.state.email.includes('@')) {
            emailError = "Error: The email address should contain @ symbol"
        }

        if (this.state.mobile.toString().length !== 10) {
            mobileError = "Error: There must be 10 digits in your number !"
        }

        if (this.state.email.length === 0) {
            emailError = "Error: The email cannot be left blank "

        }
        if (this.state.subject.length === 0) {
            subjectError = "Error: The subject cannot be left blank "

        }
        if (this.state.mobile.length === 0) {
            mobileError = "Error: The mobile number cannot be left blank "

        }
        if (this.state.message.length === 0) {
            messageError = "Error: The message cannot be left blank "

        }

        if (emailError || subjectError || mobileError || messageError) {
            this.setState({ emailError, subjectError, mobileError, messageError })
            return false
        }

        return true

    }

    formSubmit(e) {
        e.preventDefault()
        console.log('cliked on send message !')

        // validation for form
        const isValid = this.validate()

        if (isValid) {
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


    }

    render() {
        return (
            <form id="messageForm" onSubmit={(e) => { this.formSubmit(e) }}>
                <input className="Qurrie-form" onChange={this.handleChange} name="email" placeholder="Your Email" /><br />
                {this.state.emailError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.emailError}</div>) : null}

                <input className="Qurrie-form" onChange={this.handleChange} name="subject" placeholder="Subject" /><br />
                {this.state.subjectError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.subjectError}</div>) : null}

                <input className="Qurrie-form" onChange={this.handleChange} name="mobile" placeholder="Phone number" /><br />
                {this.state.mobileError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.mobileError}</div>) : null}

                <textarea className="Qurrie-form" style={{ "height": "150px", "border": "2px solid #767676" }}
                    onChange={this.handleChange} name="message" placeholder="Message" /><br />
                {this.state.messageError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.messageError}</div>) : null}

                <input id="sendMessage" type="submit" value="Send Message" />
            </form>

        )
    }
}