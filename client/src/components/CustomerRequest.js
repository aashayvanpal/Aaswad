import React from 'react';
import ShowBtn from '../assets/ShowBtn';
import axios from '../config/axios';
import CustomerForm from './customer/Form.js'
import NavigationBar from './NavigationBar.js'

export default class CustomerRequest extends React.Component {
    constructor() {
        super()
        this.state = {
            reqOrder: [],
            username: '',
            userType: '',
            address: '',
            phonenumber: '',
            openSubmitEnquiryModal: false
        }

        this.handleCustomerSubmit = this.handleCustomerSubmit.bind(this)
    }

    componentDidMount() {
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
        console.log('before setstate')
        console.log(this.state.reqOrder)
        this.setState({
            reqOrder: parsedItems
        })

        console.log('after setstate')

        console.log(this.state.reqOrder)

        // Do a get request to /account to get user name , add x-auth as header to it
        // just set the token in localStorage and get it in x-auth , the code is working fine,,,
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log("user data :", dataRequest)
                this.setState({
                    username: dataRequest.data.username,
                    userType: dataRequest.data.userType,
                    phonenumber: dataRequest.data.phonenumber,
                    address: dataRequest.data.address,

                })
            })
            .catch(err => {
                console.log(err)
            })

    }

    handleCustomerSubmit(customerData) {
        // e.preventDefault()
        console.log('clicked on submit enquiry button lol fail')
        console.log('Send these items for approval :', this.state.reqOrder)
        console.log('Submit this customer data :', customerData)

        const order = {
            items: this.state.reqOrder,
            customer: customerData,
            status: 'approve'
        }

        console.log('order :', order)

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
                    this.setState({ openSubmitEnquiryModal: true })
                    // console.log('success check for trueeee', this.state.openSubmitEnquiryModal)
                    localStorage.removeItem("cartItems")

                    // window.location.href = '/menu'

                }
            })
    }

    render() {
        console.log('customer request')
        return (
            <div id="request-div">
                <div style={{ "display": "inline" }}>
                    {
                        this.state.userType === "Admin" ? (
                            <>
                                <ShowBtn />
                            </>
                        ) : (null)
                    }

                    <div style={{ "display": "flex" }}>
                        <NavigationBar />
                        <CustomerForm handleCustomerSubmit={this.handleCustomerSubmit}
                            openSubmitEnquiryModal={this.state.openSubmitEnquiryModal}
                        />
                    </div>
                </div >
                <div style={{
                    "marginTop": "50px",
                    "textAlign": "center",
                    "color": "#dbc268",
                    "backgroundColor": "#353535"
                }}>
                    © Copyrights Reserved 2021
                </div>
            </div>
        );
    }
}