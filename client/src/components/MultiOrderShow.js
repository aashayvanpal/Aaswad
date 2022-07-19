import React, { useState, useEffect } from 'react'
import axios from '../config/axios.js'
import _ from 'lodash'

const MultiOrderShow = () => {

    const [order, setOrder] = useState({})
    const [dates, setDates] = useState([])
    const [selectedOrder, setSelectedOrder] = useState({ index: 0, date: '19/07/2022', orderType: 'Lunch' })
    // const [selectedOrder, setSelectedOrder] = useState({})
    const [orderId, setOrderId] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [status, setStatus] = useState('')
    const [orderDates, setOrderDates] = useState([])
    const [allItems, setAllItems] = useState([])



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

                // console.log('fetching', { id, customer_id, fullName, email, phoneNumber, address, status, orderDates })
                console.log('fetching', { id, customer_id, fullName, email, phoneNumber, address, status })



                setOrderId(id)
                setCustomerId(customer_id)
                setFullName(fullName)
                setEmail(email)
                setPhoneNumber(phoneNumber)
                setAddress(address)
                setStatus(status)
                setOrderDates(orderDates)
                setSelectedOrder({ index: 0, date: Object.keys(orderDates[0])[0], orderType: 'Lunch' })
                console.log('check here order dates', orderDates)
                console.log(Object.keys(orderDates[0])[0])

                const dates = orderDates.map(order => Object.keys(order)[0])
                setDates(dates)

                // let allItems = []
                // orderDates.map(order => {
                //     for (let date in order) {
                //         // console.log(order[date])
                //         for (let orderType in order[date]) {
                //             // console.log('debug:', order[date][orderType])
                //             order[date][orderType].items.map(item => {
                //                 console.log('debug:', item.name)
                //                 allItems.push(item.name)
                //                 // return (<div>{item.name}</div>)
                //             })
                //         }
                //     }
                // })
                // setAllItems(allItems)

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



                // let eventName = order.customer.eventName
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

            })
        //     .catch(err => {
        //         console.log(err)
        //     })
    }, [])

    return (
        <div>
            show component
            <div>
                Name :{fullName}<br />
                email :{email}<br />
                phoneNumber :{phoneNumber}<br />
                address :{address}<br />
                status :{status}<br />
                orderid :{orderId}<br />

                <div>
                    {dates.map((date, i) =>
                        <button onClick={() => {
                            setSelectedOrder({ index: i, date, orderType: selectedOrder['orderType'] })
                            console.log('selectedIndex', selectedOrder)
                        }
                        }>{date}</button>
                    )}

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

                    {
                        (orderDates.length != 0) ? (orderDates[selectedOrder['index']][selectedOrder['date']][selectedOrder['orderType']].items.map(item => {
                            const { name, price, quantity, measured } = item
                            return (<div>{name} - {price} - {quantity}{measured}</div>)
                        })) : (null)
                    }


                    {/* {orderDates[0]['Lunch'].items[0].name} */}

                    {/* {allItems} */}

                </div>
            </div>
        </div>
    )
}

export default MultiOrderShow