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
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import RoomServiceIcon from '@mui/icons-material/RoomService'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

import HDToolTip from './HDToolTip.js'
import ServiceToolTip from './ServiceToolTip.js'
import { useAppTheme } from '../../context/ThemeContext'

const GOLD = '#C9A227'

const sectionLabel = {
    color: 'rgba(201,162,39,0.45)',
    fontSize: '0.6rem',
    fontWeight: 800,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    mb: 1.5,
}

const CustomerForm = (props) => {
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'

    const BG      = isDark ? '#0f0e0b' : '#FDFAF4'
    const CARD_BG = isDark ? '#1a1800' : '#ffffff'
    const BORDER  = isDark ? 'rgba(201,162,39,0.18)' : 'rgba(201,162,39,0.25)'

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)',
            borderRadius: '7px',
            fontSize: '0.82rem',
            color: isDark ? '#fff' : '#1a1400',
            '& fieldset': { borderColor: BORDER },
            '&:hover fieldset': { borderColor: 'rgba(201,162,39,0.45)' },
            '&.Mui-focused fieldset': { borderColor: GOLD },
        },
        '& label': { fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.5)' },
        '& label.Mui-focused': { color: GOLD },
        '& label.MuiFormLabel-filled': { color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.65)' },
        '& .MuiFormHelperText-root': { fontSize: '0.7rem', color: '#ef4444' },
    }

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

        if (fullName.length < 5) nameError = 'Min 5 characters'
        if (specialChars.some(c => fullName.includes(c))) nameError = 'No special characters'
        if (digits.some(d => fullName.includes(d))) nameError = 'No numbers in name'
        if (email.length < 5) emailError = 'Min 5 characters'
        if (!email.includes('@')) emailError = 'Must contain @'
        if (phoneNumber.toString().length !== 10) phoneNumberError = 'Must be 10 digits'
        if (!digits.some(d => numberOfPeople.toString().includes(d))) noOfPeopleError = 'Must be a number'
        if (address.length === 0) addressError = 'Required'

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
        const hh = String(date.getHours()).padStart(2, '0')
        const mm = String(date.getMinutes()).padStart(2, '0')
        setEventTime(`${hh}:${mm}`)
    }

    const clearForm = () => { setFullName(''); setEmail('test@gmail.com'); setPhoneNumber(''); setAddress('') }

    const setSelectedCustomerDetails = ({ selectedCustomer, selectedPhoneNumber, selectedAddress }) => {
        setFullName(selectedCustomer)
        setPhoneNumber(selectedPhoneNumber)
        setAddress(selectedAddress)
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ bgcolor: BG, minHeight: '100vh', py: 3, px: { xs: 1.5, sm: 2, md: 3 } }}>
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>

                {/* Back */}
                <Link to="/menu" className="form-back-link">
                    <Button
                        startIcon={<ArrowBackIcon sx={{ fontSize: '0.9rem !important' }} />}
                        sx={{
                            mb: 2, color: 'rgba(201,162,39,0.6)', fontSize: '0.75rem',
                            '&:hover': { color: GOLD, bgcolor: 'rgba(201,162,39,0.06)' },
                        }}
                    >
                        Back to Menu
                    </Button>
                </Link>

                {/* Page title */}
                <Box sx={{ mb: 2.5, display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>
                        Event Details
                    </Typography>
                    {editingOrder && (
                        <Chip
                            label="Editing order"
                            size="small"
                            sx={{ bgcolor: 'rgba(201,162,39,0.12)', color: GOLD, fontSize: '0.65rem', fontWeight: 700, height: 20 }}
                        />
                    )}
                </Box>

                <Grid container spacing={2}>

                    {/* LEFT COLUMN */}
                    <Grid size={{ xs: 12, md: 7 }}>

                        {/* Admin customer selector */}
                        {userType === 'Admin' && (
                            <Box sx={{
                                mb: 2, p: 1.5,
                                bgcolor: CARD_BG,
                                border: `1px solid ${BORDER}`,
                                borderRadius: '10px',
                            }}>
                                <Typography sx={sectionLabel}>Customer</Typography>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    <CustomerModal
                                        setSelectedCustomerDetails={setSelectedCustomerDetails}
                                        customers={customers}
                                        buttonLabel={`Select from ${customers.length}`}
                                    />
                                    <Button
                                        size="small"
                                        onClick={clearForm}
                                        sx={{
                                            color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem',
                                            border: `1px solid rgba(255,255,255,0.1)`,
                                            borderRadius: '6px',
                                            '&:hover': { color: '#fff', borderColor: 'rgba(255,255,255,0.25)' },
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </Stack>
                            </Box>
                        )}

                        {/* Personal details */}
                        <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography sx={sectionLabel}>Personal Details</Typography>
                            <Grid container spacing={1.5}>
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
                                        fullWidth label="Phone" value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        error={!!phoneNumberError} helperText={phoneNumberError}
                                        slotProps={{ htmlInput: { maxLength: 10 } }}
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
                                <Grid size={12}>
                                    <TextField
                                        fullWidth multiline rows={2} label="Address" value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        error={!!addressError} helperText={addressError}
                                        sx={inputSx}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Event details */}
                        <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography sx={sectionLabel}>Event Details</Typography>
                            <Grid container spacing={1.5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth label="Event Name" value={eventName}
                                        onChange={e => setEventName(e.target.value)}
                                        sx={inputSx} size="small"
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField
                                        fullWidth label="No. of People" type="number" value={numberOfPeople}
                                        onChange={e => setNumberOfPeople(e.target.value)}
                                        error={!!noOfPeopleError} helperText={noOfPeopleError}
                                        sx={inputSx} size="small"
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <DateTimePicker
                                        label="Event Date & Time"
                                        value={startDate}
                                        onChange={handleDateChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                size: 'small',
                                                sx: {
                                                    ...inputSx,
                                                    '& .MuiSvgIcon-root': { color: 'rgba(201,162,39,0.5)', fontSize: '1rem' },
                                                },
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <TextField
                                        fullWidth multiline rows={2} label="Notes / Queries"
                                        value={queries} onChange={e => setQuerries(e.target.value)}
                                        sx={inputSx}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* RIGHT COLUMN */}
                    <Grid size={{ xs: 12, md: 5 }}>

                        {/* Options */}
                        <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography sx={sectionLabel}>Options</Typography>
                            <Stack spacing={0.5}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={homeDelivery}
                                            onChange={() => {
                                                const next = !homeDelivery
                                                setHomeDelivery(next)
                                                if (next) setShowTransportForm(true)
                                                else { setShowTransportForm(false); setTransport({ medium: '', rate: '' }) }
                                            }}
                                            size="small"
                                            sx={{ color: BORDER, '&.Mui-checked': { color: GOLD }, p: 0.75 }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocalShippingIcon sx={{ fontSize: '0.9rem', color: 'rgba(201,162,39,0.5)' }} />
                                            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                                                Home Delivery
                                            </Typography>
                                            <HDToolTip />
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={service}
                                            onChange={() => setService(!service)}
                                            size="small"
                                            sx={{ color: BORDER, '&.Mui-checked': { color: GOLD }, p: 0.75 }}
                                        />
                                    }
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <RoomServiceIcon sx={{ fontSize: '0.9rem', color: 'rgba(201,162,39,0.5)' }} />
                                            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                                                Service
                                            </Typography>
                                            <ServiceToolTip />
                                        </Box>
                                    }
                                />
                            </Stack>
                        </Box>

                        {/* Transport */}
                        {homeDelivery && (
                            <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', p: 2, mb: 2 }}>
                                <Typography sx={sectionLabel}>Transport</Typography>
                                {showTransportForm ? (
                                    <Box sx={{ position: 'relative' }}>
                                        <IconButton size="small" onClick={() => setShowTransportForm(false)}
                                            sx={{ position: 'absolute', top: -4, right: -4, color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ef4444' } }}>
                                            <CloseIcon sx={{ fontSize: '0.9rem' }} />
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
                                ) : transport.medium ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <LocalShippingIcon sx={{ fontSize: '0.9rem', color: GOLD }} />
                                        <Typography sx={{ flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600 }}>
                                            {transport.medium} · <span style={{ color: GOLD }}>₹{transport.rate}</span>
                                        </Typography>
                                        <IconButton size="small" onClick={() => setShowTransportForm(true)}
                                            sx={{ color: 'rgba(201,162,39,0.5)', '&:hover': { color: GOLD } }}>
                                            <EditIcon sx={{ fontSize: '0.85rem' }} />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Button size="small" onClick={() => setShowTransportForm(true)}
                                        sx={{ color: GOLD, border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(201,162,39,0.07)' } }}>
                                        + Add Transport
                                    </Button>
                                )}
                            </Box>
                        )}

                        {/* Advance payment */}
                        <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography sx={sectionLabel}>Advance Payment</Typography>
                            {showAdvanceForm ? (
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton size="small" onClick={() => setShowAdvanceForm(false)}
                                        sx={{ position: 'absolute', top: -4, right: -4, color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ef4444' } }}>
                                        <CloseIcon sx={{ fontSize: '0.9rem' }} />
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
                            ) : advanceAmount ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PaymentsIcon sx={{ fontSize: '0.9rem', color: GOLD }} />
                                    <Typography sx={{ flex: 1, color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 600 }}>
                                        <span style={{ color: GOLD }}>₹{advanceAmount}</span> advance
                                    </Typography>
                                    <IconButton size="small" onClick={() => setShowAdvanceForm(true)}
                                        sx={{ color: 'rgba(201,162,39,0.5)', '&:hover': { color: GOLD } }}>
                                        <EditIcon sx={{ fontSize: '0.85rem' }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={() => setAdvanceAmount('')}
                                        sx={{ color: 'rgba(255,255,255,0.25)', '&:hover': { color: '#ef4444' } }}>
                                        <CloseIcon sx={{ fontSize: '0.85rem' }} />
                                    </IconButton>
                                </Box>
                            ) : (
                                <Button size="small" onClick={() => setShowAdvanceForm(true)}
                                    sx={{ color: GOLD, border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(201,162,39,0.07)' } }}>
                                    + Add Advance
                                </Button>
                            )}
                        </Box>

                        {/* Misc items */}
                        <Box sx={{ bgcolor: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: '10px', p: 2, mb: 2 }}>
                            <Typography sx={sectionLabel}>Misc Items</Typography>
                            {showMiscForm ? (
                                <Box sx={{ position: 'relative' }}>
                                    <IconButton size="small" onClick={() => setShowMiscForm(false)}
                                        sx={{ position: 'absolute', top: -4, right: -4, color: 'rgba(255,255,255,0.3)', '&:hover': { color: '#ef4444' } }}>
                                        <CloseIcon sx={{ fontSize: '0.9rem' }} />
                                    </IconButton>
                                    <MiscForm
                                        miscItems={miscItems}
                                        setMiscParticulars={setMiscItems}
                                        handleMiscSubmit={(e) => { e.preventDefault(); setShowMiscForm(false) }}
                                    />
                                </Box>
                            ) : miscItems.length > 0 ? (
                                <Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 0.75 }}>
                                        {miscItems.map((m, i) => (
                                            <Chip key={i} label={`${m.particular}: ₹${m.rate}`} size="small"
                                                sx={{ fontSize: '0.65rem', bgcolor: 'rgba(201,162,39,0.1)', color: GOLD, height: 20 }} />
                                        ))}
                                    </Box>
                                    <Button size="small" onClick={() => setShowMiscForm(true)}
                                        sx={{ color: 'rgba(201,162,39,0.6)', fontSize: '0.72rem', '&:hover': { color: GOLD } }}>
                                        Edit misc
                                    </Button>
                                </Box>
                            ) : (
                                <Button size="small" onClick={() => { setShowMiscForm(true); setMiscItems([{ particular: '', rate: '' }]) }}
                                    sx={{ color: GOLD, border: `1px solid ${BORDER}`, borderRadius: '6px', fontSize: '0.75rem', '&:hover': { bgcolor: 'rgba(201,162,39,0.07)' } }}>
                                    + Add Misc Items
                                </Button>
                            )}
                        </Box>

                        {/* Submit */}
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                bgcolor: GOLD,
                                color: '#1a1400',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                py: 1.25,
                                borderRadius: '10px',
                                letterSpacing: 0.5,
                                '&:hover': { bgcolor: '#e8c84d' },
                            }}
                        >
                            {editingOrder ? 'Update Order' : 'Submit Enquiry'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <SubmitEnquiryModal
                isOpen={props.openSubmitEnquiryModal}
                closeModal={() => {
                    setOpenSubmitEnquiryModal(false)
                    window.location.href = '/menu'
                }}
            />
        </Box>
        </LocalizationProvider>
    )
}

export default CustomerForm
