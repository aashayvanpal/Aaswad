import React from 'react'
import DatePicker from "react-datepicker";
import axios from '../../config/axios.js'
import HDToolTip from './HDToolTip.js'
import ServiceToolTip from './ServiceToolTip.js'
import { Link } from 'react-router-dom'

import '../../css/CustomerRequest/request.css'
import "react-datepicker/dist/react-datepicker.css";
import { Stepper } from 'react-form-stepper'

export default class CustomerForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            queries: '',
            eventName: '',
            numberOfPeople: '',
            eventDate: '',
            eventTime: '',
            homeDelivery: false,
            service: false,
            startDate: new Date(),
            nameError: "",
            phoneNumberError: "",
            emailError: "",
            noOfPeopleError: "",
            addressError: '',
            userId: '',

        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
        this.handleCheckboxChangeService = this.handleCheckboxChangeService.bind(this)
    }

    componentDidMount() {
        console.log('Inside customer form')
        // Adding focus to the fullName on form load
        // console.log('Check this ============>', this)
        // console.log('Check this.fullName ============>', this.fullName)
        this.fullName.focus()


        // Filling the form with known 
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log("user data to fill inside form:", dataRequest)
                this.setState({
                    fullName: dataRequest.data.username,
                    email: dataRequest.data.email,
                    userId: dataRequest.data.id
                })
                // userType: dataRequest.data.userType
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCheckboxChange = () => {
        console.log('this.state.homeDelivery before:', this.state.homeDelivery)
        let change = !this.state.homeDelivery
        console.log('change:', change)
        this.setState({ homeDelivery: change })
        // console.log('this.state.homeDelivery after:', this.state)
        console.log('this.state.homeDelivery after:', this.state.homeDelivery)
    }

    handleCheckboxChangeService = () => {
        console.log('this.state.homeDelivery before:', this.state.service)
        let change = !this.state.service
        console.log('change:', change)
        this.setState({ service: change })
        // console.log('this.state.homeDelivery after:', this.state)
        console.log('this.state.homeDelivery after:', this.state.service)
    }


    validate = () => {
        let nameError = ""
        let emailError = ""
        let phoneNumberError = ""
        let noOfPeopleError = ""
        let addressError = ""


        let specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '~', '_', '`', '(', ')', '+', '-', '/', '.', ',', '[', ']', '{', '}', '?', ':', ';', '\'', '"', "|", ">", "<"]
        let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        if (this.state.fullName.length < 5) {
            nameError = "Error: The full name cannot be less than 5 characters"
        }

        if (specialChars.some(char => this.state.fullName.includes(char))) {
            nameError = "Error: The full name cannot contain special characters"
        }
        if (digits.some(digit => this.state.fullName.includes(digit))) {
            nameError = "Error: The full name cannot contain numbers 0-9 "
        }

        if (this.state.email.length < 5) {
            emailError = "Error: The email addess cannot be less than 5 characters"
        }

        if (!this.state.email.includes('@')) {
            emailError = "Error: The email address should contain @ symbol"
        }

        if (this.state.phoneNumber.length !== 10) {
            phoneNumberError = "Error: There must be 10 digits in your number !"
        }

        let regex = /[a - z]{ 1, 10}/
        if (regex.test(this.state.phoneNumber)) {
            phoneNumberError = "Error: The phone number cannot contain alphabets !"

        }

        // if (regex.test(this.state.numberOfPeople)) {
        //     noOfPeopleError = "Error: Number of People cannot contain alphabets !"
        // }

        if (!digits.some(digit => this.state.numberOfPeople.includes(digit))) {
            noOfPeopleError = "Error: Number of people cannot contain alphabets"
        }


        if (digits.some(digit => this.state.fullName.includes(digit))) {
            nameError = "Error: The Full Name  should not contain any numbers between 0-9 "
        }

        if (this.state.address.length === 0) {
            addressError = "Error: The addresss cannot be left blank "

        }


        if (emailError || nameError || phoneNumberError || noOfPeopleError) {
            this.setState({ emailError, nameError, phoneNumberError, noOfPeopleError, addressError })
            return false
        }

        return true

    }


    handleSubmit = e => {
        e.preventDefault()
        console.log("submit enquiry button clicked! check this ")

        // Write validate() and pass the condition form information is valid 

        // validation
        const isValid = this.validate()

        if (isValid) {


            const customer = {
                fullName: this.state.fullName,
                phoneNumber: this.state.phoneNumber,
                email: this.state.email,
                address: this.state.address,
                queries: this.state.queries,
                eventName: this.state.eventName,
                numberOfPeople: this.state.numberOfPeople,
                eventDate: this.state.startDate,
                eventTime: this.state.eventTime,
                homeDelivery: this.state.homeDelivery,
                service: this.state.service,
                customer_id: this.state.userId

            }
            // this.props.item && (item.id = this.props.item._id)

            console.log('props :', this.props)


            console.log("customer Data: ", customer)
            this.props.handleCustomerSubmit(customer)
        }
    }

    handleDateChange = date => {
        console.log("Date Changed :", String(date))
        console.log("Date type :", typeof (String(date)))
        let eventTime = String(date).substr(16, 5)
        console.log("eventTime :", eventTime)

        this.setState({
            startDate: date,
            eventTime
        });
    };


    render() {
        return (
            <form onSubmit={this.handleSubmit} id='detailsForm'>
                <h1 style={{ "fontSize": "28px", "textAlign": "center", "font-weight": "bold", "color": "white", "text-decoration": "underline" }}>Add Your Event Details </h1><br />
                <Stepper className="stepper-color"
                    steps={[{ label: 'Select Items' }, { label: 'Enter Quantity' }, { label: 'Submit Enquiry' }]}
                    activeStep={2}
                />
                <input name="fullName" className="form-input" value={this.state.fullName} onChange={this.handleChange} placeholder="Full Name"
                    ref={(input) => { this.fullName = input; }}
                />
                <br />
                {this.state.nameError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.nameError}</div>) : null}

                <input name="email" className="form-input" value={this.state.email} onChange={this.handleChange} placeholder="Email" />
                <br />
                {this.state.emailError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.emailError}</div>) : null}

                <input name="phoneNumber" pattern="[1-9]{1}[0-9]{9}" title="The phone number must contain 10 digit numbers only" className="form-input" value={this.state.phoneNumber} onChange={this.handleChange} placeholder="Phone Number" />
                <br />
                {this.state.phoneNumberError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.phoneNumberError}</div>) : null}

                <textarea style={{ "height": "250px", "border": "2px solid grey", }} name="address" className="form-input" value={this.state.address} onChange={this.handleChange} placeholder="Address" />
                <br />
                {this.state.addressError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.addressError}</div>) : null}

                <input name="eventName" className="form-input" value={this.state.eventName} onChange={this.handleChange} placeholder="Event Name" />
                <br />

                <input name="numberOfPeople" className="form-input" value={this.state.numberOfPeople} onChange={this.handleChange} placeholder="Number of people" />
                <br />
                {this.state.noOfPeopleError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{this.state.noOfPeopleError}</div>) : null}

                {/* <input name="eventDate" className="form-input" value={this.state.eventDate} onChange={this.handleChange} placeholder="Event Date" />
                <br /> */}

                {/* date start */}
                {/* <DatePicker className="form-input"
                    selected={this.state.startDate}
                    onChange={this.handleDateChange}
                    dateFormat="Pp"
                    showTimeSelect
                /> */}
                <DatePicker className="form-input"
                    selected={this.state.startDate}
                    onChange={this.handleDateChange}
                    dateFormat="dd/MM/yyyy h:mm aa"
                    showTimeSelect
                />
                <br />
                {/* date end */}

                {/* <input name="eventTime" className="form-input" value={this.state.eventTime} onChange={this.handleChange} placeholder="Event Time" />
                <br /> */}

                <textarea name="queries" className="form-input" value={this.state.queries} onChange={this.handleChange} placeholder="Any other queries?"
                    style={{ "height": "120px" }}
                />
                <br />
                <table id="request-table">
                    <tbody>
                        <tr >
                            <td style={{ "textAlign": "center" }}>
                                <label style={{ "display": "inline" }}>
                                    <span className="form-input">Home Delivery   <HDToolTip /> </span>
                                </label><br />
                            </td>
                            <td>
                                <input name="homeDelivery" className="form-input" style={{ "height": "25px", "width": "25px", "display": "block", "margin": "auto" }} checked={this.state.homeDelivery} onChange={this.handleCheckboxChange} type="checkbox" />
                            </td>
                        </tr>
                        <tr>

                            <td style={{ "textAlign": "center" }}>
                                <label >
                                    <span className="form-input">Service <ServiceToolTip /></span>
                                </label><br />
                            </td>
                            <td>
                                <input name="service" className="form-input" style={{ "height": "25px", "width": "25px", "display": "block", "margin": "auto" }} checked={this.state.service} onChange={this.handleCheckboxChangeService} type="checkbox" />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <input type="submit" id="submit-request" value="Submit Enquiry" />
            </form>

        )
    }
}