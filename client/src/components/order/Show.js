import React, { useEffect, useState } from 'react'
import axios from '../../config/axios.js'
import { Link } from 'react-router-dom'
import '../../css/myOrdersShow.css'
import TransportForm from './TransportForm.js'
import MiscForm from './MiscForm.js'
import AdvancePaymentForm from './AdvancePaymentForm.js'
import TransportTable from './TransportTable.js'
import AdvanceTable from './AdvanceTable.js'
import billIcon from '../../images/billing-icon.jpg'
import updateIcon from '../../images/update-icon.jpg'
import advanceIcon from '../../images/payment-icon.png'
import transportIcon from '../../images/transport-icon.png'
import backIcon from '../../images/back-icon.png'
import downloadBill from '../../assets/generateBill'
import downloadType1Bill from '../../assets/generateBill/types/common-type1.js'
import downloadType2Bill from '../../assets/generateBill/types/common-type2.js'
import downloadType3Bill from '../../assets/generateBill/types/common-type3.js'
import MiscTable from './MiscTable.js'
import { updateEventOrder, deleteFieldFromEventOrder } from '../../apis/eventOrders.js'


const ItemShow = ({ type }) => {

    const [order, setOrder] = useState({})
    const [id, setId] = useState('')
    const [customer_id, setCustomerId] = useState('')
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [eventName, setEventName] = useState('')
    const [numberOfPeople, setNumberOfPeople] = useState('')
    const [eventTime, setEventTime] = useState('')
    const [queries, setQueries] = useState('')
    const [homeDelivery, setHomeDelievery] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [service, setService] = useState(false)
    const [selectedItems, setSelectedItems] = useState([])
    const [total, setTotal] = useState(0)
    const [showTransportForm, setShowTransportForm] = useState(false)
    const [showMiscForm, setShowMiscForm] = useState(false)
    const [showAdvancePaymentForm, setShowAdvancePaymentForm] = useState(false)
    const [advanceAmount, setAdvanceAmount] = useState('')
    const [status, setStatus] = useState('')
    const [rate, setRate] = useState(0)
    const [medium, setMedium] = useState()
    const [balance, setBalance] = useState('')
    const [miscItems, setMiscParticulars] = useState([])
    const [showMiscTable, setShowMiscTable] = useState(false)
    const [eventOrderRoute, setEventOrderRoute] = useState('')
    const [headingEventName, setHeadingEventName] = useState('')
    const [headingEventDate, setHeadingEventDate] = useState('')

    useEffect(() => {
        setTotal(calculateTotal)
    }, [selectedItems])

    const singleOrderView = () => {
        console.log('Order Show component mounted !')
        console.log('id to show', window.location.href.split('/')[4])
        const id = window.location.href.split('/')[4]
        axios.get(`/api/orders/${id}`, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const order = response.data
                setOrder(order)
                console.log('Showing check here :', order)
                console.log('fullname :', order.customer.fullName)
                console.log('id :', order._id)
                console.log('order get the transport :', order)

                let id = order._id
                let fullName = order.customer.fullName
                let customer_id = order.customer.customer_id
                let address = order.customer.address
                let email = order.customer.email
                let eventName = order.customer.eventName
                let numberOfPeople = order.customer.numberOfPeople
                console.log('numberOfPeople :', order.customer.numberOfPeople)

                let eventTime = order.customer.eventTime
                let queries = order.customer.queries

                let homeDelivery = order.customer.homeDelivery
                console.log('homeDelivery', homeDelivery)
                let phoneNumber = order.customer.phoneNumber
                let service = order.customer.service
                let items = order.items
                console.log("====debug items====", items)
                let status = order.status
                let eventDate = order.customer.eventDate.toString()
                let advanceAmount = order.AdvanceAmount
                // console.log("Event Date check:", eventDate)
                // console.log("Event Date check typeof:", typeof (eventDate))
                // console.log("Event Date check here:", eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4))
                eventDate = eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4)
                // console.log("The Date is :",eventDate.subStr(8, 2) + "/" + eventDate.subStr(5, 2) + "/" + eventDate.subStr(0, 4))

                setSelectedItems([...items])
                let misc = order.misc ? order.misc : []
                setMiscParticulars(misc)
                if (order.misc.length != 0) {
                    setShowMiscTable(true)
                }


                if (order.transport) {
                    console.log('inside transport condition')
                    let medium = order.transport.medium
                    let rate = order.transport.rate

                    setId(id)
                    setCustomerId(customer_id)
                    setFullName(fullName)
                    setAddress(address)
                    setEmail(email)
                    setEventDate(eventDate)
                    setEventName(eventName)
                    setNumberOfPeople(numberOfPeople)
                    setEventTime(eventTime)
                    setQueries(queries)
                    setHomeDelievery(homeDelivery)
                    setPhoneNumber(phoneNumber)
                    setService(service)
                    setStatus(status)
                    setRate(rate)
                    setMedium(medium)
                    setAdvanceAmount(advanceAmount)

                    const orderPrint = {
                        fullName: fullName,
                        email: email,
                        eventDate: eventDate,
                        eventTime: eventTime,
                        phoneNumber: phoneNumber,
                        items: items,
                        total: total,
                        id: id,
                        customer_id: customer_id,
                        address: address,
                        eventName: eventName,
                        numberOfPeople: numberOfPeople,
                        medium,
                        rate,
                        advanceAmount,
                        service: service,
                        homeDelivery: homeDelivery,
                        queries: queries
                    }

                    console.log('orderPrint to check', orderPrint)
                    localStorage.setItem("order", JSON.stringify(orderPrint))
                    console.log('inside transport condition end')

                } else {
                    console.log('outside transport condition')

                    setId(id)
                    setCustomerId(customer_id)
                    setFullName(fullName)
                    setAddress(address)
                    setEmail(email)
                    setEventDate(eventDate)
                    setEventName(eventName)
                    setNumberOfPeople(numberOfPeople)
                    setEventTime(eventTime)
                    setQueries(queries)
                    setHomeDelievery(homeDelivery)
                    setPhoneNumber(phoneNumber)
                    setService(service)
                    setStatus(status)
                    setAdvanceAmount(advanceAmount)
                    const orderPrint = {
                        fullName: fullName,
                        eventDate: eventDate,
                        eventTime: eventTime,
                        phoneNumber: phoneNumber,
                        email: email,
                        items: items,
                        total: total,
                        address: address,
                        eventName: eventName,
                        id: id,
                        customer_id: customer_id,
                        numberOfPeople: numberOfPeople,
                        homeDelivery: homeDelivery,
                        service: service,
                        queries: queries,
                        advanceAmount
                    }


                    console.log('orderPrint', orderPrint)
                    localStorage.setItem("order", JSON.stringify(orderPrint))

                }

            })
            .catch(err => {
                console.log(err)
            })
    }

    const eventOrderView = () => {
        const orderDetails = JSON.parse(localStorage.getItem('orderDetails'))
        console.log("orderDetails", orderDetails)
        const route = window.location.href.split('/')[4]
        setEventOrderRoute(route)
        setHeadingEventName(orderDetails.eventName)
        setHeadingEventDate(orderDetails.eventDate)
        const order = orderDetails.order
        setFullName(order.customer.fullName)
        setNumberOfPeople(order.customer.numberOfPeople)
        setEventDate(order.customer.eventDate)
        setPhoneNumber(order.customer.phoneNumber)
        setAddress(order.customer.address)
        setEmail(order.customer.email)
        setService(order.customer.service)
        setHomeDelievery(order.customer.homeDelivery)
        setStatus(order.status)
        setId(order.orderId)
        setSelectedItems(order.items)
        setQueries(order.customer.queries)
        if (orderDetails.AdvanceAmount) {
            setAdvanceAmount(Number(orderDetails.AdvanceAmount))
        }
    }

    useEffect(() => {
        switch (type) {
            case "eventOrder": {
                console.log("Inside event order useEffect")
                eventOrderView()
            }
                break;
            default: {
                console.log("Inside default useEffect")
                singleOrderView()
                break;
            }
        }
    }, [])

    const generateBill = () => {
        console.log("Print button clicked!")
        window.open(window.location.href + "/print", '_blank')

    }
    const generateBillDelivery = () => {
        console.log("Print Delivery button clicked!")
        console.log("Find order id and assign to orderid")
        console.log(id)
        // const orderid = this.state.id

        // window.open(window.location.href + `/printDelivery/${orderid}`, '_blank')
        window.open(window.location.href + `/printDelivery`, '_blank')
    }

    const EditOrder = () => {
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
                console.log("selectedItems", selectedItems)
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


                var desiredResultArray = filteredItems.map(item => selectedItems.find(i => i._id === item._id) || item)
                console.log("desiredResultArray:", desiredResultArray)
                // console.log("==Debug End==")

                localStorage.setItem("cartItems", JSON.stringify(desiredResultArray))

            })
        console.log('set user here')
    }

    const ShowTransportForm = () => {
        setShowTransportForm(false)
    }
    const ShowMiscForm = () => {
        // setShowTransportForm(false)
        setShowMiscForm(false)
    }
    const ShowAdvancePaymentForm = () => {
        setShowAdvancePaymentForm(false)
    }

    const createAdvancePayment = (amount) => {
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

                console.log('Edited order :', item)
                setAdvanceAmount(amount)
                const oldAmount = JSON.parse(localStorage.getItem('order'))
                oldAmount.advanceAmount = advanceAmount
                localStorage.setItem('order', JSON.stringify(oldAmount))
                console.log('order amount to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })
    }
    const setAdvanceAmountinLS = (amount) => {
        // ui render
        setAdvanceAmount(amount)

        // localstorage setting state
        let orderDetails = JSON.parse(localStorage.getItem('orderDetails'))
        orderDetails.AdvanceAmount = amount
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
    }
    const ShowAdvancePaymentTable = (amount) => {

        alert("type!:" + type)

        switch (type) {
            case "eventOrder": {
                alert("Inside event order type")
                // api call here
                updateEventOrder(id, { AdvanceAmount: amount })
                setAdvanceAmountinLS(amount)

                break;
            } default: {
                alert("Normal flow edit")
                createAdvancePayment(amount)
                break;

            }
        }
    }

    const ShowTransportTable = (medium, rate) => {
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

                console.log('Edited order :', item)
                setMedium(medium)
                setRate(rate)
                const oldmedium = JSON.parse(localStorage.getItem('order'))
                oldmedium.medium = medium
                oldmedium.rate = rate
                localStorage.setItem('order', JSON.stringify(oldmedium))
                console.log('orer to check', localStorage.getItem('order'))

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

        axios.put(`/orders/${_id}`, { transport: {} }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data

                console.log('Edited order :', item)
                setMedium('')
                setRate('')
                const oldTransport = JSON.parse(localStorage.getItem('order'))
                delete oldTransport.transport
                localStorage.setItem('order', JSON.stringify(oldTransport))
                console.log('order amount to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })
    }

    const deleteAdvancePayment = () => {
        console.log('inside parent to delete the AdvancePayment table')
        // put request to delete the transport table
        console.log('check for state here', order)
        const { _id } = order

        axios.put(`/orders/${_id}`, { AdvanceAmount: '' }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const item = response.data

                console.log('Edited order :', item)
                setAdvanceAmount(null)

                delete item.AdvanceAmount
                console.log("--Debug-- latest:", { ...item.customer })
                const newObj = { ...item.customer, items: item.items, status: item.status, ...item.transport, _id: item._id }
                console.log("--Debug-- latest check for flat:", newObj)
                localStorage.setItem('order', JSON.stringify(newObj))
                console.log('order amount to check', localStorage.getItem('order'))

            })
            .catch(err => {
                console.log(err)
            })
    }
    const deleteAdvanceAmountinLS = () => {
        let orderDetails = JSON.parse(localStorage.getItem('orderDetails'))
        delete orderDetails.AdvanceAmount
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
    }
    const deleteAdvancePaymentTable = () => {
        switch (type) {
            case "eventOrder": {
                alert("Inside event order type Delete" + id)
                // api call here to unset advancepayment field
                deleteFieldFromEventOrder(id, 'AdvanceAmount') //fieldName:AdvanceAmount
                // Should refresh the component here advanceAmount 
                setAdvanceAmount(null)
                deleteAdvanceAmountinLS()
                break;
            } default: {
                alert("Normal flow delete advancepayment")
                // normal flow
                deleteAdvancePayment()
                break;
            }
        }


    }

    const calculateTotal = () => {
        return selectedItems.reduce((sum, i) => (
            sum += i.quantity * i.price
        ), 0)
    }

    const calculateBalance = () => {

        if (total && rate && advanceAmount) {
            const balance = rate - advanceAmount + total
            return balance
        }

        if (total && rate && !advanceAmount) {
            console.log("Transportation medium", medium)
            console.log("Transportation amount", rate)
            const balance = rate + total
            return balance
        }
        if (total && !rate && !advanceAmount) {
            const balance = total
            return balance
        }
        if (advanceAmount) {

            console.log("Advance Payment", advanceAmount)
        }
        // console.log("Total", total)
        console.log("Total", total, rate, advanceAmount)
        console.log("Balance", balance)
        // setBalance

        return balance
    }

    const eventTimeCalculate = (time) => {
        const convertedTime = Number(time?.split(':')[0])
        console.log("time :", convertedTime, typeof time);

        if ((convertedTime > 6) && (convertedTime <= 10)) {
            return 'Breakfast'
        } else if ((convertedTime >= 10) && (convertedTime < 19)) {
            return 'Lunch'
        } else if ((convertedTime >= 19) && (convertedTime < 24)) {
            return 'Dinner'
        }
        else {
            return 'default'
        }
    }

    const generateMiscItems = () => {
        alert('clicked on misc')
        // setMiscParticulars([{ particular: '', rate: '' }])
        setShowMiscForm(!showMiscForm)
        setShowMiscTable(false)
    }

    const handleMiscSubmit = (e) => {
        alert('inside handleform')

        e.preventDefault()
        // post request storing an object of string and number and then renedering a table 
        // const transportObject = {
        //     medium: medium, price: price
        // }
        // console.log('transportobject:', transportObject)

        // post request find and replace or create new key value pair
        // props.ShowTransportTable(medium, price)
        // props.ShowTransportForm()



        console.log("final to be submitted", miscItems)
        // Validation here
        const isValid = true
        if (isValid) {
            // PUT request on the id
            console.log("Order id :", id)


            axios.put(`/orders/${id}`, { "misc": miscItems }, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
                .then(response => {
                    const item = response.data

                    console.log('Edited order :', item)
                    setShowMiscForm(false)
                    setShowMiscTable(true)

                })
                .catch(err => {
                    console.log(err)
                })


        }
    }

    const editMiscTable = () => {
        // hide the table , show the form
        setShowMiscTable(false)
        setShowMiscForm(true)
    }

    const deleteMiscTable = () => {
        // put request to delete key - "misc" from db document

        axios.put(`/orders/deleteKey/${id}`, { "key": "misc" }, {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                setShowMiscTable(false)
            })
            .catch(err => {
                console.log("error in Misc deletion:", err)
            })

    }

    return (
        <div id="OrderShowContainer">
            <div id="ShowContainer1">
                <div id="OrderShowContainer">
                    <h2 >
                        {type === "eventOrder" ? <Link to={`/eventOrders/${eventOrderRoute}`} ><button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "marginRight": "10px",
                            "cursor": "pointer",
                        }}
                            onClick={() => { localStorage.removeItem('orderDetails') }}
                        >
                            <img src={backIcon} alt="backIcon" height="30px" width="30px" />
                            Back</button></Link> : (null)}
                        {type === undefined ?
                            <Link to="/orders" ><button style={{
                                "backgroundColor": "#ff881a",
                                "borderRadius": "10px",
                                "padding": "10px",
                                "marginRight": "10px",
                                "cursor": "pointer",
                            }}
                                onClick={() => { localStorage.removeItem('order') }}
                            >
                                <img src={backIcon} alt="backIcon" height="30px" width="30px" />
                                Back</button></Link>
                            : (null)}


                    </h2>
                    <h2 ><Link to="/menu"><button style={{
                        "backgroundColor": "#ff881a",
                        "borderRadius": "10px",
                        "padding": "10px",
                        "cursor": "pointer",
                    }} onClick={() => EditOrder()}>
                        <img src={updateIcon} alt="updateIcon" height="30px" width="30px" />
                        Edit</button></Link></h2>
                </div>
                {type === "eventOrder" ? <div>
                    <h3>EventName  :{headingEventName}</h3>
                    <h3>EventDate  :{headingEventDate}</h3>
                </div> : null}

                <h1>Showing order details:- {type}</h1>
                <h2>Customer Name : {fullName}</h2>
                <h2>Event Name : {eventName}</h2>
                {queries ? (<h2 style={{ "backgroundColor": "red", "color": "white" }}>Queries : {queries}</h2>) : (null)}

                <h2>Number of People : {numberOfPeople}</h2>
                <h2>Event Date : {eventDate}</h2>
                <h2>Event Time : {eventTime} (24 hours IST)/
                    {/* Breakfast lunch dinner calculate */}
                    {eventTimeCalculate(eventTime)}
                </h2>
                <h2>Phone Number : {phoneNumber}</h2>
                <h2>Address : {address}</h2>
                <h2>Email : {email}</h2>
                <h2>Service : {service ? "Yes" : "No"}</h2>
                <h2>Home Delivery : {homeDelivery ? "Yes" : "No"}</h2>
                <h2>Status : {status}</h2>
                <h2>OrderID : {id}</h2>
            </div>

            <div id="ShowContainer2" style={{ "border": "2px solid black", "padding": "20px" }}>
                <h1>Listing Items - {selectedItems.length}</h1>

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
                            selectedItems.map((item, i) => {
                                // This line shows the total for rates (must fix the bug here)
                                // this.state.total += item.quantity * item.price

                                // this.setState(prevState => {prevState.total += item.quantity * item.price})
                                // setTotal(total + item.quantity * item.price)

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

                <h1>Grand Total = {total}</h1>

                <h1>Per plate cost = {total / numberOfPeople}</h1>

                {homeDelivery ? (
                    <button style={{
                        "backgroundColor": "#ff881a",
                        "borderRadius": "10px",
                        "padding": "10px",
                        "cursor": "pointer",
                    }} onClick={() => {
                        console.log('Enter transport clicked')
                        setShowTransportForm(!showTransportForm)
                    }}>
                        <img src={transportIcon} alt="transportIcon" height="30px" width="30px" />
                        Enter Transport
                    </button>
                ) : (null)}

                <button style={{
                    "backgroundColor": "#ff881a",
                    "borderRadius": "10px",
                    "padding": "10px",
                    "cursor": "pointer",
                }} onClick={() => {
                    setShowAdvancePaymentForm(!showAdvancePaymentForm)
                }}>
                    <img src={advanceIcon} alt="advanceIcon" height="30px" width="30px" />
                    Enter Advance payment</button>
                {showAdvancePaymentForm && <AdvancePaymentForm
                    ShowAdvancePaymentTable={ShowAdvancePaymentTable}
                    ShowAdvancePaymentForm={ShowAdvancePaymentForm}
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
                {showMiscForm && <MiscForm
                    miscItems={miscItems}
                    setMiscParticulars={setMiscParticulars}
                    handleMiscSubmit={handleMiscSubmit}
                />}
                {showMiscTable && <MiscTable
                    miscItems={miscItems}
                    editMiscTable={editMiscTable}
                    deleteMiscTable={deleteMiscTable}
                />}
                {advanceAmount && <AdvanceTable
                    deleteTable={deleteAdvancePaymentTable}
                    advanceAmount={advanceAmount}
                />}
                <hr />
                <button style={{
                    "backgroundColor": "#ff881a",
                    "borderRadius": "10px",
                    "padding": "10px",
                    "marginRight": "10px",
                    "cursor": "pointer",
                }} onClick={() => generateBill()}>
                    <img src={billIcon} alt="billIcon" width="30px" height="30px" />
                    Generate Bill
                </button>


                <button onClick={() => downloadBill({
                    name: fullName,
                    date: eventDate,
                    mobile: phoneNumber,
                    items: selectedItems,
                    transportation: { rate },
                    total: total,
                    advancePayment: advanceAmount,
                    balanceAmount: calculateBalance()
                })}>
                    Download bill with items
                </button>

                <hr />

                <button onClick={() => downloadType1Bill({
                    name: fullName,
                    date: eventDate,
                    particulars: eventTimeCalculate(eventTime),
                    numberOfPeople,
                    mobile: phoneNumber,
                    items: selectedItems,
                    transportation: { rate },
                    total: total,
                    advancePayment: advanceAmount,
                    balanceAmount: calculateBalance(),
                    plateCost: (total / numberOfPeople)
                })}>
                    Download Type1 bill
                </button>
                <hr />

                {/* transport and no advance payment + added miscItems*/}
                {medium && !advanceAmount && <button onClick={() => downloadType2Bill({
                    name: fullName,
                    date: eventDate,
                    particulars: eventTimeCalculate(eventTime),
                    numberOfPeople,
                    mobile: phoneNumber,
                    items: selectedItems,
                    transportation: rate,
                    total: total,
                    advancePayment: advanceAmount,
                    balanceAmount: calculateBalance(),
                    plateCost: (total / numberOfPeople),
                    miscItems
                })}>
                    Download Type2 bill
                </button>}

                <hr />


                {/* Transport and advance payment required */}
                {medium && advanceAmount && <button onClick={() => {
                    alert("miscItems " + JSON.stringify(miscItems))

                    downloadType3Bill({
                        name: fullName,
                        date: eventDate,
                        particulars: eventTimeCalculate(eventTime),
                        numberOfPeople,
                        mobile: phoneNumber,
                        items: selectedItems,
                        transportation: rate,
                        total: total,
                        advancePayment: advanceAmount,
                        balanceAmount: calculateBalance(),
                        plateCost: (total / numberOfPeople)
                    })
                }}>
                    Download Type3 bill
                </button>}

                <hr />

                {
                    medium ? (
                        <button style={{
                            "backgroundColor": "#ff881a",
                            "borderRadius": "10px",
                            "padding": "10px",
                            "marginRight": "10px",
                            "cursor": "pointer",
                        }} onClick={() => generateBillDelivery(id)}>
                            <img src={billIcon} alt="billIcon" width="30px" height="30px" />
                            Generate Bill Delivery
                        </button>)
                        :
                        (null)
                }
                <hr />
                <button style={{
                    "backgroundColor": "green",
                    "borderRadius": "10px",
                    "padding": "10px",
                    "marginRight": "10px",
                    "cursor": "pointer",
                }} onClick={() =>
                    generateMiscItems()
                }>
                    <img src={billIcon} alt="billIcon" width="30px" height="30px" />
                    Generate Misc Items
                </button>

            </div>
        </div >
    )
}

export default ItemShow