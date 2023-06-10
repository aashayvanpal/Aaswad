import React, { useState, useEffect } from 'react'
import axios from '../config/axios.js'
import _, { set } from 'lodash'
import { Link } from 'react-router-dom'
import AdvancePaymentForm from './order/AdvancePaymentForm.js'
import AdvanceTable from './order/AdvanceTable.js'
import TransportForm from './order/TransportForm.js'
import TransportTable from './order/TransportTable.js'
import '../css/myOrdersShow.css'
// renderDetails is incomplete Fix!

const MultiOrderShow = () => {

    const [order, setOrder] = useState({})
    const [dates, setDates] = useState([])
    // const [selectedOrder, setSelectedOrder] = useState({ index: 1, date: '20/07/2022', orderType: 'Lunch' })
    const [selectedOrder, setSelectedOrder] = useState('undefined')
    const [orderId, setOrderId] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [status, setStatus] = useState('')
    const [orderDates, setOrderDates] = useState([])
    const [showComponent, setShowComponent] = useState(false)
    const [showAdvancePaymentForm, setShowAdvancePaymentForm] = useState(false)
    const [showTransportForm, setShowTransportForm] = useState(false)
    const [advanceAmount, setAdvanceAmount] = useState(0)
    const [rate, setRate] = useState(0)
    const [medium, setMedium] = useState('')
    const [balanceAmount, setBalanceAmount] = useState(0)
    const [total, setTotal] = useState(0)


    useEffect(async () => {
        console.log('inside MultiOrder Show component useEffect !')
        console.log('id to show', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[4]
        await axios.get(`/multiOrders/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const order = response.data
                setOrder(order)
                console.log('MultiOrder found :', order)
                console.log('fullname :', order.customer.fullName)
                console.log('id :', order._id)

                let id = order._id
                let customer_id = order.customer.customer_id
                let fullName = order.customer.fullName
                let email = order.customer.email
                let phoneNumber = order.customer.phoneNumber
                let address = order.customer.address
                let status = order.status
                let orderDates = order.orderDates
                let advanceAmount = order.AdvanceAmount
                let total = order.total
                setTotal(total)

                if (order.transport) {
                    let medium = order.transport.medium
                    let rate = order.transport.rate
                    setMedium(medium)
                    setRate(rate)
                    if ((advanceAmount != 'undefined')) {
                        console.log('else undefined part', balanceAmount + order.total - order.AdvanceAmount + order.transport.rate)
                        setBalanceAmount(balanceAmount + order.total - order.AdvanceAmount + order.transport.rate)
                    }
                } else {
                    console.log('else part final')
                    setBalanceAmount(total)
                    // setRate(0)
                }

                console.log('fetching', { id, customer_id, fullName, email, phoneNumber, address, status })

                setOrderId(id)
                setCustomerId(customer_id)
                setFullName(fullName)
                setEmail(email)
                setPhoneNumber(phoneNumber)
                setAddress(address)
                setStatus(status)
                setAdvanceAmount(advanceAmount)
                setOrderDates(orderDates)
                setSelectedOrder({ index: 0, date: Object.keys(orderDates[0])[0], orderType: 'Breakfast' })
                console.log('check here order dates', orderDates)
                console.log(Object.keys(orderDates[0])[0])



                const dates = orderDates.map(order => Object.keys(order)[0])
                setDates(dates)

                const emptyDates = dates.map(date =>
                ({
                    [date]: {
                        'Breakfast': { items: [] },
                        'Lunch': { items: [] },
                        'Dinner': { items: [] }
                    }
                }))
                const combinedDates = _.merge(orderDates, emptyDates)
                console.log('debug===:', combinedDates)
                setOrderDates(combinedDates)

                setShowComponent(true)
            })
    }, [])

    const itemRender = () => {
        return <>{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items.length !== 0 ?
            (<tbody>
                {
                    orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items.map((item, i) => {
                        const { name, price, quantity, measured } = item
                        return (<tr>
                            <td>{i + 1}</td>
                            <td>{name}</td>
                            <td>{price}</td>
                            <td>{quantity} {measured}</td>
                            <td>{quantity * price}</td>
                        </tr>)
                    })
                }
                {<td colSpan={4}></td>}
            </tbody>) : (null)}</>

    }

    const renderBLD = () => {
        return <>
            {(selectedOrder !== 'undefined' ? (
                <>
                    {
                        <ul style={{
                            "display": "flex",
                            "justifyContent": "space-evenly",
                            "listStyle": "none"
                        }}>
                            <li className='BLD-li'
                                onClick={() => {
                                    setSelectedOrder({ index: selectedOrder.index, date: selectedOrder.date, orderType: 'Breakfast' })
                                    console.log('selectedOrder', selectedOrder)
                                }
                                } >Breakfast</li>
                            <li className='BLD-li'
                                onClick={() => {
                                    setSelectedOrder({ index: selectedOrder.index, date: selectedOrder.date, orderType: 'Lunch' })
                                    console.log('selectedOrder', selectedOrder)
                                }}>Lunch</li>
                            <li className='BLD-li'
                                onClick={() => {
                                    setSelectedOrder({ index: selectedOrder.index, date: selectedOrder.date, orderType: 'Dinner' })
                                    console.log('selectedOrder', selectedOrder)
                                }}>Dinner</li>
                        </ul>
                    }
                    {selectedOrder.index} - {selectedOrder.date} - {selectedOrder.orderType}
                </>
            ) : (null))}
        </>
    }


    const renderDetails = () => {
        return <>
            {selectedOrder !== 'undefined' ? (<>
                {/* Event Name :{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].eventName} <br /> */}
                {/* Number of People :{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].numberOfPeople}<br /> */}
                {/* Notes :{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].notes}<br /> */}
                {/* Home Delivery :{(orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].homedelivery) ? ("Yes") : ("No")}<br /> */}
                {/* Service :{(orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].service) ? ("Yes") : ("No")}<br /> */}
            </>) : (null)}
        </>
    }

    const renderAmounts = () => {
        return <>
            {selectedOrder !== 'undefined' ? (<>
                Grand Total : {total}<br />
                Balance Amount : {balanceAmount}<br />
            </>) : (null)}
        </>
    }

    const ShowAdvancePaymentForm = () => {
        setShowAdvancePaymentForm(false)
    }
    const ShowTransportForm = () => {
        setShowTransportForm(false)
    }

    const ShowAdvancePaymentTable = (amount) => {
        // change the order model
        // create controller
        // post request to update transport
        console.log('id to edit', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[4]

        axios.put(`/multiOrders/${id}`, { "AdvanceAmount": amount }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data

                console.log('Edited order :', item)
                setAdvanceAmount(amount)
                setBalanceAmount(balanceAmount - amount)
                setOrder(item)
                // const oldAmount = JSON.parse(localStorage.getItem('order'))
                // oldAmount.advanceAmount = advanceAmount
                // localStorage.setItem('order', JSON.stringify(oldAmount))
                // console.log('order amount to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })
    }

    const ShowTransportTable = (medium, rate) => {
        // change the order model
        // create controller
        // post request to update transport
        console.log('id to edit', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[4]

        axios.put(`/multiOrders/${id}`, { "transport": { "medium": medium, "rate": rate } }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data

                console.log('Edited order :', item)
                setMedium(medium)
                setRate(rate)
                setBalanceAmount(Number(balanceAmount) + Number(rate))
                // const oldmedium = JSON.parse(localStorage.getItem('order'))
                // oldmedium.medium = medium
                // oldmedium.rate = rate
                // localStorage.setItem('order', JSON.stringify(oldmedium))
                // console.log('orer to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })

    }

    const deleteAdvancePaymentTable = () => {
        console.log('inside parent to delete the AdvancePayment table')
        // put request to delete the transport table
        console.log('check for state here', order)
        const { _id } = order
        setBalanceAmount(Number(balanceAmount) + Number(advanceAmount))

        axios.put(`/multiOrders/${_id}`, { AdvanceAmount: '' }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data

                console.log('Edited order :', item)
                setAdvanceAmount(null)
                delete item.AdvanceAmount
                // console.log("--Debug-- latest:", { ...item.customer })
                // const newObj = { ...item.customer, items: item.items, status: item.status, ...item.transport, _id: item._id }
                // console.log("--Debug-- latest check for flat:", newObj)
                // localStorage.setItem('order', JSON.stringify(newObj))
                // console.log('order amount to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })
    }

    const deleteTransportTable = () => {
        console.log('inside parent to delete the transport table')
        // put request to delete the transport table
        console.log('check for state here', order)
        const { _id } = order
        setBalanceAmount(Number(balanceAmount) - Number(rate))
        axios.put(`/multiOrders/${_id}`, { transport: {} }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data

                console.log('Edited order :', item)
                setMedium('')
                setRate('')
                // const oldTransport = JSON.parse(localStorage.getItem('order'))
                // delete oldTransport.transport
                // localStorage.setItem('order', JSON.stringify(oldTransport))
                // console.log('order amount to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })
    }
    const generateBillDelivery = () => {
        console.log("Print Delivery button clicked!")
        console.log("Find order id and assign to orderid")
        // console.log(id)
        // const orderid = this.state.id

        console.log('order bill check', { ...order, balanceAmount, transport: { medium, rate } })
        localStorage.setItem('order', JSON.stringify({
            ...order, total: (Number(rate) + Number(order.total)),
            balanceAmount,
            transport: { medium, rate }
        }))
        window.open(window.location.href + `/printDelivery`, '_blank')
    }
    return (
        <div >
            <div id='OrderShowContainer'>
                <div id='ShowContainer1'>
                    <Link to="/multiorders">
                        <button className='styled-btn'>
                            <img src="/static/media/back-icon.5fdd76d3.png" alt="backIcon" height="30px" width="30px" />
                            Back</button></Link>
                    <button className='styled-btn'>
                        <img src="/static/media/update-icon.67816de3.jpg" alt="updateIcon" height="30px" width="30px" />
                        Edit</button>
                    <h2>Showing Multi-order Details:-</h2>
                    <h2>Name :{fullName}</h2>
                    <h2>Email :{email}</h2>
                    <h2>PhoneNumber :{phoneNumber}</h2>
                    <h2>Address :{address}</h2>
                    <h2>Status :{status}</h2>
                    <h2>Orderid :{orderId}</h2>
                    {renderDetails()}
                </div>

                <div id='ShowContainer2'>
                    {showComponent && <div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            {dates.map((date, i) =>
                                <button
                                    style={{
                                        backgroundColor: '#ff881a',
                                        borderRadius: '5px',
                                        padding: '10px',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => {
                                        setSelectedOrder({ index: i, date, orderType: selectedOrder['orderType'] })
                                        console.log('selectedIndex', selectedOrder)
                                    }
                                    }>{date}</button>
                            )}
                        </div>

                        {renderBLD()}

                        {(orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items.length !== 0) ? (
                            <div>
                                <table className='render-table'>
                                    <thead style={{ border: "2px solid black" }}>
                                        <tr>
                                            <td>Sl No</td>
                                            <td>Name</td>
                                            <td>Price</td>
                                            <td>Quantity</td>
                                            <td>Amount</td>
                                        </tr>
                                    </thead>
                                    {itemRender()}
                                </table>
                                Order total :{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].amount}
                                <br />
                                {renderAmounts()}

                                <button
                                    className='styled-btn'
                                    onClick={() => {
                                        setShowTransportForm(!showTransportForm)
                                    }}>
                                    <img src="/static/media/transport-icon.58cfff96.png" alt="transportIcon" height="30px" width="30px"></img>
                                    Enter Transport</button>
                                <button
                                    className='styled-btn'
                                    onClick={() => {
                                        setShowAdvancePaymentForm(!showAdvancePaymentForm)
                                    }}>
                                    <img src="/static/media/payment-icon.2c9687e8.png" alt="advanceIcon" height="30px" width="30px"></img>
                                    Enter Advance Payment</button>

                                {showAdvancePaymentForm && <AdvancePaymentForm
                                    ShowAdvancePaymentTable={ShowAdvancePaymentTable}
                                    ShowAdvancePaymentForm={ShowAdvancePaymentForm}
                                    advanceAmount={advanceAmount}
                                />}
                                {advanceAmount && <AdvanceTable
                                    deleteTable={deleteAdvancePaymentTable}
                                    advanceAmount={advanceAmount}
                                />}

                                {showTransportForm && <TransportForm
                                    ShowTransportForm={ShowTransportForm}
                                    ShowTransportTable={ShowTransportTable}
                                    price={rate}
                                    medium={medium}
                                />}

                                {medium ? (
                                    <TransportTable
                                        deleteTable={deleteTransportTable}
                                        medium={medium}
                                        rate={rate} />
                                ) : null}
                                <br />
                                <button
                                    className='styled-btn'
                                    onClick={() => generateBillDelivery()}>
                                    <img src="/static/media/billing-icon.cfaf1bcb.jpg" alt="billIcon" width="30px" height="30px"></img>
                                    Generate Bill</button>

                            </div>
                        ) : (null)}

                    </div>}

                </div>
            </div>
        </div >
    )
}

export default MultiOrderShow