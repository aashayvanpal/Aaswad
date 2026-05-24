import axios from '../config/axios.js'
import React, { useState, useEffect } from 'react'
import ConfirmDialog from './ConfirmDialog'
import { Link } from 'react-router-dom'
import '../css/OrderList.scss'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import deleteImg from '../images/delete-icon.png'
import approveImg from '../images/approve-icon.png'
import ShowBtn from '../assets/ShowBtn';
import NavigationBar from './NavigationBar';


const MultiOrder = () => {

    const [orders, setOrders] = useState([])
    const [approves, setApproves] = useState([])
    const [confirmed, setConfirmed] = useState([])
    const [completed, setCompleted] = useState([])
    const [confirmState, setConfirmState] = useState({ open: false })

    useEffect(() => {
        //  get request to display all multi orders
        axios.get('/multiOrders', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                // console.log('Data : ', response.data)
                const orders = response.data

                console.log('fetching all multiOrders :', orders)
                setOrders(orders)

                // // filter for approve 
                const approves = orders.filter(order => order.status === 'approve')
                console.log('approves filtered:', approves)
                setApproves(approves)

                // // filter for confirmed 
                const confirmed = orders.filter(order => order.status === 'confirmed')
                console.log('confirmed filtered:', confirmed)
                setConfirmed(confirmed)

                // // filter for completed 
                const completed = orders.filter(order => order.status === 'completed')
                console.log('completed filtered:', completed)
                setCompleted(completed)

                // console.log('approves state:', approves)
            })
            .catch(err => {
                console.log(err)
            })
        // setting state for multiorders

    }, [])

    const handleApproveOrder = (id) => {
        console.log('clicked on Approve Button ')
        console.log('Approve this order id: ', id)
        // change status from approve to confirmed
        // you have found the id, you have to get the whole item 
        const foundItem = approves.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s status before:', foundItem.status)

        // console.log('current state id',this.state.items.id[itemToToggle])
        console.log('Edit item : ', foundItem)

        const index = approves.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of approves :', approves)
        console.log('spread :', ...approves)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = approves
        changedItems[index].status = 'confirmed'

        setConfirmed([changedItems[index], ...confirmed])

        setApproves(changedItems.filter(item => item.status === 'approve'))

        console.log('put request for /orders')
        console.log('changedItems[index]:', changedItems[index])
        // put request
        axios.put(`/multiOrders/${changedItems[index]._id}`, changedItems[index], {
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
                    // order approved email notification
                    console.log('changed items ', changedItems)
                    axios.post('/sendEmail/orderApproved', {
                        'fullName': changedItems[index].customer.fullName,
                        'email': changedItems[index].customer.email,
                        'phonenumber': changedItems[index].customer.phoneNumber
                    })
                        .catch(err => console.error('[MultiOrder] orderApproved email failed:', err))
                    console.log('completed Sending email!')

                }
            })
            .catch(err => console.error('[MultiOrder] approve order failed:', err))
    }

    const handleCompleteOrder = (id) => {
        console.log('clicked on Completed Button ')
        console.log('Approve this order id: ', id)
        // change status from approve to confirmed
        // you have found the id, you have to get the whole item 
        const foundItem = confirmed.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s status before:', foundItem.status)

        console.log('Edit item : ', foundItem)


        const index = confirmed.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of confirmed :', confirmed)
        console.log('spread :', ...confirmed)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = confirmed
        changedItems[index].status = 'completed'

        setCompleted([changedItems[index], ...completed])

        setConfirmed(changedItems.filter(item => item.status === 'confirmed'))


        console.log('put request for /orders')
        console.log('changedItems[index]:', changedItems[index])
        // put request
        axios.put(`/multiOrders/${changedItems[index]._id}`, changedItems[index], {
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

                    // order completed email
                    axios.post('/sendEmail/orderCompleted', { 'email': response.data.customer.email })
                        .catch(err => console.error('[MultiOrder] orderCompleted email failed:', err))

                }
            })
            .catch(err => console.error('[MultiOrder] complete order failed:', err))
    }

    const handleRemoveOrder = (id, name) => {
        console.log('remove this id:', id)
        console.log('remove this name:', name)

        setConfirmState({
            open: true,
            title: 'Delete Order Confirmation',
            message: `Are you sure you want to delete : ${name}??`,
            onConfirm: () => {
                setConfirmState(s => ({ ...s, open: false }))
                axios.delete(`/multiOrders/${id}`, {
                    headers: { 'x-auth': localStorage.getItem('token') }
                })
                    .then((response) => {
                        console.log('response data', response.data)
                        setApproves(a => a.filter(item => item._id !== response.data._id))
                        setConfirmed(c => c.filter(item => item._id !== response.data._id))
                        setCompleted(c => c.filter(item => item._id !== response.data._id))
                        setOrders(o => o.filter(item => item._id !== response.data._id))
                    })
                    .catch((err) => console.log('there is an error!', err))
            }
        })
    }
    return (
        <div>
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                confirmText="Delete"
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState(s => ({ ...s, open: false }))}
            />
            <ShowBtn />
            <div className="multiorder-layout">
                <NavigationBar />

                <div className="multiorder-content">
                    <h2 className="multiorder-section-heading">Multiple date orders list</h2>

                    <div className='order-container order-container--approve'>

                        <h2 className="multiorder-section-heading">Approve orders - {approves.length}</h2>

                        <Table className='table-styling multiorder-table'>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table">Sl no</Th>
                                    <Th className="listing-table">Name</Th>
                                    <Th className="listing-table">options</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {approves.map((order, i) => {
                                    const { fullName } = order.customer
                                    // console.log(order.orderDates)
                                    var keys = Object.keys(order.orderDates);
                                    return (<Tr key={order._id}>
                                        <Td className="listing-table">{i + 1}.</Td>
                                        <Td className="listing-table">
                                            <Link to={`/multiorders/${order._id}`}>{fullName}</Link><br />
                                            <div>
                                                {order.orderDates.map(o => {
                                                    return (
                                                        <div key={Object.keys(o)}>{Object.keys(o)}</div>
                                                    )
                                                })}<br />
                                            </div>
                                        </Td>
                                        <Td className="listing-table">
                                            <button className="button-color6" onClick={() => handleApproveOrder(order._id)}>
                                                <img src={approveImg} alt="" height='25px' width='25px' />
                                            </button>
                                            <button className="button-color5" onClick={() => handleRemoveOrder(order._id, fullName)}>
                                                <img src={deleteImg} alt="" className="delete-btn-icon" />
                                            </button>
                                        </Td>
                                    </Tr>)
                                })}
                            </Tbody>
                        </Table>
                    </div>

                    <div className='order-container order-container--confirmed'>

                        <h2 className="multiorder-section-heading"> Confirmed orders - {confirmed.length}</h2>

                        <Table className='table-styling multiorder-table'>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table">Sl no</Th>
                                    <Th className="listing-table">Name</Th>
                                    <Th className="listing-table">options</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {confirmed.map((order, i) => {
                                    const { fullName } = order.customer
                                    // console.log(order.orderDates)
                                    var keys = Object.keys(order.orderDates);
                                    return (<Tr key={order._id}>
                                        <Td className="listing-table">{i + 1}.</Td>
                                        <Td className="listing-table">
                                            <Link to={`/multiorders/${order._id}`}>{fullName}</Link><br />
                                            <div>
                                                {order.orderDates.map(o => {
                                                    return (
                                                        <div key={Object.keys(o)}>{Object.keys(o)}</div>
                                                    )
                                                })}<br />
                                            </div>
                                        </Td>
                                        <Td className="listing-table">
                                            <button className="button-color6" onClick={() => handleCompleteOrder(order._id)}>
                                                <img src={approveImg} alt="" height='25px' width='25px' />
                                                Completed
                                            </button>
                                            <button className="button-color5" onClick={() => handleRemoveOrder(order._id, fullName)}>
                                                <img src={deleteImg} alt="" className="delete-btn-icon" />
                                                delete
                                            </button>
                                        </Td>
                                    </Tr>)
                                })}
                            </Tbody>
                        </Table>
                    </div>

                    <div className='order-container order-container--completed'>

                        <h2 className="multiorder-section-heading"> Completed orders - {completed.length}</h2>

                        <Table className='table-styling multiorder-table'>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table">Sl no</Th>
                                    <Th className="listing-table">Name</Th>
                                    <Th className="listing-table">options</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {completed.map((order, i) => {
                                    const { fullName } = order.customer
                                    // console.log(order.orderDates)
                                    var keys = Object.keys(order.orderDates);
                                    return (<Tr key={order._id}>
                                        <Td className="listing-table">{i + 1}.</Td>
                                        <Td className="listing-table">
                                            <Link to={`/multiorders/${order._id}`}>{fullName}</Link><br />
                                            <div>
                                                {order.orderDates.map(o => {
                                                    return (
                                                        <div key={Object.keys(o)}>{Object.keys(o)}</div>
                                                    )
                                                })}<br />
                                            </div>
                                        </Td>
                                        <Td className="listing-table">
                                            <button className="button-color5" onClick={() => handleRemoveOrder(order._id, fullName)}>
                                                <img src={deleteImg} alt="" className="delete-btn-icon" />
                                                delete</button>
                                        </Td>
                                    </Tr>)
                                })}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MultiOrder