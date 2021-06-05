import React from 'react'
import axios from '../config/axios.js'
import '../css/LoginDetails/Signup.css'
import { Link } from 'react-router-dom'

const initialState = {
    name: "",
    email: '',
    password: '',
    userType: 'Customer',
    nameError: '',
    emailError: '',
    phonenumber: '',
    phonenumberError: '',
}

// Make responsive
export default class SignUpForm extends React.Component {
    constructor() {
        super()
        this.state = initialState
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    validate = () => {
        let nameError = ""
        let emailError = ""
        let phonenumberError = ""

        let specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '~', '_', '`', '(', ')', '+', '-', '/', '.', ',', '[', ']', '{', '}', '?', ':', ';', '\'', '"', "|", ">", "<"]
        let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        if (this.state.name.length < 5) {
            nameError = "Error: The full name cannot be less than 5 characters"
        }

        if (specialChars.some(char => this.state.name.includes(char))) {
            nameError = "Error: The full name cannot contain special characters"
        }

        if (digits.some(digit => this.state.name.includes(digit))) {
            nameError = "Error: The full name cannot contain numbers 0-9 "
        }

        if (this.state.phonenumber.length !== 10) {
            phonenumberError = "Error: There must be 10 digits in your number !"
        }


        if (this.state.email.length < 5) {
            emailError = "Error: The email addess cannot be less than 5 characters"
        }


        if (!this.state.email.includes('@')) {
            emailError = "Error: The email address should contain @ symbol"
        }

        if (emailError || nameError || phonenumberError) {
            this.setState({ emailError, nameError, phonenumberError })
            return false
        }

        return true

    }


    handleSubmit = (e) => {
        e.preventDefault()
        console.log("inside handle submit button clicked!")

        console.log("Signup data :", this.state)
        // post request to create new user


        // validation
        const isValid = this.validate()

        if (isValid) {
            const user = {
                "username": this.state.name.toUpperCase(),
                "email": this.state.email,
                "password": this.state.password,
                "phonenumber": this.state.phonenumber,
                "userType": this.state.userType
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

                    }
                })


            // Clear form
            this.setState(initialState)
        }

    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCheckboxChange = () => {
        console.log('this.state.isCaterer before:', this.state.isCaterer)
        let change = !this.state.isCaterer
        console.log('change:', change)
        if (change) {
            this.setState({ userType: "Caterer" })
        }
        else {
            this.setState({ userType: "Customer" })
        }
        console.log('this.state.isCaterer after:', this.state.isCaterer)
    }

    render() {

        return (
            // <Container fluid>
            //     <Row>
            //         <Col>
            <div>
                <form onSubmit={this.handleSubmit} className="signup-form">
                    <div className="input-box">
                        <input id="inputName" placeholder="Full Name" name="name" onChange={this.handleChange} value={this.state.name} /><br />
                        {this.state.nameError ? (<div style={{ "color": "red", "marginLeft": "120px" }}>{this.state.nameError}</div>) : null}

                        <input id="inputEmail2" placeholder="Email" name="email" onChange={this.handleChange} value={this.state.email} /><br />
                        {this.state.emailError ? (<div style={{ "color": "red", "marginLeft": "120px" }}>{this.state.emailError}</div>) : null}

                        <input id="inputPhonenumber" placeholder="Phone number" name="phonenumber" onChange={this.handleChange} value={this.state.phonenumber} /><br />
                        {this.state.phonenumberError ? (<div style={{ "color": "red", "marginLeft": "120px" }}>{this.state.phonenumberError}</div>) : null}

                        <input id="inputPassword2" type="password" placeholder="Password" name="password" onChange={this.handleChange} value={this.state.password} /><br />
                    </div>

                    <div className="signup-form-center">
                        <input type="checkbox" id="caterer" name="isCaterer" onChange={this.handleCheckboxChange} checked={this.state.isCaterer} />
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
}