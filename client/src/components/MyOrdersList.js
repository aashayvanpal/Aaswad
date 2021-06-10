import React, { Component } from 'react';
import axios from '../config/axios'
import { Link } from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import LoadingSpinner from './LoadingSpinner.js'



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
    }

    render() {
        return (
            <div>
                <div style={{ "margin": "10px" }}>
                    <Link to='/menu'><button style={{
                        "padding": "10px",
                        "fontWeight": "bold",
                        "backgroundColor": "#dbc268",
                        "cursor": "pointer",
                        "marginBottom": "10px",
                        "borderRadius": "5px"
                    }}>Add new Order</button></Link>

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
                                                        <Th className="listing-table" >Event Name</Th>
                                                        <Th className="listing-table" >Order Date</Th>
                                                        <Th className="listing-table" >Address</Th>
                                                        <Th className="listing-table" >status</Th>
                                                        <Th className="listing-table" >Feedback</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody className="listing-table" >
                                                    {
                                                        this.state.userFilteredItems.map((item, i) => {
                                                            return (
                                                                <Tr key={item._id}>
                                                                    <Td className="listing-table" >{item.customer.eventName}</Td>
                                                                    <Td className="listing-table" >{
                                                                        item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                                    }</Td>
                                                                    <Td className="listing-table" >{item.customer.address}</Td>
                                                                    <Td className="listing-table" >{item.status}</Td>
                                                                    <Td className="listing-table" >Star Rating</Td>
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
                </div>
            </div>
        )
    }
}