import React, { Component } from 'react';
import axios from '../config/axios'
import { Link } from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';


export default class ItemList extends Component {
    constructor() {
        super()
        this.state = {
            approves: [],
            confirms: [],
            completed: []
        }
        this.handleRemoveOrder = this.handleRemoveOrder.bind(this)
        this.handleApproveOrder = this.handleApproveOrder.bind(this)
        this.handleCompleteOrder = this.handleCompleteOrder.bind(this)
    }

    componentDidMount() {
        // get request for all items , filter approves,confirmed and completed
        axios.get('/api/orders', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Data : ', response.data)
                const items = response.data
                console.log('items after request :', items)
                // filter for approve 
                const approves = items.filter(item => item.status === 'approve')
                console.log('approves filtered:', approves)
                this.setState({ approves })

                // filter for confirmed 
                const confirms = items.filter(item => item.status === 'confirmed')
                console.log('confirms filtered:', confirms)
                this.setState({ confirms })

                // filter for completed 
                const completed = items.filter(item => item.status === 'completed')
                console.log('completed filtered:', completed)
                this.setState({ completed })

                console.log('approves state:', this.state.approves)
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleRemoveOrder(id, name) {
        console.log('remove this id:', id)
        console.log('remove this name:', name)
        // const change = this.state.approves.filter(item => item._id !== id)
        // add confirmation here
        if (window.confirm(`are you sure you want to delete the order of ${name}`)) {
            console.log('delete here')


            // DELETE Request
            axios.delete(`/orders/${id}`, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    console.log('response data', response.data)
                    this.setState((prevState) => ({
                        approves: prevState.approves.filter(item => item._id !== response.data._id)
                    }))
                    // remove if not required
                    this.setState((prevState) => ({
                        confirms: prevState.confirms.filter(item => item._id !== response.data._id)
                    }))

                    this.setState((prevState) => ({
                        completed: prevState.completed.filter(item => item._id !== response.data._id)
                    }))

                    // var NewItems = this.props.items.filter(item => {
                    //     return item !== itemToDelete
                    // })

                    // this.setState({
                    //     items: NewItems
                    // })
                    // console.log("items after []:", NewItems)
                    // console.log("item deleted :", this.props.items.splice(this.props.items.indexOf(itemToDelete), 1))

                })
                .catch((err) => {
                    console.log(err)
                })

        } else { console.log('dont delete the order') }



        // this.setState(
        //     prevState => ({
        //         items: prevState.items.filter(item => item !== itemToDelete)
        //     })
        // )

        // this.setState({ approves: change })
    }

    handleApproveOrder(id) {
        console.log('clicked on Approve Button ')
        console.log('Approve this order id: ', id)
        // change status from approve to confirmed
        // you have found the id, you have to get the whole item 
        const foundItem = this.state.approves.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s status before:', foundItem.status)

        // this.setState(prevState => ({
        //     display: !prevState.display
        //   }));

        // console.log('current state id',this.state.items.id[itemToToggle])
        console.log('Edit item : ', foundItem)


        const index = this.state.approves.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of approves :', this.state.approves)
        console.log('spread :', ...this.state.approves)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = this.state.approves
        changedItems[index].status = 'confirmed'

        this.setState((prevState) => ({
            confirms: [changedItems[index], ...prevState.confirms]
        }))

        this.setState({
            approves: changedItems.filter(item => item.status === 'approve')
        })

        // this.setState(prevState => ({
        //     confirms: [
        //         prevState.confirms[index].status = !prevState.confirms[index].status,
        //         ...prevState.confirms
        //     ]
        // }))
        console.log('put request for /orders')
        console.log('changedItems[index]:', changedItems[index])
        // put request
        axios.put(`/orders/${changedItems[index]._id}`, changedItems[index], {
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
                    // this.props.history.push(`/items/show/${response.data._id}`)
                    // window.location.href = '/items'

                }
            })
    }

    handleCompleteOrder(id) {
        console.log('clicked on Completed Button ')
        console.log('Approve this order id: ', id)
        // change status from approve to confirmed
        // you have found the id, you have to get the whole item 
        const foundItem = this.state.confirms.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s status before:', foundItem.status)

        // this.setState(prevState => ({
        //     display: !prevState.display
        //   }));

        // console.log('current state id',this.state.items.id[itemToToggle])
        console.log('Edit item : ', foundItem)


        const index = this.state.confirms.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of confirms :', this.state.confirms)
        console.log('spread :', ...this.state.confirms)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = this.state.confirms
        changedItems[index].status = 'completed'

        this.setState((prevState) => ({
            completed: [changedItems[index], ...prevState.completed]
        }))

        this.setState({
            confirms: changedItems.filter(item => item.status === 'confirmed')
        })

        // this.setState(prevState => ({
        //     confirms: [
        //         prevState.confirms[index].status = !prevState.confirms[index].status,
        //         ...prevState.confirms
        //     ]
        // }))
        console.log('put request for /orders')
        console.log('changedItems[index]:', changedItems[index])
        // put request
        axios.put(`/orders/${changedItems[index]._id}`, changedItems[index], {
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
                    // this.props.history.push(`/items/show/${response.data._id}`)
                    // window.location.href = '/items'

                }
            })
    }

    render() {
        return (
            <div>
                <button id="ShowButton" onClick={() => {
                    var navBarElement = document.getElementById("Nav-bar")
                    navBarElement.style.display = "block"

                    var showElement = document.getElementById("ShowButton")
                    showElement.style.display = "none"

                }}>Show</button>
                <div style={{ "margin": "10px" }}>
                    <div style={{ "backgroundColor": "burlywood" }}>
                        <h1>Approve orders - {this.state.approves.length}</h1>

                        <Table style={{ "fontWeight": "bold" }}>
                            <caption>
                                {/* <h1>Approve orders - {this.state.approves.length}</h1> */}

                            </caption>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table" >Sl no</Th>
                                    <Th className="listing-table" >Name</Th>
                                    <Th className="listing-table" >Actions</Th>
                                    <Th className="listing-table" >Date</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    this.state.approves.map((item, i) => {
                                        return (
                                            <Tr key={item._id}>
                                                <Td className="listing-table" >{i + 1}</Td>
                                                <Td className="listing-table" ><Link to={`/orders/${item._id}`}>{item.customer.fullName}</Link></Td>
                                                <Td className="listing-table" >
                                                    <button>Update</button>

                                                    <button onClick={() => {
                                                        this.handleRemoveOrder(item._id, item.customer.fullName)
                                                    }}>Remove</button>
                                                    <button onClick={() => {
                                                        this.handleApproveOrder(item._id)
                                                    }}>Approve</button>
                                                </Td>
                                                <Td className="listing-table" >{
                                                    item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                }</Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </div>

                    <div style={{ "backgroundColor": "#2eec4e" }}>
                        <h1>Confirmed orders - {this.state.confirms.length}</h1>
                        <input placeholder="Search Order" />
                        <button>Search</button>

                        <Link to='/menu'><button>Add new Order</button></Link>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table" >Sl no</Th>
                                    <Th className="listing-table" >Name</Th>
                                    <Th className="listing-table" >Update</Th>
                                    <Th className="listing-table" >Date</Th>
                                    <Th className="listing-table" >Remove</Th>
                                    <Th className="listing-table" >Completed</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    this.state.confirms.map((item, i) => {
                                        return (
                                            <Tr key={item._id}>
                                                <Td className="listing-table" >{i + 1}</Td>
                                                <Td className="listing-table" ><Link to={`/orders/${item._id}`}>{item.customer.fullName}</Link></Td>
                                                <Td className="listing-table" ><button>update</button></Td>
                                                <Td className="listing-table" >{
                                                    item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                }</Td>
                                                <Td className="listing-table" ><button onClick={() => {
                                                    this.handleRemoveOrder(item._id, item.customer.fullName)
                                                }}>Remove</button></Td>
                                                <Td className="listing-table" ><button onClick={() => {
                                                    this.handleCompleteOrder(item._id)
                                                }}>Completed</button></Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </div>

                    <div style={{ "backgroundColor": "yellow" }}>
                        <h1>Completed orders -{this.state.completed.length}</h1>
                        <input placeholder="Search Order" />
                        <button>Search</button>
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table">Sl no</Th>
                                    <Th className="listing-table">Name</Th>
                                    <Th className="listing-table">Date</Th>
                                    <Th className="listing-table">Remove</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {
                                    this.state.completed.map((item, i) => {
                                        return (
                                            <Tr key={item._id}>
                                                <Td className="listing-table" >{i + 1}</Td>
                                                <Td className="listing-table" ><Link to={`/orders/${item._id}`}>{item.customer.fullName}</Link></Td>
                                                <Td className="listing-table" >{
                                                    item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                }</Td>
                                                <Td className="listing-table" ><button onClick={() => {
                                                    this.handleRemoveOrder(item._id, item.customer.fullName)
                                                }}>Remove</button></Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        );
    }
}