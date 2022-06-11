import React from 'react'
import axios from '../config/axios.js'
import { Link } from 'react-router-dom'
import '../css/myOrdersShow.css'
import Star from '../assets/Star.js'

export default class myOrdersShow extends React.Component {
    constructor() {
        super()
        this.state = {
            order: {},
            overallRating: 0,
            id: '',
            fullName: '',
            address: '',
            email: '',
            eventDate: '',
            eventName: '',
            numberOfPeople: '',
            status: '',
            eventTime: '',
            homeDelivery: false,
            phoneNumber: '',
            service: false,
            items: [],
            total: 0,
            feedback: false,
            feedbackNote: ''
        }

        this.submitFeedback = this.submitFeedback.bind(this)
        this.ChangeItemRating = this.ChangeItemRating.bind(this)
        this.ChangeOverallRating = this.ChangeOverallRating.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }


    componentDidMount() {
        console.log('Order Show component mounted !')
        console.log('this.params', this.params)
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
                this.setState({ order })

                console.log('Showing :', this.state.order)
                console.log('fullname :', this.state.order.customer.fullName)
                console.log('id :', this.state.order._id)
                let overallRating = typeof (this.state.order.overallRating) === 'undefined' ? (
                    0
                ) : (this.state.order.overallRating)
                // console.log('obeeeeer all rating here ->', this.state.overallRating)

                let id = this.state.order._id
                let fullName = this.state.order.customer.fullName
                let address = this.state.order.customer.address
                let email = this.state.order.customer.email
                let eventName = this.state.order.customer.eventName
                let numberOfPeople = this.state.order.customer.numberOfPeople
                console.log('numberOfPeople :', this.state.order.customer.numberOfPeople)

                let eventTime = this.state.order.customer.eventTime


                let homeDelivery = this.state.order.customer.homeDelivery
                console.log('homeDelivery', homeDelivery)
                let phoneNumber = this.state.order.customer.phoneNumber
                let service = this.state.order.customer.service
                let items = this.state.order.items
                let status = this.state.order.status
                let eventDate = this.state.order.customer.eventDate.toString()
                // console.log("Event Date check:", eventDate)
                // console.log("Event Date check typeof:", typeof (eventDate))
                // console.log("Event Date check here:", eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4))
                eventDate = eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4)
                // console.log("The Date is :",eventDate.subStr(8, 2) + "/" + eventDate.subStr(5, 2) + "/" + eventDate.subStr(0, 4))
                // console.log("The Date is :",eventDate.subString(0,5))

                let feedback = typeof (this.state.order.feedback) === 'undefined' || !this.state.order.feedback ? false : true
                let feedbackNote = this.state.order.feedbackNote
                this.setState({
                    id,
                    fullName,
                    address,
                    email,
                    eventDate,
                    eventName,
                    numberOfPeople,
                    eventTime,
                    homeDelivery,
                    phoneNumber,
                    service,
                    items,
                    status,
                    feedback,
                    feedbackNote,
                    overallRating
                })

            })
            .catch(err => {
                console.log(err)
            })

    }

    submitFeedback() {
        console.log('inside the feedback section')
        // grab all state and do update here and disable the feedback button 
        // console.log("complete order object")
        // console.log(this.state.order)


        const id = this.state.id
        axios.put(`/orders/${id}`,
            {
                "items": this.state.items,
                "overallRating": this.state.overallRating,
                "feedback": true,
                "feedbackNote": this.state.feedbackNote
            },
            {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
            .then(response => {
                const order = response.data
                // this.setState({ item })

                console.log('Edited order :', order)

            })
            .catch(err => {
                console.log(err)
            })


        this.setState({ feedback: true })
    }

    ChangeItemRating(newRating, id) {
        console.log('inside change item rating', newRating)
        // update the state item rating
        console.log('state items,id', this.state.items, id)
        const items = this.state.items

        //Find index of specific object using findIndex method.    
        const objIndex = items.findIndex((obj => obj._id == id));

        //Log object to Console.
        console.log("Before update: ", items[objIndex])

        // //Update object's name property.
        items[objIndex].rating = newRating

        // //Log object to console again.
        console.log("After update: ", items[objIndex])
        this.setState(items)

    }

    ChangeOverallRating(newRating) {
        this.setState({ overallRating: newRating })
    }

    handleChange(e) {
        // console.log('feedback key pressed', e.target.value)
        this.setState({ feedbackNote: e.target.value })

    }

    render() {
        // const { customer.fullName } = this.state.order
        // console.log("state of order :", this.state.order)
        // console.log("state of order.customer :", this.state.order.customer)
        let customer = this.state.order.customer
        // console.log('customer :', customer)
        console.log('---------id :', this.state.id, this.state.overallRating)

        // console.log('customer.fullName :', customer.fullName)
        // console.log('customer spread :', ...customer)
        // const { fullName } = customer
        // console.log("this.state.order.customer :", this.state.order.customer)
        // const { fullName } = this.state.order.customer

        // console.log("this.state.order.customer :", this.state.order.customer)
        // this.state.order.customer.fullName
        // console.log(this.state.order)
        // console.log("display item? :", display)
        // <h1>Item Name :{name}</h1>
        //         <h1>Price :{price}</h1>
        //         <h1>Category :{category}</h1>
        //         <h1>Image-URL :{imgUrl}</h1>
        //         <h1>Display :{display?('True'):('False')}</h1>
        //         <Link to='/items'><button>Back</button></Link>

        return (
            <div id="OrderShowContainer">
                <div id="ShowContainer1">
                    {/* <h1>Showing myOrders details:-</h1> */}
                    <h1 id="OrderDetails">Your Order Details:-</h1><hr />
                    <h2><b>OrderID :</b> {this.state.id}</h2>
                    <h2><b>Customer Name :</b> {this.state.fullName}</h2>
                    <h2><b>Event Name :</b> {this.state.eventName}</h2>
                    <h2><b>Number of People :</b> {this.state.numberOfPeople}</h2>
                    <h2><b>Event Date :</b> {this.state.eventDate}</h2>
                    {/* <h1>Event Time : {this.state.eventTime} (24 hours IST)</h1> */}
                    {/* <h1>Phone Number : {this.state.phoneNumber}</h1> */}
                    <h2><b>Address :</b> {this.state.address}</h2>
                    {/* <h1>Email : {this.state.email}</h1> */}
                    <h2><b>Service :</b> {this.state.service ? "Yes" : "No"}</h2>
                    <h2><b>Home Delivery :</b> {this.state.homeDelivery ? "Yes" : "No"}</h2>
                    <h2><b>Status :</b> {this.state.status}</h2>
                    <h2><Link to="/myOrders"><button style={{
                        "backgroundColor": "#ff881a",
                        "borderRadius": "10px",
                        "padding": "10px",
                        "cursor": "pointer",
                    }}>Back</button></Link></h2>
                </div>

                <div id="ShowContainer2">
                    <h1><b>Order Items - {this.state.items.length}</b></h1>

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
                                {this.state.status === 'completed' ? <td>Rating</td> : null}
                                {/* <td>Price</td>
                                <td>Total</td> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.items.map((item, i) => {
                                    // This line shows the total for rates (must fix the bug here)
                                    this.state.total += item.quantity * item.price
                                    this.setState(prevState => { prevState.total += item.quantity * item.price })
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.quantity} {item.measured}</td>
                                            {this.state.status === 'completed' ?
                                                <td>
                                                    {typeof (item.starRating) === 'undefined' ? (
                                                        <Star name={item.name}
                                                            id={item._id}
                                                            rating={item.rating}
                                                            ChangeItemRating={this.ChangeItemRating}
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

                    {this.state.status === 'completed' ?
                        (
                            <div>
                                <h3> Overall Rating :
                                    <Star name="overallRating"
                                        id={this.state.id}
                                        rating={this.state.overallRating}
                                        overallRating={true}
                                        ChangeOverallRating={this.ChangeOverallRating}
                                    />
                                </h3>

                                {!this.state.feedback ? (
                                    <div>
                                        <textarea name="feedbackNote" value={this.state.feedbackNote} placeholder='Please leave a feeeback here...' onChange={this.handleChange} />
                                        <button onClick={this.submitFeedback}>Submit Feedback</button>
                                    </div>) : (
                                    <div>
                                        <p>Feedback Submitted!</p>
                                        <p>{this.state.feedbackNote}</p>
                                    </div>
                                )}
                            </div>
                        ) : null
                    }
                </div>
            </div>
        )
    }
}