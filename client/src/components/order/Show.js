import React, { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'
import { motion } from 'framer-motion'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import axios from '../../config/axios.js'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setEditingOrder } from '../../store/slices/cartSlice'
import ConfirmDialog from '../ConfirmDialog'
import { useDeleteOrderMutation } from '../../store/services/ordersApi'
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
    const [editMode, setEditMode] = useState(false)
    const [editFields, setEditFields] = useState({})
    const [confirmState, setConfirmState] = useState({ open: false })

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [deleteOrder] = useDeleteOrderMutation()

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
        dispatch(setEditingOrder(order))
        navigate('/menu')
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
        console.log(`[AdvancePayment] saving | orderId: ${id} | amount: ₹${amount}`)
        axios.put(`/orders/${id}`, { AdvanceAmount: amount }, {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(() => {
                console.log(`[AdvancePayment] saved successfully | amount: ₹${amount}`)
                setAdvanceAmount(amount)
            })
            .catch(err => console.error('[AdvancePayment] save failed:', err))
    }

    const ShowAdvancePaymentTable = (amount) => {
        console.log(`[AdvancePayment] submit | flow: ${type || 'normal'} | amount: ₹${amount}`)
        if (type === 'eventOrder') {
            updateEventOrder(id, { AdvanceAmount: amount })
            setAdvanceAmount(amount)
        } else {
            createAdvancePayment(amount)
        }
    }

    const updateTransport = (medium, rate) => {
        console.log(`[Transport] saving | orderId: ${id} | medium: ${medium} | rate: ₹${rate}`)
        axios.put(`/orders/${id}`, { transport: { medium, rate } }, {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(() => {
                console.log(`[Transport] saved successfully | medium: ${medium} | rate: ₹${rate}`)
                setMedium(medium)
                setRate(rate)
            })
            .catch(err => console.error('[Transport] save failed:', err))
    }

    const ShowTransportTable = (medium, rate) => {
        console.log(`[Transport] submit | flow: ${type || 'normal'} | medium: ${medium} | rate: ₹${rate}`)
        if (type === 'eventOrder') {
            updateEventOrder(id, { transport: { medium, rate } })
            setMedium(medium)
            setRate(rate)
        } else {
            updateTransport(medium, rate)
        }
    }


    const deleteTransportTable = () => {
        console.log(`[Transport] deleting | flow: ${type || 'normal'} | orderId: ${id}`)
        if (type === 'eventOrder') {
            deleteFieldFromEventOrder(id, 'transport')
            setMedium('')
            setRate('')
        } else {
            axios.put(`/orders/${id}`, { transport: {} }, {
                headers: { 'x-auth': localStorage.getItem('token') }
            })
                .then(() => {
                    console.log('[Transport] deleted successfully')
                    setMedium('')
                    setRate('')
                })
                .catch(err => console.error('[Transport] delete failed:', err))
        }
    }

    const deleteAdvancePaymentTable = () => {
        console.log(`[AdvancePayment] deleting | flow: ${type || 'normal'} | orderId: ${id}`)
        if (type === 'eventOrder') {
            deleteFieldFromEventOrder(id, 'AdvanceAmount')
            setAdvanceAmount(null)
        } else {
            axios.put(`/orders/${id}`, { AdvanceAmount: null }, {
                headers: { 'x-auth': localStorage.getItem('token') }
            })
                .then(() => {
                    console.log('[AdvancePayment] deleted successfully')
                    setAdvanceAmount(null)
                })
                .catch(err => console.error('[AdvancePayment] delete failed:', err))
        }
    }

    const calculateTotal = () => {
        return selectedItems.reduce((sum, i) => (
            sum += i.quantity * i.price
        ), 0)
    }

    const calculateBalance = () => {
        console.log('[Balance] calculating | miscItems:', JSON.stringify(miscItems))
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

    const openEditMode = () => {
        setEditFields({
            fullName,
            phoneNumber,
            email,
            address,
            eventName,
            numberOfPeople,
            eventTime,
            eventDate: eventDateNew ? new Date(eventDateNew) : new Date(),
            queries,
            homeDelivery,
            service,
            status,
        })
        setEditMode(true)
    }

    const cancelEdit = () => setEditMode(false)

    const saveEdit = () => {
        const d = editFields.eventDate instanceof Date && !isNaN(editFields.eventDate)
            ? editFields.eventDate
            : null
        const savedEventDate = d ? d.toISOString() : eventDateNew
        const savedEventTime = d
            ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
            : editFields.eventTime

        console.log(`[EditDetails] saving | eventDate: ${savedEventDate} | eventTime: ${savedEventTime}`)

        axios.put(`/orders/${id}`, {
            customer: {
                fullName: editFields.fullName,
                phoneNumber: editFields.phoneNumber,
                email: editFields.email,
                address: editFields.address,
                eventName: editFields.eventName,
                numberOfPeople: editFields.numberOfPeople,
                eventDate: savedEventDate,
                eventTime: savedEventTime,
                homeDelivery: editFields.homeDelivery,
                service: editFields.service,
                queries: editFields.queries,
                customer_id,
            },
            status: editFields.status,
        }, {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(() => {
                setFullName(editFields.fullName)
                setPhoneNumber(editFields.phoneNumber)
                setEmail(editFields.email)
                setAddress(editFields.address)
                setEventName(editFields.eventName)
                setNumberOfPeople(editFields.numberOfPeople)
                setEventTime(savedEventTime)
                setEventDateNew(savedEventDate)
                setHomeDelievery(editFields.homeDelivery)
                setService(editFields.service)
                setQueries(editFields.queries)
                setStatus(editFields.status)
                setEditMode(false)
                console.log('[EditDetails] saved successfully')
            })
            .catch(err => console.error('[EditDetails] save failed:', err))
    }

    const handleDeleteOrder = () => {
        setConfirmState({
            open: true,
            title: 'Delete Order',
            message: `Delete order for ${fullName}?`,
            onConfirm: async () => {
                setConfirmState(s => ({ ...s, open: false }))
                try {
                    await deleteOrder(id).unwrap()
                    navigate('/orders')
                } catch (err) {
                    console.error('[DeleteOrder] failed:', err)
                }
            }
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
            <div className="mos__nav mos__nav--flex">
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
                <button className="mos__nav-btn" onClick={EditOrder}>
                    <img src={updateIcon} alt="" height="20" width="20" />
                    Edit
                </button>
                <button className="mos__nav-btn" onClick={openEditMode}>
                    <img src={updateIcon} alt="" height="20" width="20" />
                    Edit Details
                </button>
                {type === undefined && (
                    <button className="mos__nav-btn mos__nav-btn--danger" onClick={handleDeleteOrder}>
                        Delete
                    </button>
                )}
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

                        {editMode ? (
                            <div className="mos__edit-fields">
                                <TextField
                                    label="Full Name"
                                    value={editFields.fullName || ''}
                                    onChange={e => setEditFields(f => ({ ...f, fullName: e.target.value }))}
                                    size="small"
                                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}
                                />
                                <TextField
                                    label="Phone Number"
                                    value={editFields.phoneNumber || ''}
                                    onChange={e => setEditFields(f => ({ ...f, phoneNumber: e.target.value }))}
                                    size="small"
                                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}
                                />
                                <TextField
                                    label="Email"
                                    value={editFields.email || ''}
                                    onChange={e => setEditFields(f => ({ ...f, email: e.target.value }))}
                                    size="small"
                                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}
                                />
                                <TextField
                                    label="Address"
                                    value={editFields.address || ''}
                                    onChange={e => setEditFields(f => ({ ...f, address: e.target.value }))}
                                    size="small"
                                    multiline
                                    rows={2}
                                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}
                                />
                                <TextField
                                    label="Event Name"
                                    value={editFields.eventName || ''}
                                    onChange={e => setEditFields(f => ({ ...f, eventName: e.target.value }))}
                                    size="small"
                                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}
                                />
                                <TextField
                                    label="Number of People"
                                    type="number"
                                    value={editFields.numberOfPeople || ''}
                                    onChange={e => setEditFields(f => ({ ...f, numberOfPeople: e.target.value }))}
                                    size="small"
                                    slotProps={{ htmlInput: { min: 1 } }}
                                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}
                                />
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        label="Event Date & Time"
                                        value={editFields.eventDate || null}
                                        onChange={val => setEditFields(f => ({ ...f, eventDate: val }))}
                                        slotProps={{
                                            textField: {
                                                size: 'small',
                                                sx: { '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                                <FormControl size="small" sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        label="Status"
                                        value={editFields.status || ''}
                                        onChange={e => setEditFields(f => ({ ...f, status: e.target.value }))}
                                    >
                                        <MenuItem value="approve">Approve</MenuItem>
                                        <MenuItem value="confirmed">Confirmed</MenuItem>
                                        <MenuItem value="completed">Completed</MenuItem>
                                        <MenuItem value="rejected">Rejected</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!!editFields.homeDelivery}
                                            onChange={e => setEditFields(f => ({ ...f, homeDelivery: e.target.checked }))}
                                            sx={{ color: '#C9A227', '&.Mui-checked': { color: '#C9A227' } }}
                                        />
                                    }
                                    label="Home Delivery"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!!editFields.service}
                                            onChange={e => setEditFields(f => ({ ...f, service: e.target.checked }))}
                                            sx={{ color: '#C9A227', '&.Mui-checked': { color: '#C9A227' } }}
                                        />
                                    }
                                    label="Service"
                                />
                                <TextField
                                    label="Queries"
                                    value={editFields.queries || ''}
                                    onChange={e => setEditFields(f => ({ ...f, queries: e.target.value }))}
                                    size="small"
                                    multiline
                                    rows={3}
                                    sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#C9A227' } }, '& label.Mui-focused': { color: '#7a6010' } }}
                                />
                                <div className="mos__edit-addr-row">
                                    <Button
                                        variant="contained"
                                        onClick={saveEdit}
                                        sx={{ backgroundColor: '#C9A227', color: '#3d2e00', fontWeight: 700, '&:hover': { backgroundColor: '#e8c84d' } }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={cancelEdit}
                                        sx={{ borderColor: '#C9A227', color: '#7a6010', '&:hover': { borderColor: '#e8c84d', backgroundColor: 'rgba(201,162,39,0.08)' } }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
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

                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/customers/add', {
                                        state: {
                                            prefill: {
                                                fullName,
                                                email,
                                                phoneNumber: [{ primary: String(phoneNumber) }],
                                                address: [{ Home: address }]
                                            }
                                        }
                                    })}
                                    sx={{
                                        mt: 1.5,
                                        borderColor: '#C9A227',
                                        color: '#7a6010',
                                        fontWeight: 600,
                                        '&:hover': { borderColor: '#e8c84d', backgroundColor: 'rgba(201,162,39,0.08)' }
                                    }}
                                >
                                    Add to Customer DB
                                </Button>
                            </>
                        )}
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
                    <h2 className="mos__card-title mos__card-title--spaced">Admin Actions</h2>

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

                    <p className="mos__section-label">
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

            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                confirmText="Delete"
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState(s => ({ ...s, open: false }))}
            />
        </div>
    )
}

export default ItemShow
