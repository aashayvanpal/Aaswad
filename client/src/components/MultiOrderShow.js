import React, { useState, useEffect } from 'react'
import axios from '../config/axios.js'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import AdvancePaymentForm from './order/AdvancePaymentForm.js'
import AdvanceTable from './order/AdvanceTable.js'

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
    const [advanceAmount, setAdvanceAmount] = useState('')



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

                // console.log('fetching', { id, customer_id, fullName, email, phoneNumber, address, status, orderDates })
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
                // console.log('debug===:', orderDates[0]['19/07/2022']['Lunch'].items)
                // console.log('debug===final:', orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items)
                // console.log('debug===final:', orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items)



                // console.log('check here', allItems)



                // let numberOfPeople = order.customer.numberOfPeople
                // console.log('numberOfPeople :', order.customer.numberOfPeople)

                // let eventTime = order.customer.eventTime
                // let queries = order.customer.queries

                // let homeDelivery = order.customer.homeDelivery
                // console.log('homeDelivery', homeDelivery)
                // let service = order.customer.service
                // let items = order.items
                // console.log("====debug items====", items)
                // let eventDate = order.customer.eventDate.toString()
                // let advanceAmount = order.AdvanceAmount
                // // console.log("Event Date check:", eventDate)
                // // console.log("Event Date check typeof:", typeof (eventDate))
                // // console.log("Event Date check here:", eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4))
                // eventDate = eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4)
                // // console.log("The Date is :",eventDate.subStr(8, 2) + "/" + eventDate.subStr(5, 2) + "/" + eventDate.subStr(0, 4))

                // setSelectedItems([...items])

                // if (order.transport) {
                //     console.log('inside transport condition')
                //     let medium = order.transport.medium
                //     let rate = order.transport.rate

                //     setId(id)
                //     setCustomerId(customer_id)
                //     setFullName(fullName)
                //     setAddress(address)
                //     setEmail(email)
                //     setEventDate(eventDate)
                //     setEventName(eventName)
                //     setNumberOfPeople(numberOfPeople)
                //     setEventTime(eventTime)
                //     setQueries(queries)
                //     setHomeDelievery(homeDelivery)
                //     setPhoneNumber(phoneNumber)
                //     setService(service)
                //     // setSelectedItems([...items])
                //     setStatus(status)
                //     setRate(rate)
                //     setMedium(medium)
                //     setAdvanceAmount(advanceAmount)

                //     const orderPrint = {
                //         fullName: fullName,
                //         email: email,
                //         eventDate: eventDate,
                //         eventTime: eventTime,
                //         phoneNumber: phoneNumber,
                //         items: items,
                //         total: total,
                //         id: id,
                //         customer_id: customer_id,
                //         address: address,
                //         eventName: eventName,
                //         numberOfPeople: numberOfPeople,
                //         medium,
                //         rate,
                //         advanceAmount,
                //         service: service,
                //         homeDelivery: homeDelivery,
                //         queries: queries
                //     }

                //     console.log('orderPrint to check', orderPrint)
                //     localStorage.setItem("order", JSON.stringify(orderPrint))
                //     console.log('inside transport condition end')

                // } else {
                //     console.log('outside transport condition')

                //     setId(id)
                //     setCustomerId(customer_id)
                //     setFullName(fullName)
                //     setAddress(address)
                //     setEmail(email)
                //     setEventDate(eventDate)
                //     setEventName(eventName)
                //     setNumberOfPeople(numberOfPeople)
                //     setEventTime(eventTime)
                //     setQueries(queries)
                //     setHomeDelievery(homeDelivery)
                //     setPhoneNumber(phoneNumber)
                //     setService(service)
                //     // console.log('need to setSelectedItems here:', items)
                //     // setSelectedItems([...items])

                //     setStatus(status)
                //     setAdvanceAmount(advanceAmount)
                //     const orderPrint = {
                //         fullName: fullName,
                //         eventDate: eventDate,
                //         eventTime: eventTime,
                //         phoneNumber: phoneNumber,
                //         email: email,
                //         items: items,
                //         total: total,
                //         address: address,
                //         eventName: eventName,
                //         id: id,
                //         customer_id: customer_id,
                //         numberOfPeople: numberOfPeople,
                //         homeDelivery: homeDelivery,
                //         service: service,
                //         queries: queries,
                //         advanceAmount
                //     }


                //     console.log('orderPrint', orderPrint)
                //     localStorage.setItem("order", JSON.stringify(orderPrint))

                // }
                setShowComponent(true)
            })
        //     .catch(err => {
        //         console.log(err)
        //     })
    }, [])

    const itemRender = () => {
        return <>{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items.length != 0 ?
            (<tbody>
                {
                    orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items.map((item, i) => {
                        const { name, price, quantity, measured } = item
                        return (<tr>
                            <td>{i + 1}</td>
                            <td>{name}</td>
                            <td>{price}</td>
                            <td>{quantity} {measured}</td>
                        </tr>)
                    })
                }
                {<td colSpan={4}>Order total -{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].amount}</td>}
            </tbody>) : (null)}</>

    }

    const renderBLD = () => {
        return <>
            {(selectedOrder != 'undefined' ? (
                <>
                    {
                        <ul>
                            <li onClick={() => {
                                setSelectedOrder({ index: selectedOrder.index, date: selectedOrder.date, orderType: 'Breakfast' })
                                console.log('selectedOrder', selectedOrder)
                            }
                            } >Breakfast</li>
                            <li onClick={() => {
                                setSelectedOrder({ index: selectedOrder.index, date: selectedOrder.date, orderType: 'Lunch' })
                                console.log('selectedOrder', selectedOrder)
                            }}>Lunch</li>
                            <li onClick={() => {
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
            {selectedOrder != 'undefined' ? (<>
                Grand Total : {order.total}<br />
                Event Name :{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].eventName} <br />
                Number of People :{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].numberOfPeople}<br />
                Notes :{orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].notes}<br />
                Home Delivery :{(orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].homedelivery) ? ("Yes") : ("No")}<br />
                Service :{(orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].service) ? ("Yes") : ("No")}<br />

            </>) : (null)}
        </>
    }

    const ShowAdvancePaymentForm = () => {
        setShowAdvancePaymentForm(false)
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
                // const oldAmount = JSON.parse(localStorage.getItem('order'))
                // oldAmount.advanceAmount = advanceAmount
                // localStorage.setItem('order', JSON.stringify(oldAmount))
                // console.log('order amount to check', localStorage.getItem('order'))

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
    return (
        <div>
            showing multiorder component
            <Link to="/multiorders"><button>Back</button></Link>
            <button>Edit</button>

            <div>
                Name :{fullName}<br />
                email :{email}<br />
                phoneNumber :{phoneNumber}<br />
                address :{address}<br />
                status :{status}<br />
                orderid :{orderId}<br />

                {renderDetails()}


                {showComponent && <div>
                    {dates.map((date, i) =>
                        <button onClick={() => {
                            setSelectedOrder({ index: i, date, orderType: selectedOrder['orderType'] })
                            console.log('selectedIndex', selectedOrder)
                        }
                        }>{date}</button>
                    )}

                    {renderBLD()}

                    {(orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items.length != 0) ? (
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <td>Sl No</td>
                                        <td>Name</td>
                                        <td>Price</td>
                                        <td>Quantity</td>
                                    </tr>
                                </thead>
                                {itemRender()}

                            </table>
                            <br />
                            {/* {renderDetails()} */}

                            <button onClick={() => {
                                setShowAdvancePaymentForm(!showAdvancePaymentForm)
                            }}>Enter Advance Amount</button>
                            <button>Transport</button>
                            <button>Generate Bill</button>

                            {showAdvancePaymentForm && <AdvancePaymentForm
                                ShowAdvancePaymentTable={ShowAdvancePaymentTable}
                                ShowAdvancePaymentForm={ShowAdvancePaymentForm}
                                advanceAmount={advanceAmount}
                            />}
                            {advanceAmount && <AdvanceTable
                                deleteTable={deleteAdvancePaymentTable}
                                advanceAmount={advanceAmount}
                            />}
                        </div>
                    ) : (null)}

                </div>}

            </div>
        </div >
    )
}

export default MultiOrderShow