import React, { Component } from 'react';
import axios from '../config/axios'
import { Link } from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import LoadingSpinner from './LoadingSpinner.js'
import { getUserDetails } from '../assets/user-functions.js'



export default class MyOrdersList extends Component {
    constructor() {
        super()
        this.state = {
            userFilteredItems: [],
            userId: 'none',
            spinnerLoading: false

        }
        this.getUserOrders = this.getUserOrders.bind(this)
    }

    getUserOrders() {
        // Getting all the orders of the user
        axios.get(`/myOrders/${this.state.userId}`, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('this.state.userid : ', this.state.userId)

                console.log('Data : ', response.data)
                const userFilteredItems = response.data
                console.log('items after request :', userFilteredItems)

                // filter for userId 
                // const userFilteredItems = items.filter(item => item.customer.customer_id === this.state.userId)
                // console.log('Users filtered items:', userFilteredItems)
                this.setState({ userFilteredItems })
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentDidMount() {
        // Get all the orders, filter orders with customers id , display it
        // getting customer id
        this.setState({ spinnerLoading: true })

        getUserDetails()
            .then(res => {
                console.log("user data inside component did mount :", res)
                axios.get('/account', {
                    headers: { 'x-auth': localStorage.getItem('token') }
                })
                    .then(dataRequest => {
                        console.log("user id :", dataRequest.data.id)
                        this.setState({
                            userId: dataRequest.data.id
                        })

                        this.getUserOrders()
                        this.setState({ spinnerLoading: false })

                    })
                    .catch(err => {
                        console.log(err)
                        this.setState({ spinnerLoading: false })

                    })

            })
            .catch(err => {
                console.log(err)
                window.alert('Please login ,you will be redirected')
                window.location.href = '/signin'
            })

    }

    render() {
        return (
            <div>
                <div style={{ "margin": "10px" }}>
                    {this.state.spinnerLoading ? (
                        <LoadingSpinner LoadingSpinner={this.state.spinnerLoading} />
                    ) :
                        (
                            <div>
                                {
                                    this.state.userFilteredItems.length !== 0 ?
                                        (
                                            <Table>
                                                <Thead>
                                                    <Tr>
                                                        <Th style={{ "fontSize": "30px" }} className="listing-table" >Event Name</Th>
                                                        <Th style={{ "fontSize": "30px" }} className="listing-table" >Order Date</Th>
                                                        <Th style={{ "fontSize": "30px" }} className="listing-table" >Address</Th>
                                                        <Th style={{ "fontSize": "30px" }} className="listing-table" >Status</Th>
                                                        <Th style={{ "fontSize": "30px" }} className="listing-table" >Feedback</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody className="listing-table" >
                                                    {
                                                        this.state.userFilteredItems.map((item, i) => {
                                                            return (
                                                                <Tr key={item._id}>
                                                                    <Td className="listing-table" ><Link to={`/myOrders/show/${item._id}`}>{item.customer.eventName}</Link></Td>
                                                                    <Td className="listing-table" >{
                                                                        item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                                    }</Td>
                                                                    <Td className="listing-table" >{item.customer.address}</Td>
                                                                    <Td className="listing-table" >{item.status}</Td>
                                                                    <Td className="listing-table" ><Link to={`/myOrders/feedback/${item._id}`}>Star Rating</Link></Td>
                                                                    {/* <td className="listing-table" >{item.customer.fullName}</td> */}

                                                                </Tr>
                                                            )
                                                        })
                                                    }
                                                </Tbody>
                                            </Table>
                                        ) : (<h1 style={{ "textAlign": "center" }}>No orders have been placed yet</h1>)
                                }
                            </div>
                        )
                    }
                    <Link to='/menu'><button style={{
                        "padding": "10px",
                        "fontWeight": "bold",
                        "backgroundColor": "#dbc268",
                        "cursor": "pointer",
                        "marginTop": "30px",
                        "marginLeft": "30px",
                        "borderRadius": "5px"
                    }}>Add new Order</button></Link>
                </div>
            </div>
        )
    }
}