import React, { useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import axios from '../../config/axios.js'
import HDToolTip from './HDToolTip.js'
import ServiceToolTip from './ServiceToolTip.js'
import SubmitEnquiryModal from './SubmitEnquiryModal.js'

import '../../css/CustomerRequest/request.css'
import "react-datepicker/dist/react-datepicker.css";
import { Stepper } from 'react-form-stepper'

const CustomerForm = (props) => {
    let time = String(new Date()).substr(16, 5)

    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [queries, setQuerries] = useState('')
    const [eventName, setEventName] = useState('')
    const [numberOfPeople, setNumberOfPeople] = useState(1)
    const [eventDate, setEventDate] = useState('')
    const [eventTime, setEventTime] = useState(time)
    const [homeDelivery, setHomeDelivery] = useState(false)
    const [service, setService] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [nameError, setNameError] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [noOfPeopleError, setNoOfPeopleError] = useState('')
    const [addressError, setAddressError] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [id, setId] = useState('')
    const [userType, setUserType] = useState('')
    const [openSubmitEnquiryModal, setOpenSubmitEnquiryModal] = useState(props.openSubmitEnquiryModal)


    useEffect(() => {
        console.log('Inside customer form')
        // Adding focus to the fullName on form load
        // console.log('Check this ============>', this)
        // console.log('Check this.fullName ============>', this.fullName)

        // focus fix
        // fullName.focus()


        // Filling the form with known data , if editing ,use that localstorage.order ,else /account api
        if (JSON.parse(localStorage.getItem('order'))) {
            console.log('order found from localstorage details edit feature')
            console.log(JSON.parse(localStorage.getItem('order')))
            const { customer_id, numberOfPeople, email, fullName, phoneNumber, eventDate, _id, address, eventName, homeDelivery, service, queries } = JSON.parse(localStorage.getItem('order'))
            let { eventTime } = JSON.parse(localStorage.getItem('order'))
            eventTime = typeof (eventTime) === 'undefined' ? '12:30' : eventTime
            //important fix: if there is eventTime Error here , set event time = '12:30'
            console.log('eventDate:', eventDate)
            // console.log('eventTime to set:', eventTime)
            // console.log('eventTime to first:', eventTime.split(':')[0])
            // console.log('eventTime to second:', eventTime.split(':')[1])
            // also set date here , or else the default date is 12:00 am
            var dateParts = eventDate.split("/");
            // month is 0-based, that's why we need dataParts[1] - 1
            var dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            dateObject.setHours(eventTime.split(':')[0], eventTime.split(':')[1])
            console.log('here is debug for dateObject:', dateObject)
            // this.setState({
            //     startDate: dateObject,
            //     userId: customer_id,
            //     fullName,
            //     phoneNumber,
            //     eventTime,
            //     email,
            //     address,
            //     eventName,
            //     numberOfPeople: String(numberOfPeople),
            //     id: _id,
            //     homeDelivery,
            //     service,
            //     queries
            // })
            setStartDate(dateObject)
            setCustomerId(customer_id)
            setFullName(fullName)
            setPhoneNumber(phoneNumber)
            setEventTime(eventTime)
            setEmail(email)
            setAddress(address)
            setEventName(eventName)
            setNumberOfPeople(String(numberOfPeople))
            setId(_id)
            setHomeDelivery(homeDelivery)
            setService(service)
            setQuerries(queries)
        } else {
            console.log('getting /account api')
            axios.get('/account', {
                headers: { 'x-auth': localStorage.getItem('token') }
            })
                .then(dataRequest => {
                    console.log("user data to fill inside form:", dataRequest)
                    // if localstorage found user that data for edit
                    // this.setState({
                    //     fullName: dataRequest.data.username,
                    //     email: dataRequest.data.email,
                    //     address: dataRequest.data.address,
                    //     userId: dataRequest.data.id,
                    //     phoneNumber: dataRequest.data.phonenumber
                    // })
                    setFullName(dataRequest.data.username)
                    setEmail(dataRequest.data.email)
                    setAddress(dataRequest.data.address)
                    setId(dataRequest.data.id)
                    setPhoneNumber(dataRequest.data.phonenumber)
                    // userType: dataRequest.data.userType
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }, [])

    const handleCheckboxChange = () => {
        console.log('homeDelivery before:', homeDelivery)
        let change = !homeDelivery
        console.log('change:', change)
        setHomeDelivery(change)
        // console.log('this.state.homeDelivery after:', this.state)
        console.log('homeDelivery after:', homeDelivery)
    }


    const handleCheckboxChangeService = () => {
        console.log('service before:', service)
        let change = !service
        console.log('change:', change)
        // this.setState({ service: change })
        setService(change)
        // console.log('this.state.homeDelivery after:', this.state)
        console.log('service after:', service)
    }


    const validate = () => {
        let nameError = ""
        let emailError = ""
        let phoneNumberError = ""
        let noOfPeopleError = ""
        let addressError = ""


        let specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '~', '_', '`', '(', ')', '+', '-', '/', '.', ',', '[', ']', '{', '}', '?', ':', ';', '\'', '"', "|", ">", "<"]
        let digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        // Regex for name validation
        // name max length 20 characters
        if (fullName.length < 5) {
            nameError = "Error: The full name cannot be less than 5 characters"
        }

        if (specialChars.some(char => fullName.includes(char))) {
            nameError = "Error: The full name cannot contain special characters"
        }
        if (digits.some(digit => fullName.includes(digit))) {
            nameError = "Error: The full name cannot contain numbers 0-9 "
        }

        if (email.length < 5) {
            emailError = "Error: The email addess cannot be less than 5 characters"
        }

        if (!email.includes('@')) {
            emailError = "Error: The email address should contain @ symbol"
        }

        if (phoneNumber.toString().length !== 10) {
            phoneNumberError = "Error: There must be 10 digits in your number !"
        }

        let regex = /[a - z]{ 1, 10}/
        if (regex.test(phoneNumber)) {
            phoneNumberError = "Error: The phone number cannot contain alphabets !"

        }

        // if (regex.test(this.state.numberOfPeople)) {
        //     noOfPeopleError = "Error: Number of People cannot contain alphabets !"
        // }
        console.log('validation check numberOfPeople:', numberOfPeople)
        if (!digits.some(digit => numberOfPeople.toString().includes(digit))) {
            noOfPeopleError = "Error: Number of people cannot contain alphabets"
        }


        if (digits.some(digit => fullName.includes(digit))) {
            nameError = "Error: The Full Name  should not contain any numbers between 0-9 "
        }

        if (address.length === 0) {
            addressError = "Error: The addresss cannot be left blank "

        }


        if (emailError || nameError || phoneNumberError || noOfPeopleError) {
            // this.setState({ emailError, nameError, phoneNumberError, noOfPeopleError, addressError })
            setEmailError(emailError)
            setNameError(nameError)
            setPhoneNumberError(phoneNumberError)
            setNoOfPeopleError(noOfPeopleError)
            setAddressError(addressError)

            return false
        }

        return true

    }


    const handleSubmit = e => {
        e.preventDefault()
        console.log("submit enquiry button clicked! check this ")

        // Write validate() and pass the condition form information is valid 

        // validation
        const isValid = validate()

        if (isValid) {

            const customer = {
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                address: address,
                queries: queries,
                eventName: eventName,
                numberOfPeople: numberOfPeople,
                eventDate: startDate,
                eventTime: eventTime,
                homeDelivery: homeDelivery,
                service: service,
                customer_id: customerId

            }
            // this.props.item && (item.id = this.props.item._id)

            console.log('props :', props)


            console.log("customer Data: ", customer)
            // this.setState({ openSubmitEnquiryModal: true })
            props.handleCustomerSubmit(customer)
        }
    }

    const handleDateChange = date => {
        console.log("Date Changed :", String(date))
        console.log("Date Changed :", date)
        let eventTime = String(date).substr(16, 5)
        console.log("eventTime :", eventTime)

        // this.setState({
        //     startDate: date,
        //     eventTime
        // });
        setStartDate(date)
        setEventTime(eventTime)
    };

    const clearForm = () => {
        // this.setState({
        //     fullName: '',
        //     email: 'test@gmail.com',
        //     phoneNumber: '',
        //     address: '',
        // })
        setFullName('')
        setEmail('test@gmail.com')
        setPhoneNumber('')
        setAddress('')
    }

    return (
        <form id='detailsForm' onSubmit={handleSubmit}>
            {userType === 'Admin' ? <button onClick={clearForm}>Clear form</button> : null}

            <h1 style={{ "fontSize": "28px", "textAlign": "center", "fontWeight": "bold", "color": "white", "textDecoration": "underline" }}>Add Your Event Details </h1><br />
            <Stepper className="stepper-color"
                steps={[{ label: 'Select Items' }, { label: 'Enter Quantity' }, { label: 'Submit Enquiry' }]}
                activeStep={2}
            />
            <input name="fullName" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name"
            // ref={(input) => { setFullName(input) }}
            />
            <br />
            {nameError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{nameError}</div>) : null}

            <input name="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <br />
            {emailError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{emailError}</div>) : null}

            <input name="phoneNumber" pattern="[1-9]{1}[0-9]{9}" title="The phone number must contain 10 digit numbers only" className="form-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Phone Number" />
            <br />
            {phoneNumberError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{phoneNumberError}</div>) : null}

            <textarea style={{ "height": "250px", "border": "2px solid grey", }} name="address" className="form-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
            <br />
            {addressError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{addressError}</div>) : null}

            <input name="eventName" className="form-input" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="Event Name" />
            <br />

            <input name="numberOfPeople" className="form-input" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} placeholder="Number of people" />
            <br />
            {noOfPeopleError ? (<div style={{ "color": "red", "marginLeft": "10px" }}>{noOfPeopleError}</div>) : null}

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
                wrapperClassName="datePickerStyle"
                selected={startDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy h:mm aa"
                showTimeSelect
            />
            <br />
            {/* date end */}

            {/* <input name="eventTime" className="form-input" value={this.state.eventTime} onChange={this.handleChange} placeholder="Event Time" />
                <br /> */}

            <textarea name="queries" className="form-input" value={queries} onChange={(e) => setQuerries(e.target.value)} placeholder="Any other queries?"
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
                            <input name="homeDelivery" className="form-input" style={{ "height": "25px", "width": "25px", "display": "block", "margin": "auto" }} checked={homeDelivery} onChange={handleCheckboxChange} type="checkbox" />
                        </td>
                    </tr>
                    <tr>

                        <td style={{ "textAlign": "center" }}>
                            <label >
                                <span className="form-input">Service <ServiceToolTip /></span>
                            </label><br />
                        </td>
                        <td>
                            <input name="service" className="form-input" style={{ "height": "25px", "width": "25px", "display": "block", "margin": "auto" }} checked={service} onChange={handleCheckboxChangeService} type="checkbox" />
                        </td>
                    </tr>
                </tbody>
            </table>

            {/* <input type="submit" id="submit-request" value="Submit Enquiry" /> */}
            <button type="submit" id="submit-request">
                Submit Enquiry
            </button>
            <SubmitEnquiryModal isOpen={props.openSubmitEnquiryModal}
                closeModal={() => {
                    // this.setState({ openSubmitEnquiryModal: false })
                    setOpenSubmitEnquiryModal(false)
                    window.location.href = '/menu'
                }}
            />
        </form >
    )

}
export default CustomerForm