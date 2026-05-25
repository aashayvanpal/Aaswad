import React, { useState } from 'react'
import { useAppTheme } from '../../../context/ThemeContext'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import HomeIcon from '@mui/icons-material/Home'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const CustomerModal = ({ buttonLabel, customers, setSelectedCustomerDetails }) => {
    const { themeMode } = useAppTheme()
    const isDark = themeMode === 'dark'
    const MODAL_BG   = isDark ? '#1a1800' : '#fffbee'
    const CARD_BG    = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'
    const BORDER     = isDark ? 'rgba(201,162,39,0.25)' : 'rgba(201,162,39,0.25)'
    const TEXT       = isDark ? 'rgba(255,255,255,0.87)' : '#1a1400'
    const TEXT_MED   = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'
    const LABEL_COLOR = isDark ? 'rgba(201,162,39,0.7)' : '#7a6010'

    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const [selectedPhone, setSelectedPhone] = useState('')
    const [selectedAddress, setSelectedAddress] = useState('')

    const toggle = () => {
        setOpen(!open)
        if (open) {
            setFilter('')
            setSelectedCustomer(null)
            setSelectedPhone('')
            setSelectedAddress('')
        }
    }

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer)
        setSelectedPhone(customer.phoneNumber[0][Object.keys(customer.phoneNumber[0])[0]])
        setSelectedAddress(customer.address[0][Object.keys(customer.address[0])[0]])
    }

    const handleConfirm = () => {
        if (!selectedCustomer) return
        setSelectedCustomerDetails({
            selectedCustomer: selectedCustomer.fullName,
            selectedPhoneNumber: selectedPhone,
            selectedAddress,
        })
        toggle()
    }

    const filtered = customers.filter(c =>
        c.fullName.toLowerCase().includes(filter.toLowerCase())
    )

    const initials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

    const avatarColor = (name) => {
        const colors = ['#C9A227', '#5d9b7e', '#7d6bb0', '#c05c7e', '#3d7bbf']
        return colors[name.charCodeAt(0) % colors.length]
    }

    return (
        <>
            <Button
                variant="contained"
                onClick={toggle}
                startIcon={<PeopleAltIcon />}
                sx={{
                    bgcolor: '#C9A227', color: '#000', fontWeight: 700,
                    fontSize: '0.95rem', borderRadius: '10px', px: 2.5,
                    '&:hover': { bgcolor: '#e8c84d' },
                }}
            >
                {buttonLabel}
            </Button>

            <Dialog
                open={open}
                onClose={toggle}
                fullWidth
                maxWidth="md"
                slotProps={{ paper: { sx: { borderRadius: '20px', overflow: 'hidden', minHeight: '70vh' } } }}
            >
                <DialogTitle sx={{
                    bgcolor: '#C9A227', color: '#000', fontWeight: 800,
                    fontSize: '1.2rem', py: 2, px: 3,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PeopleAltIcon />
                        Select Customer Details
                        <Chip label={`${customers.length} customers`} size="small"
                            sx={{ bgcolor: 'rgba(0,0,0,0.15)', fontWeight: 700, fontSize: '0.78rem' }} />
                    </Box>
                    <IconButton onClick={toggle} sx={{ color: '#000' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ bgcolor: MODAL_BG, p: 0, display: 'flex', flexDirection: 'column' }}>
                    {/* Search bar */}
                    <Box sx={{ px: 3, pt: 2.5, pb: 1.5, bgcolor: 'rgba(201,162,39,0.08)', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
                        <TextField
                            fullWidth
                            placeholder="Search customer by name…"
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            size="small"
                            autoFocus
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#fff', fontSize: '1rem', borderRadius: '10px',
                                    '&:hover fieldset': { borderColor: '#C9A227' },
                                    '&.Mui-focused fieldset': { borderColor: '#C9A227' },
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
                        {/* Customer list */}
                        <Box sx={{ width: selectedCustomer ? '40%' : '100%', overflowY: 'auto', borderRight: selectedCustomer ? '1px solid rgba(201,162,39,0.2)' : 'none' }}>
                            {filtered.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 6, color: '#888' }}>
                                    <PersonIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
                                    <Typography>No customers found</Typography>
                                </Box>
                            ) : filtered.map((customer, i) => (
                                <Box
                                    key={i}
                                    onClick={() => handleSelectCustomer(customer)}
                                    sx={{
                                        display: 'flex', alignItems: 'center', gap: 1.5,
                                        px: 2.5, py: 1.5, cursor: 'pointer',
                                        bgcolor: selectedCustomer?.fullName === customer.fullName ? 'rgba(201,162,39,0.15)' : 'transparent',
                                        borderLeft: selectedCustomer?.fullName === customer.fullName ? '3px solid #C9A227' : '3px solid transparent',
                                        '&:hover': { bgcolor: 'rgba(201,162,39,0.08)' },
                                        transition: 'all 0.15s',
                                    }}
                                >
                                    <Avatar sx={{ bgcolor: avatarColor(customer.fullName), fontWeight: 700, width: 40, height: 40, fontSize: '0.9rem' }}>
                                        {initials(customer.fullName)}
                                    </Avatar>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {customer.fullName}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#888' }}>
                                            {customer.phoneNumber.length} phone · {customer.address.length} address
                                        </Typography>
                                    </Box>
                                    {selectedCustomer?.fullName === customer.fullName && (
                                        <CheckCircleIcon sx={{ color: '#C9A227', fontSize: 20 }} />
                                    )}
                                </Box>
                            ))}
                        </Box>

                        {/* Detail panel */}
                        {selectedCustomer && (
                            <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: avatarColor(selectedCustomer.fullName), width: 48, height: 48, fontWeight: 700 }}>
                                        {initials(selectedCustomer.fullName)}
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: TEXT }}>{selectedCustomer.fullName}</Typography>
                                        <Typography variant="caption" sx={{ color: TEXT_MED }}>{selectedCustomer.email}</Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* Phone numbers */}
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                        <PhoneIcon fontSize="small" sx={{ color: LABEL_COLOR }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: LABEL_COLOR }}>Phone Numbers</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {selectedCustomer.phoneNumber.map((numObj, i) => {
                                            const key = Object.keys(numObj)[0]
                                            const val = numObj[key]
                                            const isSelected = selectedPhone === val
                                            return (
                                                <Box
                                                    key={i}
                                                    onClick={() => setSelectedPhone(val)}
                                                    sx={{
                                                        p: 1.5, borderRadius: '10px', cursor: 'pointer',
                                                        border: isSelected ? '2px solid #C9A227' : `2px solid ${BORDER}`,
                                                        bgcolor: isSelected ? 'rgba(201,162,39,0.12)' : CARD_BG,
                                                        '&:hover': { bgcolor: 'rgba(201,162,39,0.08)' },
                                                        transition: 'all 0.15s',
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: LABEL_COLOR, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            {key}
                                                        </Typography>
                                                        {isSelected && <CheckCircleIcon sx={{ color: '#C9A227', fontSize: 16 }} />}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mt: 0.3, fontSize: '0.9rem', color: TEXT }}>{val}</Typography>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                </Box>

                                {/* Addresses */}
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                        <HomeIcon fontSize="small" sx={{ color: LABEL_COLOR }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: LABEL_COLOR }}>Addresses</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        {selectedCustomer.address.map((addrObj, i) => {
                                            const key = Object.keys(addrObj)[0]
                                            const val = addrObj[key]
                                            const isSelected = selectedAddress === val
                                            return (
                                                <Box
                                                    key={i}
                                                    onClick={() => setSelectedAddress(val)}
                                                    sx={{
                                                        p: 1.5, borderRadius: '10px', cursor: 'pointer',
                                                        border: isSelected ? '2px solid #C9A227' : '2px solid rgba(201,162,39,0.25)',
                                                        bgcolor: isSelected ? 'rgba(201,162,39,0.12)' : CARD_BG,
                                                        '&:hover': { bgcolor: 'rgba(201,162,39,0.08)' },
                                                    }}
                                                >
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: LABEL_COLOR, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                            {key}
                                                        </Typography>
                                                        {isSelected && <CheckCircleIcon sx={{ color: '#C9A227', fontSize: 16 }} />}
                                                    </Box>
                                                    <Typography variant="body2" sx={{ mt: 0.3, fontSize: '0.9rem', color: TEXT }}>{val}</Typography>
                                                </Box>
                                            )
                                        })}
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>

                <DialogActions sx={{ bgcolor: MODAL_BG, px: 3, py: 2, borderTop: '1px solid rgba(201,162,39,0.2)' }}>
                    <Button onClick={toggle} sx={{ color: TEXT_MED, fontWeight: 600 }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={!selectedCustomer || !selectedPhone || !selectedAddress}
                        sx={{
                            bgcolor: '#C9A227', color: '#000', fontWeight: 700,
                            borderRadius: '10px', px: 3,
                            '&:hover': { bgcolor: '#e8c84d' },
                            '&.Mui-disabled': { bgcolor: 'rgba(201,162,39,0.3)' },
                        }}
                    >
                        Confirm Customer
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CustomerModal
