import React, { useState } from 'react'
import axios from '../config/axios.js'
import '../css/LoginDetails/Signup.css'
import { Link } from 'react-router-dom'

// Make responsive
const SignUpForm = () => {

    const initialState = {
        name: "",
        email: '',
        address: '',
        password: '',
        userType: 'Customer',
        nameError: '',
        emailError: '',
        phonenumber: '',
        phonenumberError: '',
        addressError: '',
    }

    const [name, setName] = useState(initialState.name)
    const [phonenumber, setPhoneNumber] = useState(initialState.phonenumber)
    const [email, setEmail] = useState(initialState.email)
    const [address, setAddress] = useState(initialState.address)
    const [password, setPassword] = useState(initialState.password)
    const [userType, setUserType] = useState(initialState.userType)
    const [nameError, setNameError] = useState(initialState.nameError)
    const [emailError, setEmailError] = useState(initialState.emailError)
    const [phonenumberError, setPhoneNumberError] = useState(initialState.phonenumberError)
    const [addressError, setAddressError] = useState(initialState.addressError)
    const [isCaterer, setIsCaterer] = useState(false)


    const validate = () => {
        let nameError = ""
        let emailError = ""
        let phonenumberError = ""

        let specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '~', '_', '`', '(', ')', '+', '-', '/', '.', ',', '[', ']', '{', '}', '?', ':', ';', '\'', '"', "|", ">", "<"]
        let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        if (name.length < 5) {
            nameError = "Error: The full name cannot be less than 5 characters"
        }

        if (specialChars.some(char => name.includes(char))) {
            nameError = "Error: The full name cannot contain special characters"
        }

        if (digits.some(digit => name.includes(digit))) {
            nameError = "Error: The full name cannot contain numbers 0-9 "
        }

        if (phonenumber.length !== 10) {
            phonenumberError = "Error: There must be 10 digits in your number !"
        }


        if (email.length < 5) {
            emailError = "Error: The email addess cannot be less than 5 characters"
        }


        if (!email.includes('@')) {
            emailError = "Error: The email address should contain @ symbol"
        }

        if (emailError || nameError || phonenumberError) {
            setEmailError(emailError)
            setNameError(nameError)
            setPhoneNumberError(phonenumberError)
            return false
        }

        return true

    }

    const notifyUserAccountCreation = () => {
        // send welcome email to new user
        axios.post('/sendEmail/welcome', {
            'fullName': name,
            'email': email,
            'phonenumber': phonenumber
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("inside handle submit button clicked!")

        // console.log("Signup data :", this.state)
        // post request to create new user


        // validation
        const isValid = validate()

        if (isValid) {
            const user = {
                "username": name.toUpperCase(),
                "email": email,
                "password": password,
                "phonenumber": phonenumber,
                "userType": userType,
                "address": address
            }

            axios.post('/register', user, {
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
                        console.log('successfully created user', response.data)
                        alert('account created successfully')
                        window.location.href = '/signin'

                        notifyUserAccountCreation()

                    }
                })


            // Clear form
            // this.setState(initialState)
            // set all state here
        }

    }

    const handleCheckboxChange = () => {
        console.log('this.state.isCaterer before:', isCaterer)
        let change = !isCaterer
        console.log('change:', change)
        if (change) {
            setUserType("Caterer")
        }
        else {
            setUserType("Customer")
        }
        console.log('this.state.isCaterer after:', isCaterer)
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-box">
                    <input id="inputName" placeholder="Full Name" name="name" onChange={(e) => { setName(e.target.value) }} value={name} /><br />
                    {nameError ? (<div style={{ "color": "red", "marginLeft": "120px" }}>{nameError}</div>) : null}

                    <input id="inputEmail2" placeholder="Email" name="email" onChange={(e) => { setEmail(e.target.value) }} value={email} /><br />
                    {emailError ? (<div style={{ "color": "red", "marginLeft": "120px" }}>{emailError}</div>) : null}

                    <input id="inputPhonenumber" placeholder="Phone number" name="phonenumber" onChange={(e) => { setPhoneNumber(e.target.value) }} value={phonenumber} /><br />
                    {phonenumberError ? (<div style={{ "color": "red", "marginLeft": "120px" }}>{phonenumberError}</div>) : null}

                    <input id="inputPassword2" type="password" placeholder="Password" name="password" onChange={(e) => { setPassword(e.target.value) }} value={password} /><br />

                    <textarea id="inputAddress" placeholder="Address" name="address" onChange={(e) => { setAddress(e.target.value) }} value={address} /><br />
                    {addressError ? (<div style={{ "color": "red", "marginLeft": "120px" }}>{addressError}</div>) : null}
                </div>

                <div className="signup-form-center">
                    <input type="checkbox" id="caterer" name="isCaterer" onChange={handleCheckboxChange} checked={isCaterer} />
                    <label style={{
                        "fontSize": "32px",
                        "marginLeft": "30px",
                    }} htmlFor="caterer" > I'm Caterer</label>
                </div>
                <br />
                <div id="create-account-wrapper">
                    <input type="submit" value="Create Account" id="create-account-button" />
                </div>

                <h3 id="already-have-account">Already have an account ? <Link to="/signin">Sign in</Link></h3>
            </form>
        </div>

    )
}
export default SignUpForm