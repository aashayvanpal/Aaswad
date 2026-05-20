import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Divider from '@mui/material/Divider'
import axios from '../../config/axios.js'
import { Link } from 'react-router-dom'
import '../../css/myOrdersShow.scss'
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
import downloadCustomBill from '../../assets/generateBill/types/custom.js'
import MiscTable from './MiscTable.js'
import { updateEventOrder, deleteFieldFromEventOrder } from '../../apis/eventOrders.js'
import moment from 'moment'
import { deleteOrderFromEventOrders } from '../../apis/eventOrders.js'

const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
}

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
}

const STATUS_META = {
    pending:   { label: 'Pending',   className: 'mos__badge--pending'   },
    approved:  { label: 'Approved',  className: 'mos__badge--approved'  },
    completed: { label: 'Completed', className: 'mos__badge--completed' },
    rejected:  { label: 'Rejected',  className: 'mos__badge--rejected'  },
}

const ItemShow = ({ type }) => {

    const [order, setOrder] = useState({})
    const [id, setId] = useState('')
    const [customer_id, setCustomerId] = useState('')
    const [fullName, setFullName] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [eventDateNew, setEventDateNew] = useState('')
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
                let eventDateNew = order.customer.eventDate
                let advanceAmount = order.AdvanceAmount
                eventDate = eventDate.substr(8, 2) + "/" + eventDate.substr(5, 2) + "/" + eventDate.substr(0, 4)

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
                    setEventDateNew(eventDateNew)
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
                    setEventDateNew(eventDateNew)

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
        setEventDateNew(order.customer.eventDate)

        setPhoneNumber(order.customer.phoneNumber)
        setAddress(order.customer.address)
        setEmail(order.customer.email)
        setService(order.customer.service)
        setHomeDelievery(order.customer.homeDelivery)
        setStatus(order.status)
        setId(order.orderId)
        setSelectedItems(order.items)
        setQueries(order.customer.queries)
        if (order.AdvanceAmount) {
            setAdvanceAmount(Number(order.AdvanceAmount))
        }
        if (order.transport) {
            setMedium(order.transport.medium)
            setRate(order.transport.rate)
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
        window.open(window.location.href + `/printDelivery`, '_blank')
    }

    const EditOrder = () => {
        console.log("Inside EditOrder")
        alert("EDIT ORDER :" + type)
        switch (type) {
            case "eventOrder": {
                alert("Inside event order type")
                let orderDetails = JSON.parse(localStorage.getItem('orderDetails'))
                console.log("I need customer object here", orderDetails.order.customer)
                console.log("I need customer object eventDate", moment(orderDetails.order.customer.eventDate).format('DD/MM/YYYY'))
                console.log("I need customer object eventTime", moment(orderDetails.order.customer.eventDate).format('H:m'))
                orderDetails.order.customer.eventTime = moment(orderDetails.order.customer.eventDate).format('H:m')
                orderDetails.order.customer.eventDate = moment(orderDetails.order.customer.eventDate).format('DD/MM/YYYY')
                console.log("I need customer object order", orderDetails)

                localStorage.setItem('order', JSON.stringify(orderDetails.order.customer))

                const eventId = window.location.href.split('/')[4]
                localStorage.setItem('eventId', eventId)

                deleteOrderFromEventOrders(id)

                break;
            } default: {
                alert("Normal flow edit")
                break;
            }
        }

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
                console.log("selectedItems", selectedItems)
                console.log("filteredItems", filteredItems)

                var desiredResultArray = filteredItems.map(item => selectedItems.find(i => i._id === item._id) || item)
                console.log("desiredResultArray:", desiredResultArray)

                localStorage.setItem("cartItems", JSON.stringify(desiredResultArray))

            })
        console.log('set user here')
    }

    const ShowTransportForm = () => {
        setShowTransportForm(false)
    }
    const ShowMiscForm = () => {
        setShowMiscForm(false)
    }
    const ShowAdvancePaymentForm = () => {
        setShowAdvancePaymentForm(false)
    }

    const createAdvancePayment = (amount) => {
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
        setAdvanceAmount(amount)

        let orderDetails = JSON.parse(localStorage.getItem('orderDetails'))
        orderDetails.order.AdvanceAmount = amount
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
    }
    const ShowAdvancePaymentTable = (amount) => {

        alert("type!:" + type)

        switch (type) {
            case "eventOrder": {
                alert("Inside event order type")
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

    const updateTransport = (medium, rate) => {
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

    const ShowTransportTable = (medium, rate) => {

        alert("type for entering medium:" + type)

        switch (type) {
            case "eventOrder": {
                alert("Inside event order type" + medium + rate)
                updateEventOrder(id, { transport: { medium, rate } })
                setMedium(medium)
                setRate(rate)
                let orderDetails = JSON.parse(localStorage.getItem('orderDetails'))
                orderDetails.order.transport = { medium, rate }
                localStorage.setItem('orderDetails', JSON.stringify(orderDetails))

                break;
            } default: {
                alert("Normal flow edit")
                updateTransport(medium, rate)
                break;

            }
        }
    }


    const deleteTransportTable = () => {
        alert("type for deleting medium:")

        switch (type) {
            case "eventOrder": {
                alert("Inside event order type" + id)
                deleteFieldFromEventOrder(id, 'transport')

                setMedium('')
                let orderDetails = JSON.parse(localStorage.getItem('orderDetails'))
                delete orderDetails.order.transport
                localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
                break;
            } default: {
                alert("Normal flow edit transport")
                console.log('inside parent to delete the transport table')
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
                break;

            }
        }


    }

    const deleteAdvancePayment = () => {
        console.log('inside parent to delete the AdvancePayment table')
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
        delete orderDetails.order.AdvanceAmount
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails))
    }
    const deleteAdvancePaymentTable = () => {
        switch (type) {
            case "eventOrder": {
                alert("Inside event order type Delete" + id)
                deleteFieldFromEventOrder(id, 'AdvanceAmount')
                setAdvanceAmount(null)
                deleteAdvanceAmountinLS()
                break;
            } default: {
                alert("Normal flow delete advancepayment")
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
        alert("misssc calc balance :", JSON.stringify(miscItems))
        if (total && rate && advanceAmount) {
            const balance = rate - advanceAmount + total
            return balance
        }

        if (total && rate && !advanceAmount) {
            console.log("Transportation medium", medium)
            console.log("Transportation amount", rate)
            console.log("total", total)
            const balance = Number(rate) + Number(total)
            return balance
        }
        if (total && !rate && !advanceAmount) {
            const balance = total
            return balance
        }
        if (advanceAmount) {

            console.log("Advance Payment", advanceAmount)
        }
        console.log("Total", total, rate, advanceAmount)
        console.log("Balance", balance)

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
            return 'Lunch'
        }
    }

    const generateMiscItems = () => {
        alert('clicked on misc')
        setShowMiscForm(!showMiscForm)
        setShowMiscTable(false)
    }

    const handleMiscSubmit = (e) => {
        alert('inside handleform')

        e.preventDefault()

        console.log("final to be submitted", miscItems)
        const isValid = true
        if (isValid) {
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
        setShowMiscTable(false)
        setShowMiscForm(true)
    }

    const deleteMiscTable = () => {
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

    const meta = STATUS_META[status] ?? { label: status, className: '' }

    const thCell = {
        backgroundColor: 'rgba(201, 162, 39, 0.12)',
        color: '#6b7280',
        fontWeight: 700,
        fontSize: '1rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontFamily: 'inherit',
        padding: '0.875rem 1.25rem',
        borderBottom: '2px solid rgba(201, 162, 39, 0.3)',
        whiteSpace: 'nowrap',
    }

    const tdCell = {
        fontSize: '1.4rem',
        fontFamily: 'inherit',
        color: '#1a1a1a',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
    }

    return (
        <div className="mos">

            {/* ── Back / Edit nav ──────────────────────────────────── */}
            <div className="mos__nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {type === "eventOrder" && (
                    <Link to={`/eventOrders/${eventOrderRoute}`}>
                        <button className="mos__nav-btn" onClick={() => localStorage.removeItem('orderDetails')}>
                            <img src={backIcon} alt="" height="20" width="20" />
                            Back
                        </button>
                    </Link>
                )}
                {type === undefined && (
                    <Link to="/orders">
                        <button className="mos__nav-btn" onClick={() => localStorage.removeItem('order')}>
                            <img src={backIcon} alt="" height="20" width="20" />
                            Back
                        </button>
                    </Link>
                )}
                <Link to="/menu">
                    <button className="mos__nav-btn" onClick={() => EditOrder()}>
                        <img src={updateIcon} alt="" height="20" width="20" />
                        Edit
                    </button>
                </Link>
            </div>

            <div className="mos__body">
                <motion.div
                    className="mos__grid"
                    initial="hidden"
                    animate="show"
                    variants={stagger}
                >

                    {/* ── Customer details card ─────────────────────────── */}
                    <motion.div className="mos__card" variants={fadeUp}>
                        <div className="mos__card-header">
                            <h2 className="mos__card-event-name">
                                {type === "eventOrder" ? headingEventName : (eventName || 'Order Details')}
                            </h2>
                            <span className={`mos__badge ${meta.className}`}>
                                {meta.label}
                            </span>
                        </div>

                        {type === "eventOrder" && (
                            <div className="mos__admin-event-meta">
                                <span>Event: {headingEventName}</span>
                                <span>Date: {headingEventDate}</span>
                            </div>
                        )}

                        <ul className="mos__detail-list">
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">👤</span>
                                <span className="mos__detail-label">Customer</span>
                                <span className="mos__detail-value">{fullName}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">🎉</span>
                                <span className="mos__detail-label">Event Name</span>
                                <span className="mos__detail-value">{eventName}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">📅</span>
                                <span className="mos__detail-label">Event Date</span>
                                <span className="mos__detail-value">{eventDate}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">📅</span>
                                <span className="mos__detail-label">Event Date (raw)</span>
                                <span className="mos__detail-value">{eventDateNew}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">⏰</span>
                                <span className="mos__detail-label">Event Time</span>
                                <span className="mos__detail-value">
                                    {eventTime} — {eventTimeCalculate(eventTime)}
                                </span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">👥</span>
                                <span className="mos__detail-label">Guests</span>
                                <span className="mos__detail-value">{numberOfPeople}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">📞</span>
                                <span className="mos__detail-label">Phone</span>
                                <span className="mos__detail-value">{phoneNumber}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">📍</span>
                                <span className="mos__detail-label">Address</span>
                                <span className="mos__detail-value">{address}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">✉</span>
                                <span className="mos__detail-label">Email</span>
                                <span className="mos__detail-value">{email}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">🍽</span>
                                <span className="mos__detail-label">Service</span>
                                <span className="mos__detail-value">{service ? 'Yes' : 'No'}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">🚚</span>
                                <span className="mos__detail-label">Home Delivery</span>
                                <span className="mos__detail-value">{homeDelivery ? 'Yes' : 'No'}</span>
                            </li>
                            <li className="mos__detail-item">
                                <span className="mos__detail-icon">🪪</span>
                                <span className="mos__detail-label">Order ID</span>
                                <span className="mos__detail-value">{id}</span>
                            </li>
                        </ul>

                        {queries && (
                            <div className="mos__admin-queries">
                                Queries: {queries}
                            </div>
                        )}

                        <p className="mos__billing-note" style={{ marginTop: '1rem' }}>
                            add this user to db link feature : navigate to user account with prefilled fields
                        </p>
                    </motion.div>

                    {/* ── Items card ───────────────────────────────────── */}
                    <motion.div className="mos__card" variants={fadeUp}>
                        <h2 className="mos__card-title">
                            Order Items
                            <span className="mos__item-count">{selectedItems.length}</span>
                        </h2>

                        <TableContainer sx={{ borderRadius: '10px', border: '1px solid rgba(201,162,39,0.2)', overflow: 'hidden', mb: 0 }}>
                            <Table size="medium">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ ...thCell, width: 52, textAlign: 'center' }}>#</TableCell>
                                        <TableCell sx={thCell}>Item Name</TableCell>
                                        <TableCell sx={thCell}>Qty</TableCell>
                                        <TableCell sx={{ ...thCell, textAlign: 'right' }}>Price</TableCell>
                                        <TableCell sx={{ ...thCell, textAlign: 'right' }}>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedItems.map((item, i) => (
                                        <TableRow
                                            key={i}
                                            sx={{
                                                '&:hover': { backgroundColor: 'rgba(201,162,39,0.05)' },
                                                '&:last-child td': { borderBottom: 'none' },
                                            }}
                                        >
                                            <TableCell sx={{ ...tdCell, color: '#C9A227', fontWeight: 700, textAlign: 'center' }}>
                                                {i + 1}
                                            </TableCell>
                                            <TableCell sx={{ ...tdCell, fontWeight: 600 }}>{item.name}</TableCell>
                                            <TableCell sx={tdCell}>{item.quantity} {item.measured}</TableCell>
                                            <TableCell sx={{ ...tdCell, textAlign: 'right' }}>&#8377;{item.price}</TableCell>
                                            <TableCell sx={{ ...tdCell, textAlign: 'right', fontWeight: 700, color: '#C9A227' }}>
                                                &#8377;{item.quantity * item.price}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Divider sx={{ my: 2.5 }} />

                        <div className="mos__admin-totals">
                            <div className="mos__admin-total-row mos__admin-total-row--grand">
                                <span>Grand Total</span>
                                <span>&#8377;{total}</span>
                            </div>
                            <div className="mos__admin-total-row">
                                <span>Per Plate Cost</span>
                                <span>&#8377;{total / numberOfPeople}</span>
                            </div>
                            <div className="mos__admin-total-row">
                                <span>Per Plate (DB)</span>
                                <span>&#8377;{order.amount}</span>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>

                {/* ── Admin actions card ──────────────────────────────── */}
                <motion.div
                    className="mos__card"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.18, ease: 'easeOut' }}
                >
                    <h2 className="mos__card-title" style={{ marginBottom: '1.5rem' }}>Admin Actions</h2>

                    <div className="mos__admin-actions">
                        {homeDelivery && (
                            <button className="mos__action-btn" onClick={() => setShowTransportForm(!showTransportForm)}>
                                <img src={transportIcon} alt="" height="24" width="24" />
                                Enter Transport
                            </button>
                        )}
                        <button className="mos__action-btn" onClick={() => setShowAdvancePaymentForm(!showAdvancePaymentForm)}>
                            <img src={advanceIcon} alt="" height="24" width="24" />
                            Enter Advance Payment
                        </button>
                        <button className="mos__action-btn" onClick={() => generateMiscItems()}>
                            <img src={billIcon} alt="" height="24" width="24" />
                            Generate Misc Items
                        </button>
                        <button className="mos__action-btn" onClick={() => generateBill()}>
                            <img src={billIcon} alt="" height="24" width="24" />
                            Generate Bill
                        </button>
                        {medium && (
                            <button className="mos__action-btn" onClick={() => generateBillDelivery(id)}>
                                <img src={billIcon} alt="" height="24" width="24" />
                                Generate Bill Delivery
                            </button>
                        )}
                    </div>

                    {showAdvancePaymentForm && (
                        <AdvancePaymentForm
                            ShowAdvancePaymentTable={ShowAdvancePaymentTable}
                            ShowAdvancePaymentForm={ShowAdvancePaymentForm}
                            advanceAmount={advanceAmount}
                        />
                    )}
                    {showTransportForm && (
                        <TransportForm
                            ShowTransportForm={ShowTransportForm}
                            ShowTransportTable={ShowTransportTable}
                            price={rate}
                            medium={medium}
                        />
                    )}
                    {medium && (
                        <TransportTable
                            deleteTable={deleteTransportTable}
                            medium={medium}
                            rate={rate}
                        />
                    )}
                    {showMiscForm && (
                        <MiscForm
                            miscItems={miscItems}
                            setMiscParticulars={setMiscParticulars}
                            handleMiscSubmit={handleMiscSubmit}
                        />
                    )}
                    {showMiscTable && (
                        <MiscTable
                            miscItems={miscItems}
                            editMiscTable={editMiscTable}
                            deleteMiscTable={deleteMiscTable}
                        />
                    )}
                    {advanceAmount && (
                        <AdvanceTable
                            deleteTable={deleteAdvancePaymentTable}
                            advanceAmount={advanceAmount}
                        />
                    )}

                    <Divider sx={{ my: 2.5 }} />

                    <p style={{ fontFamily: 'inherit', fontSize: '1rem', fontWeight: 700, color: '#6b7280', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 1rem' }}>
                        Bill Downloads
                    </p>
                    <div className="mos__admin-actions">
                        <button className="mos__action-btn mos__action-btn--secondary" onClick={() => downloadBill({
                            name: fullName,
                            date: eventDateNew,
                            mobile: phoneNumber,
                            items: selectedItems,
                            transportation: { medium, rate },
                            total: total,
                            advancePayment: advanceAmount,
                            balanceAmount: calculateBalance(),
                            miscItems
                        })}>
                            Download bill with items
                        </button>
                        <button className="mos__action-btn mos__action-btn--secondary" onClick={() => downloadType1Bill({
                            name: fullName,
                            date: eventDateNew,
                            particulars: eventTimeCalculate(eventTime),
                            numberOfPeople,
                            mobile: phoneNumber,
                            items: selectedItems,
                            transportation: { rate },
                            total: total,
                            advancePayment: advanceAmount,
                            balanceAmount: calculateBalance(),
                            plateCost: (total / numberOfPeople),
                            miscItems
                        })}>
                            Download Type1 bill
                        </button>
                        {medium && !advanceAmount && (
                            <button className="mos__action-btn mos__action-btn--secondary" onClick={() => downloadType2Bill({
                                name: fullName,
                                date: eventDateNew,
                                particulars: eventTimeCalculate(eventTime),
                                numberOfPeople,
                                mobile: phoneNumber,
                                items: selectedItems,
                                transportation: rate,
                                total: total,
                                advancePayment: advanceAmount,
                                balanceAmount: calculateBalance(),
                                plateCost: Math.round(total / numberOfPeople),
                                miscItems,
                                medium
                            })}>
                                Download Type2 bill
                            </button>
                        )}
                        {medium && advanceAmount && (
                            <button className="mos__action-btn mos__action-btn--secondary" onClick={() => {
                                alert("miscItems " + JSON.stringify(miscItems))
                                downloadType3Bill({
                                    name: fullName,
                                    date: eventDateNew,
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
                                })
                            }}>
                                Download Type3 bill
                            </button>
                        )}
                        <button className="mos__action-btn mos__action-btn--secondary" onClick={() => downloadCustomBill({
                            name: fullName,
                            date: eventDateNew,
                            particulars: eventTimeCalculate(eventTime),
                            numberOfPeople,
                            mobile: phoneNumber,
                            items: selectedItems,
                            transportation: rate,
                            total: total,
                            advancePayment: advanceAmount,
                            balanceAmount: calculateBalance(),
                            plateCost: Math.round(total / numberOfPeople),
                            miscItems,
                            medium
                        })}>
                            Make custom Bill
                        </button>
                    </div>
                </motion.div>

            </div>
        </div>
    )
}

export default ItemShow
