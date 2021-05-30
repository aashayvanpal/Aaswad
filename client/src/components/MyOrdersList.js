import React, { Component } from 'react';
import axios from '../config/axios'
import { Link } from 'react-router-dom'


export default class MyOrdersList extends Component {
    constructor() {
        super()
        this.state = {
            userFilteredItems:[],
            userId:'none'
        }
        this.getUserOrders = this.getUserOrders.bind(this)
    }

    getUserOrders(){
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
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log("user id :", dataRequest.data.id)
                this.setState({
                    userId: dataRequest.data.id
                })

                this.getUserOrders()
            
            })
            .catch(err => {
                console.log(err)
            })

        
    }

    render() {
        return (
            <div>
                my orders list
                

                <div style={{ "backgroundColor": "#2eec4e" }}>

                    <Link to='/menu'><button>Add new Order</button></Link>
                    <table className="listing-table" >
                        <thead className="listing-table" >
                            <tr>
                                <td className="listing-table" >Event Name</td>
                                <td className="listing-table" >Order Date</td>
                                <td className="listing-table" >Address</td>
                                <td className="listing-table" >status</td>
                                <td className="listing-table" >Feedback</td>
                            </tr>
                        </thead>
                        <tbody className="listing-table" >
                            {
                                this.state.userFilteredItems.map((item, i) => {
                                    return (
                                        <tr key={item._id}>
                                            <td className="listing-table" >{item.customer.eventName}</td>
                                            <td className="listing-table" >{
                                                item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                            }</td>
                                            <td className="listing-table" >{item.customer.address}</td>
                                            <td className="listing-table" >{item.status}</td>
                                            <td className="listing-table" >Star Rating</td>
                                            {/* <td className="listing-table" >{item.customer.fullName}</td> */}
                                           
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}