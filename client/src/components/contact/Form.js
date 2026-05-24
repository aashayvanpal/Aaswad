import React, { useState } from 'react'
import axios from '../../config/axios.js'
import '../../css/contact.scss'

const Form = () => {
    
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [mobile, setMobile] = useState('')
    const [message, setMessage] = useState('')
    const [emailError, setEmailError] = useState('')
    const [subjectError, setSubjectError] = useState('')
    const [mobileError, setMobileError] = useState('')
    const [messageError, setMessageError] = useState('')


    const validate = () => {
        let emailError, subjectError, mobileError, messageError = ''
        // let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']


        if (!email.includes('@')) {
            emailError = "Error: The email address should contain @ symbol"
        }

        if (mobile.toString().length !== 10) {
            mobileError = "Error: There must be 10 digits in your number !"
        }

        if (email.length === 0) {
            emailError = "Error: The email cannot be left blank "

        }
        if (subject.length === 0) {
            subjectError = "Error: The subject cannot be left blank "

        }
        if (mobile.length === 0) {
            mobileError = "Error: The mobile number cannot be left blank "

        }
        if (message.length === 0) {
            messageError = "Error: The message cannot be left blank "

        }

        if (emailError || subjectError || mobileError || messageError) {
            setEmailError(emailError)
            setSubjectError(subjectError)
            setMobileError(mobileError)
            setMessageError(messageError)
            return false
        }

        return true

    }

    const formSubmit = (e) => {
        e.preventDefault()
        console.log('cliked on send message !')

        // validation for form
        const isValid = validate()

        if (isValid) {
            const formData = { email, subject, mobile, message }
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
                        // clearing form
                        setEmail('')
                        setSubject('')
                        setMessage('')
                        setMobile('')
                    }
                })
                .catch(err => {
                    console.error('[ContactForm] submit failed:', err)
                    window.alert('Failed to submit query. Please try again.')
                })
        }
    }

    return (
        <form id="messageForm" onSubmit={(e) => { formSubmit(e) }}>
            <input className="Qurrie-form" value={email} onChange={(e) => { setEmail(e.target.value) }} name="email" placeholder="Your Email" /><br />
            {emailError ? (<div className="form-field-error">{emailError}</div>) : null}

            <input className="Qurrie-form" value={subject} onChange={(e) => { setSubject(e.target.value) }} name="subject" placeholder="Subject" /><br />
            {subjectError ? (<div className="form-field-error">{subjectError}</div>) : null}

            <input className="Qurrie-form" value={mobile} onChange={(e) => { setMobile(e.target.value) }} name="mobile" placeholder="Phone number" /><br />
            {mobileError ? (<div className="form-field-error">{mobileError}</div>) : null}

            <textarea className="Qurrie-form contact-textarea" value={message}
                onChange={(e) => { setMessage(e.target.value) }} name="message" placeholder="Message" /><br />
            {messageError ? (<div className="form-field-error">{messageError}</div>) : null}

            <input id="sendMessage" type="submit" value="Send Message" />
        </form>

    )
}
export default Form