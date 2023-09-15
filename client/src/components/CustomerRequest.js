import React, { useEffect, useState } from 'react';
import ShowBtn from '../assets/ShowBtn';
import axios from '../config/axios';
import CustomerForm from './customer/Form.js'
import NavigationBar from './NavigationBar.js'
import { addEventOrder } from '../apis/eventOrders';
import generateObjectID from '../helperFunctions/generateObjectID';

const CustomerRequest = ({ type = "default" }) => {

    const [username, setUserName] = useState('')
    const [userType, setUserType] = useState('')
    const [phonenumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [reqOrder, setreqOrder] = useState([])
    const [openSubmitEnquiryModal, setOpenSubmitEnquiryModal] = useState(false)

    useEffect(() => {
        // get all orders from /menu find and display all items from that _id
        console.log('inside componentdidmount customer request')
        // console.log('local storage render items :')
        // console.log(localStorage.getItem('orderItems'))
        // console.log(localStorage.getItem('orderItems').items)
        console.log('fetching :', localStorage.getItem('orderItems'))
        // console.log(Array.isArray(JSON.parse(localStorage.getItem('orderItems'))))
        const parsedItems = JSON.parse(localStorage.getItem('orderItems'))
        console.log('parsedItems :', parsedItems)
        console.log('parsedItems isArray?:', Array.isArray(parsedItems))
        setreqOrder(parsedItems)
        // Do a get request to /account to get user name , add x-auth as header to it
        // just set the token in localStorage and get it in x-auth , the code is working fine,,,
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log("user data :", dataRequest)
                setUserName(dataRequest.data.username)
                setUserType(dataRequest.data.userType)
                setPhoneNumber(dataRequest.data.phonenumber)
                setAddress(dataRequest.data.address)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])

    const emailNotify = (order) => {
        console.log('email check', order)
        axios.post('/sendEmail/orderPlaced', { 'email': order.customer.email })
        axios.post('/sendEmail/newOrderNotify', { 'username': order.customer.fullName })
    }

    const handleCustomerSubmit = (customerData) => {
        alert("type " + type)

        switch (type) {
            case 'eventOrder': {
                alert('entered eventOrder code block')
                // console.log('Send these items for approval :', reqOrder)
                // console.log('Submit this customer data :', customerData)
                const orderId = generateObjectID()
                const order = {
                    items: reqOrder,
                    customer: customerData,
                    status: 'approve',
                    orderId
                }

                console.log('order :', order)

                // fetch id of the event , push inside the orders array 
                const id = localStorage.getItem('eventId')
                console.log("do put request with this id", id)
                // put request to push inside orders array 
                addEventOrder(id, order)

                // oncomplete remove from localstorage saved data
                localStorage.removeItem('eventId')
            }
                break;
            default: {
                alert("entered default case block")
                // Default running
                // e.preventDefault()
                console.log('clicked on submit enquiry button')
                console.log('Send these items for approval :', reqOrder)
                console.log('Submit this customer data :', customerData)

                const order = {
                    items: reqOrder,
                    customer: customerData,
                    status: 'approve'
                }

                console.log('order :', order)
                // post request if new order , put request if old-edit order
                if (localStorage.getItem('order')) {
                    console.log('execute the put request')
                    axios.put(`/orders/${JSON.parse(localStorage.order).id}`, order, {
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
                                console.log('put request success', response.data)
                                // this.props.history.push('/items')

                                // Adding confirmation modal
                                // window.alert('Thank you for placing order we will get back')
                                // console.log(this.props)
                                // this.props.history.push('/menu')
                                // this.setState({ openSubmitEnquiryModal: true })
                                setOpenSubmitEnquiryModal(true)
                                // console.log('success check for trueeee', this.state.openSubmitEnquiryModal)
                                localStorage.removeItem("cartItems")
                                localStorage.removeItem("order")

                                // window.location.href = '/menu'

                                // for Email notification
                                emailNotify(order)
                            }
                        })
                        .catch(err => console.log(err))
                } else {
                    console.log('execute the post request for new order')
                    // post request -> order 
                    axios.post('/request', order, {
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
                                // this.props.history.push('/items')

                                // Adding confirmation modal
                                // window.alert('Thank you for placing order we will get back')
                                // console.log(this.props)
                                // this.props.history.push('/menu')
                                setOpenSubmitEnquiryModal(true)
                                // console.log('success check for trueeee', this.state.openSubmitEnquiryModal)
                                localStorage.removeItem("cartItems")
                                localStorage.removeItem("order")

                                // window.location.href = '/menu'

                                // Email notification
                                emailNotify(order)
                            }
                        })
                        .catch(err => console.log(err))
                }
            }
        }




    }

    return (
        <div id="request-div">
            <div style={{ "display": "inline" }}>
                {
                    userType === "Admin" ? (
                        <>
                            <ShowBtn />
                        </>
                    ) : (null)
                }

                <div style={{ "display": "flex" }}>
                    <NavigationBar />
                    <CustomerForm handleCustomerSubmit={handleCustomerSubmit}
                        openSubmitEnquiryModal={openSubmitEnquiryModal}
                        userType={userType}
                    />
                </div>
            </div >
            <div style={{
                "marginTop": "50px",
                "textAlign": "center",
                "color": "#dbc268",
                "backgroundColor": "#353535"
            }}>
                © Copyrights Reserved 2023
            </div>
        </div>
    )
}

export default CustomerRequest