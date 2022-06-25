import React, { useState, useEffect } from 'react'
import axios from '../config/axios.js'
import { Link } from 'react-router-dom'
import '../css/myOrdersShow.css'
import Star from '../assets/Star.js'

const MyOrdersShow = () => {

    const [order, setOrder] = useState({})
    const [overallRating, setOverallRating] = useState(0)
    const [id, setId] = useState('')
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [eventName, setEventName] = useState('')
    const [numberOfPeople, setNumberOfPeople] = useState('')
    const [status, setStatus] = useState('')
    const [eventTime, setEventTime] = useState('')
    const [homeDelivery, setHomeDelivery] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [service, setService] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [total, setTotal] = useState(0)
    const [feedback, setFeedback] = useState(false)
    const [feedbackNote, setFeedbackNote] = useState('')

    useEffect(() => {
        console.log('Order Show component mounted !')
        console.log('id to show', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[5]
        axios.get(`/myOrders/show/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const order = response.data
                console.log('grab this order =>', order)
                setOrder(order)

                console.log('Showing :', order)
                console.log('fullname :', order.customer.fullName)
                console.log('id :', order._id)
                let overallRating = typeof (order.overallRating) === 'undefined' ? (
                    0
                ) : (order.overallRating)
                // console.log('obeeeeer all rating here ->', this.state.overallRating)

                let id = order._id
                let fullName = order.customer.fullName
                let address = order.customer.address
                let email = order.customer.email
                let eventName = order.customer.eventName
                let numberOfPeople = order.customer.numberOfPeople
                console.log('numberOfPeople :', order.customer.numberOfPeople)

                let eventTime = order.customer.eventTime


                let homeDelivery = order.customer.homeDelivery
                console.log('homeDelivery', homeDelivery)
                let phoneNumber = order.customer.phoneNumber
                let service = order.customer.service
                let items = order.items
                let status = order.status
                let eventDate = order.customer.eventDate.toString()
                // console.log("Event Date check:", eventDate)
                // console.log("Event Date check typeof:", typeof (eventDate))
                // console.log("Event Date check here:", eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4))
                eventDate = eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4)
                // console.log("The Date is :",eventDate.subStr(8, 2) + "/" + eventDate.subStr(5, 2) + "/" + eventDate.subStr(0, 4))
                // console.log("The Date is :",eventDate.subString(0,5))

                let feedback = typeof (order.feedback) === 'undefined' || !order.feedback ? false : true
                let feedbackNote = order.feedbackNote

                setId(id)
                setFullName(fullName)
                setAddress(address)
                setEmail(email)
                setEventDate(eventDate)
                setEventName(eventName)
                setNumberOfPeople(numberOfPeople)
                setEventTime(eventTime)
                setHomeDelivery(homeDelivery)
                setPhoneNumber(phoneNumber)
                setService(service)
                setSelectedItems(items)
                setStatus(status)
                setFeedback(feedback)
                setFeedbackNote(feedbackNote)
                setOverallRating(overallRating)

            })
            .catch(err => {
                console.log(err)
            })

    }, [])

    const submitFeedback = () => {
        console.log('inside the feedback section')
        // grab all state and do update here and disable the feedback button 
        // console.log("complete order object")
        // console.log(this.state.order)


        // const id = id
        axios.put(`/orders/${id}`,
            {
                "items": selectedItems,
                "overallRating": overallRating,
                "feedback": true,
                "feedbackNote": feedbackNote
            },
            {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
            .then(response => {
                const order = response.data

                console.log('Edited order :', order)

            })
            .catch(err => {
                console.log(err)
            })


        setFeedback(true)
    }

    const ChangeItemRating = (newRating, id) => {
        console.log('inside change item rating', newRating)
        // update the state item rating
        console.log('state items,id', selectedItems, id)
        const items = selectedItems

        //Find index of specific object using findIndex method.    
        const objIndex = items.findIndex((obj => obj._id == id));

        //Log object to Console.
        console.log("Before update: ", items[objIndex])

        // //Update object's name property.
        items[objIndex].rating = newRating

        // //Log object to console again.
        console.log("After update: ", items[objIndex])
        setSelectedItems([...items])

    }

    const ChangeOverallRating = (newRating) => {
        setOverallRating(newRating)
    }

    return (
        <div id="OrderShowContainer">
            <div id="ShowContainer1">
                {/* <h1>Showing myOrders details:-</h1> */}
                <h1 id="OrderDetails">Your Order Details:-</h1><hr />
                <h2><b>OrderID :</b> {id}</h2>
                <h2><b>Customer Name :</b> {fullName}</h2>
                <h2><b>Event Name :</b> {eventName}</h2>
                <h2><b>Number of People :</b> {numberOfPeople}</h2>
                <h2><b>Event Date :</b> {eventDate}</h2>
                {/* <h1>Event Time : {this.state.eventTime} (24 hours IST)</h1> */}
                {/* <h1>Phone Number : {this.state.phoneNumber}</h1> */}
                <h2><b>Address :</b> {address}</h2>
                {/* <h1>Email : {this.state.email}</h1> */}
                <h2><b>Service :</b> {service ? "Yes" : "No"}</h2>
                <h2><b>Home Delivery :</b> {homeDelivery ? "Yes" : "No"}</h2>
                <h2><b>Status :</b> {status}</h2>
                <h2><Link to="/myOrders"><button style={{
                    "backgroundColor": "#ff881a",
                    "borderRadius": "10px",
                    "padding": "10px",
                    "cursor": "pointer",
                }}>Back</button></Link></h2>
            </div>

            <div id="ShowContainer2">
                <h1><b>Order Items - {selectedItems.length}</b></h1>

                <table style={{
                    "borderCollapse": "collapse",
                    "border": "2px solid black",
                    "padding": "10px",
                    // "backgroundColor": "green",
                    "margin": "10px 0px",
                    "width": "100%",
                }}>
                    <thead style={{ "border": "2px solid black" }}>
                        <tr style={{ "fontWeight": "bold" }}>
                            <td>Sl No.</td>
                            <td>Item Name</td>
                            <td>Quantity</td>
                            {status === 'completed' ? <td>Rating</td> : null}
                            {/* <td>Price</td>
                            <td>Total</td> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            selectedItems.map((item, i) => {
                                // This line shows the total for rates (must fix the bug here)
                                // this.state.total += item.quantity * item.price
                                // this.setState(prevState => { prevState.total += item.quantity * item.price })
                                return (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.quantity} {item.measured}</td>
                                        {status === 'completed' ?
                                            <td>
                                                {typeof (item.starRating) === 'undefined' ? (
                                                    <Star name={item.name}
                                                        id={item._id}
                                                        rating={item.rating}
                                                        ChangeItemRating={ChangeItemRating}
                                                    />
                                                ) : (item.starRating)}
                                            </td> :
                                            null}
                                        {/* <td><span style={{ "fontFamily": "Arial" }}>&#8377;</span>{item.price}</td>
                                        {!this.state.status ? (<>
                                            <td><span style={{ "fontFamily": "Arial" }}>&#8377;</span>{item.quantity * item.price}</td>
                                        </>
                                        ) : (null)} */}
                                    </tr>
                                )

                                // return <h1 key={item.id}><li>{item.name} - {item.quantity} - {item.price} -{item.quantity * item.price}</li></h1>
                            })
                        }

                    </tbody>
                </table>

                <h3>Billing estimate will be added here after order approval</h3>
                {/* <h2>Grand Total = <span style={{ "fontFamily": "Arial" }}>&#8377;</span>{this.state.total}</h2> */}
                {/* <h1>Per plate cost = {this.state.total / this.state.numberOfPeople}</h1> */}

                {status === 'completed' ?
                    (
                        <div>
                            <h3> Overall Rating :
                                <Star name="overallRating"
                                    id={id}
                                    rating={overallRating}
                                    overallRating={true}
                                    ChangeOverallRating={ChangeOverallRating}
                                />
                            </h3>

                            {!feedback ? (
                                <div>
                                    <textarea name="feedbackNote" value={feedbackNote} placeholder='Please leave a feeeback here...' onChange={(e) => setFeedbackNote(e.target.value)} />
                                    <button onClick={submitFeedback}>Submit Feedback</button>
                                </div>) : (
                                <div>
                                    <p>Feedback Submitted!</p>
                                    <p>{feedbackNote}</p>
                                </div>
                            )}
                        </div>
                    ) : null
                }
            </div>
        </div>
    )
}

export default MyOrdersShow