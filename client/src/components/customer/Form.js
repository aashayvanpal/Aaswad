import React, { useState, useEffect } from 'react'
import axios from '../../config/axios.js'
import './Form.scss'
import SubmitEnquiryModal from './SubmitEnquiryModal.js'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'
import { getUserDetails } from '../../assets/user-functions.js'
import TransportForm from '../order/TransportForm.js'
import AdvancePaymentForm from '../order/AdvancePaymentForm.js'
import MiscForm from '../order/MiscForm.js'
import { getAllCustomers } from '../../apis/customers.js'
import CustomerModal from './CustomerModal/index.js'
import { createCustomer, updateCustomer } from '../../apis/customers.js'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import CloseIcon from '@mui/icons-material/Close'

import HDToolTip from './HDToolTip.js'
import ServiceToolTip from './ServiceToolTip.js'

const CustomerForm = (props) => {
    const editingOrder = useSelector(state => state.cart.editingOrder)
    let time = String(new Date()).substr(16, 5)

    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [queries, setQuerries] = useState('')
    const [eventName, setEventName] = useState('')
    const [numberOfPeople, setNumberOfPeople] = useState(1)
    const [eventTime, setEventTime] = useState(time)
    const [homeDelivery, setHomeDelivery] = useState(false)
    const [service, setService] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [nameError, setNameError] = useState('')
    const [phoneNumberError, setPhoneNumberError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [noOfPeopleError, setNoOfPeopleError] = useState('')
    const [addressError, setAddressError] = useState('')
    const [id, setId] = useState('')
    const [userType, setUserType] = useState('')
    const [openSubmitEnquiryModal, setOpenSubmitEnquiryModal] = useState(false)
    const [customers, setCustomers] = useState([])

    const [transport, setTransport] = useState({ medium: '', rate: '' })
    const [showTransportForm, setShowTransportForm] = useState(false)
    const [advanceAmount, setAdvanceAmount] = useState('')
    const [showAdvanceForm, setShowAdvanceForm] = useState(false)
    const [miscItems, setMiscItems] = useState([])
    const [showMiscForm, setShowMiscForm] = useState(false)

    const fetchCustomers = async () => {
        const res = await getAllCustomers()
        setCustomers(res.data)
    }

    const getUserType = async () => {
        const user = await getUserDetails()
        if (user.userType === 'Admin') {
            setUserType(user.userType)
            fetchCustomers()
        }
    }

    useEffect(() => {
        if (editingOrder) {
            const c = editingOrder.customer
            let evtTime = c.eventTime || '12:30'
            const dateParts = c.eventDate ? c.eventDate.split('/') : []
            let dateObject = new Date()
            if (dateParts.length === 3) {
                dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
                dateObject.setHours(evtTime.split(':')[0], evtTime.split(':')[1])
            }
            setStartDate(dateObject)
            setFullName(c.fullName)
            setPhoneNumber(c.phoneNumber)
            setEventTime(evtTime)
            setEmail(c.email)
            setAddress(c.address)
            setEventName(c.eventName)
            setNumberOfPeople(String(c.numberOfPeople))
            setId(c.customer_id)
            setHomeDelivery(c.homeDelivery)
            setService(c.service)
            setQuerries(c.queries)
            if (editingOrder.transport?.medium) {
                setTransport({ ...editingOrder.transport })
            } else if (c.homeDelivery) {
                setShowTransportForm(true)
            }
            if (editingOrder.AdvanceAmount) setAdvanceAmount(editingOrder.AdvanceAmount)
            if (editingOrder.misc?.length) setMiscItems(editingOrder.misc.map(m => ({ ...m })))
        } else {
            axios.get('/account', { headers: { 'x-auth': localStorage.getItem('token') } })
                .then(res => {
                    setFullName(res.data.username)
                    setEmail(res.data.email)
                    setAddress(res.data.address)
                    setId(res.data.id)
                    setPhoneNumber(res.data.phonenumber)
                })
                .catch(err => console.log(err))
        }
        getUserType()
    }, [])

    const validate = () => {
        let nameError = '', emailError = '', phoneNumberError = '', noOfPeopleError = '', addressError = ''
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '~', '_', '`', '(', ')', '+', '-', '/', '.', ',', '[', ']', '{', '}', '?', ':', ';', "'", '"', '|', '>', '<']
        const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        if (fullName.length < 5) nameError = 'Full name cannot be less than 5 characters'
        if (specialChars.some(c => fullName.includes(c))) nameError = 'Full name cannot contain special characters'
        if (digits.some(d => fullName.includes(d))) nameError = 'Full name cannot contain numbers'
        if (email.length < 5) emailError = 'Email cannot be less than 5 characters'
        if (!email.includes('@')) emailError = 'Email must contain @ symbol'
        if (phoneNumber.toString().length !== 10) phoneNumberError = 'Phone number must be 10 digits'
        if (!digits.some(d => numberOfPeople.toString().includes(d))) noOfPeopleError = 'Number of people must be a number'
        if (address.length === 0) addressError = 'Address cannot be empty'

        if (emailError || nameError || phoneNumberError || noOfPeopleError) {
            setEmailError(emailError)
            setNameError(nameError)
            setPhoneNumberError(phoneNumberError)
            setNoOfPeopleError(noOfPeopleError)
            setAddressError(addressError)
            return false
        }
        return true
    }

    const findCustomerByName = (name) => customers.find(c => c.fullName === name) || false

    const handleSubmit = async () => {
        const isValid = validate()
        if (!isValid) return

        const customer = {
            fullName, phoneNumber, email, address, queries,
            eventName, numberOfPeople, eventDate: startDate,
            eventTime, homeDelivery, service, customer_id: id,
        }

        const foundCustomer = findCustomerByName(fullName)
        if (foundCustomer) {
            const DBPhoneNumber = foundCustomer.phoneNumber
            const isNewNumber = DBPhoneNumber.reduce((acc, item) => {
                if (Number(item[Object.keys(item)[0]]) === Number(customer.phoneNumber)) acc = 0
                return acc
            }, 1)
            const DBAddress = foundCustomer.address
            const isNewAddress = DBAddress.reduce((acc, item) => {
                if (item[Object.keys(item)[0]] === customer.address) acc = 0
                return acc
            }, 1)

            if (isNewAddress && isNewNumber) {
                const phoneKey = prompt('Save this number as?')
                const phoneNumbers = [...DBPhoneNumber, { [phoneKey]: customer.phoneNumber.toString() }]
                const addressKey = prompt('Save this address as?')
                const addr = [...DBAddress, { [addressKey]: customer.address }]
                try { await updateCustomer(foundCustomer._id, { ...foundCustomer, phoneNumber: phoneNumbers, address: addr }) } catch { }
            } else {
                if (isNewNumber) {
                    const key = prompt('Save this number as?')
                    const phoneNumbers = [...DBPhoneNumber, { [key]: customer.phoneNumber.toString() }]
                    try { await updateCustomer(foundCustomer._id, { ...foundCustomer, phoneNumber: phoneNumbers }) } catch { }
                }
                if (isNewAddress) {
                    const key = prompt('Save this address as?')
                    const addr = [...DBAddress, { [key]: customer.address }]
                    try { await updateCustomer(foundCustomer._id, { ...foundCustomer, address: addr }) } catch { }
                }
            }
        } else {
            const newCustomer = {
                fullName,
                email: email || 'test@gmail.com',
                phoneNumber: { primary: phoneNumber },
                birthday: '', gender: 'male', profilePicture: '',
                address: { Home: address },
                language: ['English'],
                membership: { status: 'inactive', level: 'basic', points: 0 },
            }
            try {
                const res = await createCustomer(newCustomer)
                if (res.status === 200) alert(`Customer ${fullName} created successfully!`)
            } catch { alert('Error creating customer') }
        }

        props.handleCustomerSubmit({ customer, transport, AdvanceAmount: advanceAmount, misc: miscItems })
    }

    const handleDateChange = date => {
        setStartDate(date)
        setEventTime(String(date).substr(16, 5))
    }

    const clearForm = () => { setFullName(''); setEmail('test@gmail.com'); setPhoneNumber(''); setAddress('') }

    const setSelectedCustomerDetails = ({ selectedCustomer, selectedPhoneNumber, selectedAddress }) => {
        setFullName(selectedCustomer)
        setPhoneNumber(selectedPhoneNumber)
        setAddress(selectedAddress)
    }

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            bgcolor: 'rgba(255,255,255,0.75)',
            fontSize: '1.05rem',
            '&:hover fieldset': { borderColor: '#C9A227' },
            '&.Mui-focused fieldset': { borderColor: '#C9A227' },
        },
        '& label': { fontSize: '1rem' },
        '& label.Mui-focused': { color: '#7a6010' },
        '& .MuiFormHelperText-root': { fontSize: '0.85rem' },
    }

    const goldBtn = {
        bgcolor: '#C9A227', color: '#000', fontWeight: 700,
        '&:hover': { bgcolor: '#e8c84d' },
    }

    return (
        <Box id="request-div" sx={{ minHeight: '100vh', py: 4, px: { xs: 1, sm: 3 } }}>
            <Box sx={{ maxWidth: 720, mx: 'auto' }}>

                {/* Back button */}
                <Link to="/menu" className="form-back-link">
                    <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2, color: '#5d522c', fontWeight: 600 }}>
                        Back to Menu
                    </Button>
                </Link>

                <Paper elevation={4} sx={{
                    borderRadius: '20px',
                    border: '2px solid #C9A227',
                    overflow: 'hidden',
                }}>
                    {/* Header */}
                    <Box sx={{ bgcolor: '#C9A227', py: 2.5, px: 3, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: '#3d2e00', letterSpacing: 0.5 }}>
                            Add Your Event Details
                        </Typography>
                    </Box>

                    <Box sx={{ p: { xs: 2, sm: 3 } }}>

                        {/* Admin: customer selector */}
                        {userType === 'Admin' && (
                            <Box sx={{
                                mb: 3, p: 2,
                                bgcolor: 'rgba(201,162,39,0.08)',
                                border: '1px solid rgba(201,162,39,0.3)',
                                borderRadius: '12px',
                            }}>
                                <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#5d522c' }}>
                                    Select Customer Details
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                                    <CustomerModal
                                        setSelectedCustomerDetails={setSelectedCustomerDetails}
                                        customers={customers}
                                        buttonLabel={`Select from ${customers.length} Customers`}
                                    />
                                    <Button variant="outlined" size="small" onClick={clearForm}
                                        sx={{ borderColor: '#C9A227', color: '#7a6010', fontWeight: 600 }}>
                                        Clear Form
                                    </Button>
                                </Box>
                            </Box>
                        )}

                        {/* Personal Details */}
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#5d522c', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.72rem' }}>
                            Personal Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={12}>
                                <TextField
                                    fullWidth label="Full Name" value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    error={!!nameError} helperText={nameError}
                                    sx={inputSx} size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="Email" type="email" value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    error={!!emailError} helperText={emailError}
                                    sx={inputSx} size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="Phone Number" value={phoneNumber}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                    error={!!phoneNumberError} helperText={phoneNumberError}
                                    slotProps={{ htmlInput: { maxLength: 10 } }}
                                    sx={inputSx} size="small"
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth multiline rows={4} label="Address" value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    error={!!addressError} helperText={addressError}
                                    sx={inputSx}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2.5 }} />

                        {/* Event Details */}
                        <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 700, color: '#5d522c', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.72rem' }}>
                            Event Details
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="Event Name" value={eventName}
                                    onChange={e => setEventName(e.target.value)}
                                    sx={inputSx} size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth label="Number of People" type="number" value={numberOfPeople}
                                    onChange={e => setNumberOfPeople(e.target.value)}
                                    error={!!noOfPeopleError} helperText={noOfPeopleError}
                                    sx={inputSx} size="small"
                                />
                            </Grid>
                            <Grid size={12}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        label="Event Date & Time"
                                        value={startDate}
                                        onChange={handleDateChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                size: 'small',
                                                sx: inputSx,
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    fullWidth multiline rows={3} label="Additional Notes / Queries"
                                    value={queries} onChange={e => setQuerries(e.target.value)}
                                    sx={inputSx}
                                />
                            </Grid>
                        </Grid>

                        <Divider sx={{ my: 2.5 }} />

                        {/* Options */}
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#5d522c', textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.72rem' }}>
                            Options
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={homeDelivery}
                                        onChange={() => {
                                            const next = !homeDelivery
                                            setHomeDelivery(next)
                                            if (next) {
                                                setShowTransportForm(true)
                                            } else {
                                                setShowTransportForm(false)
                                                setTransport({ medium: '', rate: '' })
                                            }
                                        }}
                                        sx={{ color: '#C9A227', '&.Mui-checked': { color: '#C9A227' } }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocalShippingIcon fontSize="small" sx={{ color: '#7a6010' }} />
                                        <span className="form-label-bold">Home Delivery</span>
                                        <HDToolTip />
                                    </Box>
                                }
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={service}
                                        onChange={() => setService(!service)}
                                        sx={{ color: '#C9A227', '&.Mui-checked': { color: '#C9A227' } }}
                                    />
                                }
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <RoomServiceIcon fontSize="small" sx={{ color: '#7a6010' }} />
                                        <span className="form-label-bold">Service</span>
                                        <ServiceToolTip />
                                    </Box>
                                }
                            />
                        </Box>

                        {/* Transport Form — shown when homeDelivery is checked */}
                        {homeDelivery && (
                            <Box sx={{ mb: 2 }}>
                                {showTransportForm ? (
                                    <Box sx={{ position: 'relative' }}>
                                    <IconButton size="small" onClick={() => setShowTransportForm(false)}
                                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: '#888', '&:hover': { color: '#ef4444' } }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                    <TransportForm
                                        medium={transport.medium}
                                        price={transport.rate}
                                        ShowTransportTable={(medium, rate) => {
                                            setTransport({ medium, rate })
                                            setShowTransportForm(false)
                                        }}
                                        ShowTransportForm={() => setShowTransportForm(false)}
                                    />
                                    </Box>
                                ) : (
                                    <Box sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                                        bgcolor: 'rgba(201,162,39,0.08)', borderRadius: '10px',
                                        border: '1px solid rgba(201,162,39,0.25)',
                                    }}>
                                        <LocalShippingIcon fontSize="small" sx={{ color: '#7a6010' }} />
                                        {transport.medium ? (
                                            <>
                                                <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
                                                    {transport.medium} — <strong>₹{transport.rate}</strong>
                                                </Typography>
                                                <Button size="small" onClick={() => setShowTransportForm(true)}
                                                    sx={{ color: '#7a6010', fontWeight: 600 }}>Edit</Button>
                                            </>
                                        ) : (
                                            <Button size="small" onClick={() => setShowTransportForm(true)} sx={goldBtn}>
                                                Add Transport Details
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Advance Payment */}
                        <Box sx={{ mb: 2 }}>
                            {showAdvanceForm ? (
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton size="small" onClick={() => setShowAdvanceForm(false)}
                                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: '#888', '&:hover': { color: '#ef4444' } }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                    <AdvancePaymentForm
                                        advanceAmount={advanceAmount}
                                        ShowAdvancePaymentTable={(amount) => {
                                            setAdvanceAmount(amount)
                                            setShowAdvanceForm(false)
                                        }}
                                        ShowAdvancePaymentForm={() => setShowAdvanceForm(false)}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                                    bgcolor: 'rgba(201,162,39,0.08)', borderRadius: '10px',
                                    border: '1px solid rgba(201,162,39,0.25)',
                                }}>
                                    <PaymentsIcon fontSize="small" sx={{ color: '#7a6010' }} />
                                    {advanceAmount ? (
                                        <>
                                            <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
                                                Advance: <strong>₹{advanceAmount}</strong>
                                            </Typography>
                                            <Button size="small" onClick={() => setShowAdvanceForm(true)}
                                                sx={{ color: '#7a6010', fontWeight: 600 }}>Edit</Button>
                                            <IconButton size="small" onClick={() => setAdvanceAmount('')}
                                                sx={{ color: '#888', '&:hover': { color: '#ef4444' } }}>
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <Button size="small" onClick={() => setShowAdvanceForm(true)} sx={goldBtn}>
                                            Add Advance Payment
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>

                        {/* Misc Items */}
                        <Box sx={{ mb: 3 }}>
                            {showMiscForm ? (
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton size="small" onClick={() => setShowMiscForm(false)}
                                        sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: '#888', '&:hover': { color: '#ef4444' } }}>
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                    <MiscForm
                                        miscItems={miscItems}
                                        setMiscParticulars={setMiscItems}
                                        handleMiscSubmit={(e) => { e.preventDefault(); setShowMiscForm(false) }}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{
                                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
                                    bgcolor: 'rgba(201,162,39,0.08)', borderRadius: '10px',
                                    border: '1px solid rgba(201,162,39,0.25)',
                                }}>
                                    <ReceiptLongIcon fontSize="small" sx={{ color: '#7a6010' }} />
                                    {miscItems.length > 0 ? (
                                        <>
                                            <Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
                                                {miscItems.length} misc item(s) added
                                                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                                    {miscItems.map((m, i) => (
                                                        <Chip key={i} label={`${m.particular}: ₹${m.rate}`} size="small"
                                                            sx={{ fontSize: '0.7rem', bgcolor: 'rgba(201,162,39,0.2)' }} />
                                                    ))}
                                                </Box>
                                            </Typography>
                                            <Button size="small" onClick={() => setShowMiscForm(true)}
                                                sx={{ color: '#7a6010', fontWeight: 600, alignSelf: 'flex-start' }}>Edit</Button>
                                        </>
                                    ) : (
                                        <Button size="small" onClick={() => { setShowMiscForm(true); setMiscItems([{ particular: '', rate: '' }]) }} sx={goldBtn}>
                                            Add Misc Items
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </Box>

                        {/* Submit */}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            sx={{
                                bgcolor: '#ff8300', color: '#fff', fontWeight: 800,
                                fontSize: '1.1rem', py: 1.5, borderRadius: '12px',
                                '&:hover': { bgcolor: '#e07200' },
                            }}
                        >
                            Submit Enquiry
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <SubmitEnquiryModal
                isOpen={props.openSubmitEnquiryModal}
                closeModal={() => {
                    setOpenSubmitEnquiryModal(false)
                    window.location.href = '/menu'
                }}
            />
        </Box>
    )
}

export default CustomerForm
