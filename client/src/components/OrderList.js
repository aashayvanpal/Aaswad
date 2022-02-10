import React, { Component } from 'react';
import axios from '../config/axios'
import { Link } from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/app-css.css'
import '../css/OrderList.css'
import NavigationBar from './NavigationBar';
import confirm from 'reactstrap-confirm'
import ShowBtn from '../assets/ShowBtn';
import deleteImg from '../images/delete-icon.png'
import approveImg from '../images/approve-icon.png'
import homeDeliveryMan from '../images/home-delivery-man.png'
import serviceGif from '../images/service.gif'
import upArrow from '../images/up-arrow.png'
import downArrow from '../images/down-arrow.png'

export default class ItemList extends Component {
    constructor() {
        super()
        this.state = {
            orders: [],
            approves: [],
            confirmed: [],
            completed: []
        }
        this.handleRemoveOrder = this.handleRemoveOrder.bind(this)
        this.handleApproveOrder = this.handleApproveOrder.bind(this)
        this.handleCompleteOrder = this.handleCompleteOrder.bind(this)
        this.handleChange = this.handleChange.bind(this)
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
                const orders = response.data
                console.log('items after request :', orders)
                this.setState({ orders })

                // filter for approve 
                const approves = orders.filter(order => order.status === 'approve')
                console.log('approves filtered:', approves)
                this.setState({ approves })

                // filter for confirmed 
                const confirmed = orders.filter(order => order.status === 'confirmed')
                console.log('confirmed filtered:', confirmed)
                this.setState({ confirmed })

                // filter for completed 
                const completed = orders.filter(order => order.status === 'completed')
                console.log('completed filtered:', completed)
                this.setState({ completed })

                console.log('approves state:', this.state.approves)
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleChange = (e, status) => {
        console.log('inside search handleChange')
        console.log(e.target.value)
        const statusFilter = this.state.orders.filter(order => order.status === status)
        console.log('filtered:', statusFilter)
        const nameFilter = statusFilter.filter(order => order.customer.fullName.toLowerCase().includes(e.target.value.toLowerCase()))
        this.setState({ [status]: nameFilter })

    }

    async handleRemoveOrder(id, name) {
        console.log('remove this id:', id)
        console.log('remove this name:', name)
        // const change = this.state.approves.filter(item => item._id !== id)
        // add confirmation here
        let result = await confirm({
            title: (
                <div style={{ "color": "black", "fontWeight": "bold" }}>
                    Delete Order Confirmation
                </div>
            ),
            message: (
                <div style={{ "color": "green" }}>
                    Are you sure you want to delete : {name}??
                </div>
            ),
            confirmText: "Delete",
            confirmColor: "warning",
            cancelColor: "link text-danger",
            classNames: 'confirmModal'
        })
        console.log("result is :", result)

        if (result) {
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
                        confirmed: prevState.confirmed.filter(item => item._id !== response.data._id)
                    }))

                    this.setState((prevState) => ({
                        completed: prevState.completed.filter(item => item._id !== response.data._id)
                    }))

                    this.setState((prevState) => ({
                        orders: prevState.orders.filter(item => item._id !== response.data._id)
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
            confirmed: [changedItems[index], ...prevState.confirmed]
        }))

        this.setState({
            approves: changedItems.filter(item => item.status === 'approve')
        })

        // this.setState(prevState => ({
        //     confirmed: [
        //         prevState.confirmed[index].status = !prevState.confirmed[index].status,
        //         ...prevState.confirmed
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
        const foundItem = this.state.confirmed.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s status before:', foundItem.status)

        // this.setState(prevState => ({
        //     display: !prevState.display
        //   }));

        // console.log('current state id',this.state.items.id[itemToToggle])
        console.log('Edit item : ', foundItem)


        const index = this.state.confirmed.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of confirmed :', this.state.confirmed)
        console.log('spread :', ...this.state.confirmed)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = this.state.confirmed
        changedItems[index].status = 'completed'

        this.setState((prevState) => ({
            completed: [changedItems[index], ...prevState.completed]
        }))

        this.setState({
            confirmed: changedItems.filter(item => item.status === 'confirmed')
        })

        // this.setState(prevState => ({
        //     confirmed: [
        //         prevState.confirmed[index].status = !prevState.confirmed[index].status,
        //         ...prevState.confirmed
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

    sortAscending = (key) => {
        console.log(this.state[key])
        this.setState({
            key: this.state[key].sort(function (a, b) {
                return (a.customer.eventDate < b.customer.eventDate) ? -1 : ((a.customer.eventDate > b.customer.eventDate) ? 1 : 0);
            })
        })
    }
    sortDescending = (key) => {
        this.setState({
            key: this.state[key].sort(function (a, b) {
                return (a.customer.eventDate > b.customer.eventDate) ? -1 : ((a.customer.eventDate < b.customer.eventDate) ? 1 : 0);
            })
        })
    }
    render() {
        return (
            <div>
                <ShowBtn />
                <div style={{ 'display': 'flex' }}>
                    <NavigationBar />
                    <div style={{ "margin": "10px", "width": "100%" }}>
                        <div className='order-container' style={{ "backgroundColor": "#e3c57e" }}>
                            <h2 style={{ 'textAlign': 'center', marginBottom: '20px', fontWeight: 'bold' }}>Approve orders - {this.state.approves.length}</h2>

                            <Table className='table-styling' style={{ "fontWeight": "bold" }}>
                                <caption>
                                    {/* <h1>Approve orders - {this.state.approves.length}</h1> */}

                                </caption>
                                <Thead>
                                    <Tr>
                                        <Th className="listing-table" >Sl no</Th>
                                        <Th className="listing-table" >Date <button onClick={() => this.sortAscending('approves')}><img src={upArrow} alt="upArrow" height="15px" width="15px" /></button>
                                            <button onClick={() => this.sortDescending('approves')}><img src={downArrow} alt="downArrow" height="15px" width="15px" /></button>
                                        </Th>
                                        <Th className="listing-table" >Name</Th>
                                        <Th className="listing-table" >Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        this.state.approves.map((item, i) => {
                                            return (
                                                <Tr key={item._id}>
                                                    <Td className="listing-table" >{i + 1}</Td>

                                                    <Td className="listing-table" >{
                                                        item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                    }</Td>
                                                    <Td className="listing-table" ><Link to={`/orders/${item._id}`}><h3>{item.customer.fullName} {item.customer.homeDelivery ? (<img src={homeDeliveryMan} alt="homeDeliveryIcon" height='35px' width='35px' />) : null}
                                                        {item.customer.service ? (<img src={serviceGif} alt="serviceGif" height='35px' width='35px' />) : null}
                                                    </h3></Link>
                                                        {item.customer.queries && <>Notes - {item.customer.queries}</>}

                                                    </Td>

                                                    <Td className="listing-table">
                                                        {/* Responsiveness lost if displayed as flex */}
                                                        {/* <div style={{
                                                            "display": "flex",
                                                            "justifyContent": "space-evenly",
                                                        }}> */}
                                                        {/* mobile CSS:
                                                            display: flex;
                                                            flex-direction: column;
                                                        */}
                                                        <button>Update</button>

                                                        <button className="button-color5" onClick={() => {
                                                            this.handleRemoveOrder(item._id, item.customer.fullName)
                                                        }}>
                                                            <img src={deleteImg} alt="" style={{
                                                                "filter": "brightness(0) invert(1)", height: '30px', width: '30px'
                                                            }} />
                                                        </button>
                                                        <button className="button-color6" onClick={() => {
                                                            this.handleApproveOrder(item._id)
                                                        }}>
                                                            <img src={approveImg} alt="" height='25px' width='25px' />
                                                        </button>
                                                        {/* </div> */}
                                                    </Td>

                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </div>

                        <div className='order-container' style={{ "backgroundColor": "#98c8ab" }}>
                            <h2 style={{ textAlign: 'center', margin: '0px', fontWeight: 'bold' }}>Confirmed orders - {this.state.confirmed.length}</h2>
                            <div className='order-functions'>
                                <input placeholder="Search Order" onChange={(e) => this.handleChange(e, 'confirmed')} className='order-search' />
                                <button className='order-button-styling' > Clear</button>
                                <Link to='/menu'><button className='order-button-styling'>Add new Order</button></Link>
                            </div>
                            <Table className='table-styling'>
                                <Thead>
                                    <Tr>
                                        <Th className="listing-table" >Sl no</Th>
                                        <Th className="listing-table" >Date
                                            <button onClick={() => this.sortAscending('confirmed')}><img src={upArrow} alt="upArrow" height="15px" width="15px" /></button>
                                            <button onClick={() => this.sortDescending('confirmed')}><img src={downArrow} alt="downArrow" height="15px" width="15px" /></button>
                                        </Th>
                                        {/* <Th className="listing-table" >Update</Th> */}
                                        <Th className="listing-table" >Name</Th>
                                        <Th className="listing-table" >Delete</Th>
                                        <Th className="listing-table" >Completed</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        this.state.confirmed.map((item, i) => {
                                            return (
                                                <Tr key={item._id}>
                                                    <Td className="listing-table" >{i + 1}</Td>
                                                    <Td className="listing-table" >{
                                                        item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                    }</Td>
                                                    <Td className="listing-table" ><Link to={`/orders/${item._id}`}><h3>{item.customer.fullName} {item.customer.homeDelivery ? (<img src={homeDeliveryMan} alt="homeDeliveryIcon" height='35px' width='35px' />) : null}
                                                        {item.customer.service ? (<img src={serviceGif} alt="serviceGif" height='35px' width='35px' />) : null}
                                                    </h3></Link></Td>
                                                    {/* <Td className="listing-table" ><button>update</button></Td> */}

                                                    <Td className="listing-table" ><button className='button-color5' onClick={() => {
                                                        this.handleRemoveOrder(item._id, item.customer.fullName)
                                                    }}>
                                                        <img src={deleteImg} alt="" height='20px' width='20px' />
                                                        Delete</button></Td>
                                                    <Td className="listing-table" ><button className='button-color6' onClick={() => {
                                                        this.handleCompleteOrder(item._id)
                                                    }}>
                                                        <img src={approveImg} alt="" height='20px' width='20px' />
                                                        Completed</button></Td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </div>

                        <div className='order-container' style={{ "backgroundColor": "#d7c7aa" }}>
                            <h2 style={{ 'textAlign': 'center', margin: '0px', fontWeight: 'bold' }}>Completed orders -{this.state.completed.length}</h2>
                            <div className='order-functions'>
                                <input placeholder="Search Order" className='order-search' onChange={(e) => this.handleChange(e, 'completed')} />
                                <button className='order-button-styling'>Clear</button>
                            </div>
                            <Table className='table-styling'>
                                <Thead>
                                    <Tr>
                                        <Th className="listing-table">Sl no</Th>
                                        <Th className="listing-table">Name</Th>
                                        <Th className="listing-table">Date
                                            <button onClick={() => this.sortAscending('completed')}><img src={upArrow} alt="upArrow" height="15px" width="15px" /></button>
                                            <button onClick={() => this.sortDescending('completed')}><img src={downArrow} alt="downArrow" height="15px" width="15px" /></button>
                                        </Th>
                                        <Th className="listing-table">Delete</Th>
                                    </Tr>
                                </Thead>

                                <Tbody>
                                    {
                                        this.state.completed.map((item, i) => {
                                            return (
                                                <Tr key={item._id}>
                                                    <Td className="listing-table" >{i + 1}</Td>
                                                    <Td className="listing-table" ><Link to={`/orders/${item._id}`}><h3>{item.customer.fullName} {item.customer.homeDelivery ? (<img src={homeDeliveryMan} alt="homeDeliveryIcon" height='35px' width='35px' />) : null}
                                                        {item.customer.service ? (<img src={serviceGif} alt="serviceGif" height='35px' width='35px' />) : null}
                                                    </h3></Link></Td>
                                                    <Td className="listing-table" >{
                                                        item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                    }</Td>
                                                    <Td className="listing-table" ><button className='button-color5' onClick={() => {
                                                        this.handleRemoveOrder(item._id, item.customer.fullName)
                                                    }}>
                                                        <img src={deleteImg} alt="" height='20px' width='20px' />
                                                        Delete</button></Td>
                                                </Tr>
                                            )
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}