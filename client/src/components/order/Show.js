import React from 'react'
import axios from '../../config/axios.js'
import { Link } from 'react-router-dom'
import '../../css/myOrdersShow.css'
import TransportForm from './TransportForm.js'
import AdvancePaymentForm from './AdvancePaymentForm.js'
import TransportTable from './TransportTable.js'
import AdvanceTable from './AdvanceTable.js'
import billIcon from '../../images/billing-icon.jpg'
import updateIcon from '../../images/update-icon.jpg'
import advanceIcon from '../../images/payment-icon.png'
import transportIcon from '../../images/transport-icon.png'
import backIcon from '../../images/back-icon.png'
// bug fix: Orderid must be same when the order is edited 

export default class ItemShow extends React.Component {
    constructor() {
        super()
        this.state = {
            order: {},
            id: '',
            customer_id: '',
            fullName: '',
            address: '',
            email: '',
            eventDate: '',
            eventName: '',
            numberOfPeople: '',
            eventTime: '',
            queries: '',
            homeDelivery: false,
            phoneNumber: '',
            service: false,
            items: [],
            total: 0,
            ShowTransportForm: false,
            ShowAdancePaymentForm: false,
            advanceAmount: ''
        }
        this.EditOrder = this.EditOrder.bind(this)

    }

    generateBill() {
        console.log("Print button clicked!")
        window.open(window.location.href + "/print", '_blank')

    }
    generateBillDelivery() {
        console.log("Print Delivery button clicked!")
        console.log("Find order id and assign to orderid")
        console.log(this.state.id)
        // const orderid = this.state.id

        // window.open(window.location.href + `/printDelivery/${orderid}`, '_blank')
        window.open(window.location.href + `/printDelivery`, '_blank')

    }

    componentDidMount() {
        console.log('Order Show component mounted !')
        console.log('this.params', this.params)
        console.log('id to show', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[4]
        axios.get(`/api/orders/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const order = response.data
                this.setState({ order })
                console.log('Showing check here :', this.state.order)
                console.log('fullname :', this.state.order.customer.fullName)
                console.log('id :', this.state.order._id)

                let id = this.state.order._id
                let fullName = this.state.order.customer.fullName
                let customer_id = this.state.order.customer.customer_id
                let address = this.state.order.customer.address
                let email = this.state.order.customer.email
                let eventName = this.state.order.customer.eventName
                let numberOfPeople = this.state.order.customer.numberOfPeople
                console.log('numberOfPeople :', this.state.order.customer.numberOfPeople)

                let eventTime = this.state.order.customer.eventTime
                let queries = this.state.order.customer.queries


                let homeDelivery = this.state.order.customer.homeDelivery
                console.log('homeDelivery', homeDelivery)
                let phoneNumber = this.state.order.customer.phoneNumber
                let service = this.state.order.customer.service
                let items = this.state.order.items
                console.log("====debug items====", items)
                let status = this.state.order.status
                let eventDate = this.state.order.customer.eventDate.toString()
                // console.log("Event Date check:", eventDate)
                // console.log("Event Date check typeof:", typeof (eventDate))
                // console.log("Event Date check here:", eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4))
                eventDate = eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4)
                // console.log("The Date is :",eventDate.subStr(8, 2) + "/" + eventDate.subStr(5, 2) + "/" + eventDate.subStr(0, 4))
                // console.log("The Date is :",eventDate.subString(0,5))

                // const dateConverted = eventDate.subStr(8, 2) + "/" + eventDate.subStr(5, 2) + "/" + eventDate.subStr(0, 4)
                // console.log("date converted:", dateConverted)

                // let eventTime = eventDate.substr(11, 5)

                if (this.state.order.transport) {
                    console.log('inside transport condition')
                    let medium = this.state.order.transport.medium
                    let rate = this.state.order.transport.rate
                    let advanceAmount = this.state.order.AdvanceAmount

                    this.setState({
                        id,
                        customer_id,
                        fullName,
                        address,
                        email,
                        eventDate,
                        eventName,
                        numberOfPeople,
                        eventTime,
                        queries,
                        homeDelivery,
                        phoneNumber,
                        service,
                        items,
                        status,
                        rate,
                        medium,
                        advanceAmount
                    })
                    const orderPrint = {
                        fullName: this.state.fullName,
                        email: this.state.email,
                        eventDate: this.state.eventDate,
                        eventTime: this.state.eventTime,
                        phoneNumber: this.state.phoneNumber,
                        items: this.state.items,
                        total: this.state.total,
                        id: this.state.id,
                        customer_id: this.state.customer_id,
                        address: this.state.address,
                        eventName: this.state.eventName,
                        numberOfPeople: this.state.numberOfPeople,
                        medium,
                        rate,
                        advanceAmount
                    }

                    console.log('orderPrint to check', orderPrint)
                    localStorage.setItem("order", JSON.stringify(orderPrint))
                    console.log('inside transport condition end')

                } else {
                    console.log('outside transport condition')
                    this.setState({
                        id,
                        customer_id,
                        fullName,
                        address,
                        email,
                        eventDate,
                        eventName,
                        numberOfPeople,
                        eventTime,
                        queries,
                        homeDelivery,
                        phoneNumber,
                        service,
                        items,
                        status,
                    })
                    const orderPrint = {
                        fullName: this.state.fullName,
                        eventDate: this.state.eventDate,
                        eventTime: this.state.eventTime,
                        phoneNumber: this.state.phoneNumber,
                        email: this.state.email,
                        items: this.state.items,
                        total: this.state.total,
                        address: this.state.address,
                        eventName: this.state.eventName,
                        id: this.state.id,
                        customer_id: this.state.customer_id,
                        numberOfPeople: this.state.numberOfPeople,
                    }

                    console.log('orderPrint', orderPrint)
                    localStorage.setItem("order", JSON.stringify(orderPrint))

                }

            })
            .catch(err => {
                console.log(err)
            })
    }

    EditOrder() {
        console.log("Inside EditOrder")

        axios.get('/api/menu', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log("Should use localStorage to set state here")
                const items = response.data
                let filteredItems = items.filter(item => item.display === true)
                filteredItems.forEach(item => {
                    item.isSelected = false
                    item.quantity = 1
                })
                // combine the this.state.items and the filteredItems into single array and set in localStorage
                // console.log("==Debug==")
                console.log("this.state.items", this.state.items)
                console.log("filteredItems", filteredItems)


                // var updatedCart = this.state.filteredItems.filter(obj => this.state.items.find(p => p.id === obj.id) || obj);
                // console.log("updated Cart check", updatedCart)



                //     var defaultArray = [
                //         {"id":'111',name:"item1",qty:1},
                //         {id:'222',name:"item2",qty:1},
                //         {id:'333',name:"item3",qty:1},
                //         {id:'444',name:"item4",qty:1},
                //         {id:'555',name:"item5",qty:1},
                //         ]

                //    var selectedArray =[{id:'333',name:"item1",qty:5},{id:'222',name:"item2",qty:10}]

                //    var desiredResultArray = defaultArray.map(item => selectedArray.find(i => i.id === item.id) || item)
                //    console.log("DesiredArray : ",desiredResultArray )
                // var desiredResultArray = defaultArray.map(item => selectedArray.find(i => i.id === item.id) || item)
                var desiredResultArray = filteredItems.map(item => this.state.items.find(i => i._id === item._id) || item)
                console.log("desiredResultArray:", desiredResultArray)
                // console.log("==Debug End==")

                localStorage.setItem("cartItems", JSON.stringify(desiredResultArray))
                // var oldSelectedItems = JSON.parse(localStorage.getItem("cartItems"))
                // console.log(oldSelectedItems)
                // this.setState({
                //     searchFilter: oldSelectedItems,
                //     items: oldSelectedItems
                // })


            })
        console.log('set user here')
    }

    ShowTransportForm = () => {
        this.setState({ ShowTransportForm: false })
    }
    ShowAdvancePaymentForm = () => {
        this.setState({ ShowAdvancePaymentForm: false })
    }
    ShowAdvancePaymentTable = (amount) => {
        // change the order model
        // create controller
        // post request to update transport
        console.log('id to edit', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[4]

        axios.put(`/orders/${id}`, { "AdvanceAmount": amount }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data
                // this.setState({ item })

                console.log('Edited order :', item)
                this.setState({ advanceAmount: amount })
                const oldAmount = JSON.parse(localStorage.getItem('order'))
                oldAmount.advanceAmount = this.state.advanceAmount
                localStorage.setItem('order', JSON.stringify(oldAmount))
                console.log('order amount to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })

    }

    ShowTransportTable = (medium, rate) => {
        // change the order model
        // create controller
        // post request to update transport
        console.log('id to edit', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[4]

        axios.put(`/orders/${id}`, { "transport": { "medium": medium, "rate": rate } }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data
                // this.setState({ item })

                console.log('Edited order :', item)
                this.setState({ medium, rate })
                const oldmedium = JSON.parse(localStorage.getItem('order'))
                oldmedium.medium = this.state.medium
                oldmedium.rate = this.state.rate
                localStorage.setItem('order', JSON.stringify(oldmedium))
                console.log('orer to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })

    }


    render() {
        // const { customer.fullName } = this.state.order
        // console.log("state of order :", this.state.order)
        console.log("state of order.customer :", this.state.order.customer)
        let customer = this.state.order.customer
        console.log('customer :', customer)

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
                    <div id="OrderShowContainer">
                        <h2 ><Link to="/orders" ><button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "marginRight": "10px",
                            "cursor": "pointer",
                        }}
                            onClick={() => { localStorage.removeItem('order') }}
                        >
                            <img src={backIcon} height="30px" width="30px" />
                            Back</button></Link></h2>
                        <h2 ><Link to="/menu"><button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "cursor": "pointer",
                        }} onClick={() => this.EditOrder()}>
                            <img src={updateIcon} height="30px" width="30px" />
                            Edit</button></Link></h2>
                    </div>
                    <h1>Showing order details:-</h1>
                    <h2>Customer Name : {this.state.fullName}</h2>
                    <h2>Event Name : {this.state.eventName}</h2>
                    {this.state.queries ? (<h2 style={{ "backgroundColor": "red", "color": "white" }}>Queries : {this.state.queries}</h2>) : (null)}

                    <h2>Number of People : {this.state.numberOfPeople}</h2>
                    <h2>Event Date : {this.state.eventDate}</h2>
                    <h2>Event Time : {this.state.eventTime} (24 hours IST)</h2>
                    <h2>Phone Number : {this.state.phoneNumber}</h2>
                    <h2>Address : {this.state.address}</h2>
                    <h2>Email : {this.state.email}</h2>
                    <h2>Service : {this.state.service ? "Yes" : "No"}</h2>
                    <h2>Home Delivery : {this.state.homeDelivery ? "Yes" : "No"}</h2>
                    <h2>Status : {this.state.status}</h2>
                    <h2>OrderID : {this.state.id}</h2>
                </div>

                <div id="ShowContainer2" style={{ "border": "2px solid black", "padding": "20px" }}>
                    <h1>Listing Items - {this.state.items.length}</h1>

                    <table style={{ "borderCollapse": "collapse", "border": "2px solid black", width: "100%" }}>
                        <thead style={{ "border": "2px solid black" }}>
                            <tr>
                                <td>Sl No.</td>
                                <td>Item Name</td>
                                <td>Quantity</td>
                                <td>Price</td>
                                <td>Total</td>
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
                                            <td>{item.price}</td>
                                            <td>{item.quantity * item.price}</td>
                                        </tr>
                                    )

                                    // return <h1 key={item.id}><li>{item.name} - {item.quantity} - {item.price} -{item.quantity * item.price}</li></h1>
                                })
                            }
                        </tbody>
                    </table>

                    <h1>Grand Total = {this.state.items.reduce((sum, i) => (
                        sum += i.quantity * i.price
                    ), 0)}</h1>

                    <h1>Per plate cost = {this.state.items.reduce((sum, i) => (
                        sum += i.quantity * i.price
                    ), 0) / this.state.numberOfPeople}</h1>

                    {this.state.homeDelivery ? (
                        <button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "cursor": "pointer",
                        }} onClick={() => {
                            console.log('Enter transport clicked')
                            this.setState({ ShowTransportForm: !this.state.ShowTransportForm })
                        }}>
                            <img src={transportIcon} height="30px" width="30px" />
                            Enter Transport</button>
                    ) : (null)}

                    <button style={{
                        "backgroundColor": "#ff881a",
                        "borderRadius": "10px",
                        "padding": "10px",
                        "cursor": "pointer",
                    }} onClick={() => this.setState({ ShowAdvancePaymentForm: !this.state.ShowAdvancePaymentForm })}>
                        <img src={advanceIcon} height="30px" width="30px" />
                        Enter Advance payment</button>
                    {this.state.ShowAdvancePaymentForm && <AdvancePaymentForm
                        ShowAdvancePaymentTable={this.ShowAdvancePaymentTable}
                        ShowAdvancePaymentForm={this.ShowAdvancePaymentForm}
                        advanceAmount={this.state.advanceAmount}
                    />}

                    {this.state.ShowTransportForm && <TransportForm
                        ShowTransportForm={this.ShowTransportForm}
                        ShowTransportTable={this.ShowTransportTable}
                        price={this.state.rate}
                        medium={this.state.medium}
                    />}

                    {this.state.medium ? (
                        <TransportTable medium={this.state.medium}
                            rate={this.state.rate} />
                    ) : null}

                    {this.state.advanceAmount && <AdvanceTable advanceAmount={this.state.advanceAmount} />}
                    <hr />
                    <button style={{
                        "backgroundColor": "#ff881a",
                        "borderRadius": "10px",
                        "padding": "10px",
                        "marginRight": "10px",
                        "cursor": "pointer",
                    }} onClick={() => this.generateBill()}>
                        <img src={billIcon} width="30px" height="30px" />
                        Generate Bill</button>
                    {this.state.homeDelivery ? (

                        <button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "marginRight": "10px",
                            "cursor": "pointer",
                        }} onClick={() => this.generateBillDelivery(this.state.id)}>
                            <img src={billIcon} width="30px" height="30px" />
                            Generate Bill Delivery</button>) : (null)}
                </div>
            </div >
        )
    }
}