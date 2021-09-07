import React from 'react'
import axios from '../../config/axios.js'
import { Link } from 'react-router-dom'
import '../../css/myOrdersShow.css'


// bug fix: Orderid must be same when the order is edited 

export default class ItemShow extends React.Component {
    constructor() {
        super()
        this.state = {
            order: {},
            id: '',
            fullName: '',
            address: '',
            email: '',
            eventDate: '',
            eventName: '',
            numberOfPeople: '',
            eventTime: '',
            homeDelivery: false,
            phoneNumber: '',
            service: false,
            items: [],
            total: 0
        }
        this.EditOrder = this.EditOrder.bind(this)

    }

    generateBill() {
        console.log("Print button clicked!")
        window.open(window.location.href + "/print", '_blank')

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

                console.log('Showing :', this.state.order)
                console.log('fullname :', this.state.order.customer.fullName)
                console.log('id :', this.state.order._id)

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
                })

                const orderPrint = {
                    fullName: this.state.fullName,
                    eventDate: this.state.eventDate,
                    phoneNumber: this.state.phoneNumber,
                    items: this.state.items,
                    total: this.state.total,
                    id: this.state.id

                }
                localStorage.setItem("order", JSON.stringify(orderPrint))
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
                        <h1 ><Link to="/menu"><button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "cursor": "pointer",
                        }} onClick={this.EditOrder()}>Edit</button></Link></h1>
                        <h1 ><Link to="/orders" ><button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "cursor": "pointer",
                        }}>Back</button></Link></h1>
                    </div>
                    <h1>Showing order details:-</h1>
                    <h2>Customer Name : {this.state.fullName}</h2>
                    <h2>Event Name : {this.state.eventName}</h2>
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

                    <table style={{ "borderCollapse": "collapse", "border": "2px solid black" }}>
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
                    <h1>Grand Total = {this.state.total}</h1>
                    <h1>Per plate cost = {this.state.total / this.state.numberOfPeople}</h1>
                    <button onClick={this.generateBill}>Generate Bill</button>
                </div>
            </div>
        )
    }
}