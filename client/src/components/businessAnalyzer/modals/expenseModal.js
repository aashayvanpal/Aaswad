import { useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'

const FS = '2.5rem'

const ExpenseModal = ({ expenseItems, setExpenseItems }) => {
    const [open, setOpen] = useState(false)
    const [particular, setParticular] = useState('')
    const [amount, setAmount] = useState('')

    const handleOpen = () => setOpen(true)

    const handleClose = () => {
        setOpen(false)
        setParticular('')
        setAmount('')
    }

    const addExpense = () => {
        if (!particular.trim() || !amount) return
        setExpenseItems([...expenseItems, { particular: particular.trim(), amount: Number(amount) }])
        handleClose()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') addExpense()
    }

    return (
        <>
            <Button
                variant="contained"
                color="error"
                startIcon={<AddIcon sx={{ fontSize: '2rem !important' }} />}
                onClick={handleOpen}
                sx={{ fontSize: FS }}
            >
                Add Expense
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontSize: FS, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Add Expense
                    <IconButton onClick={handleClose}>
                        <CloseIcon sx={{ fontSize: '2rem' }} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: '16px !important' }}>
                    <TextField
                        label="Particular"
                        value={particular}
                        onChange={(e) => setParticular(e.target.value)}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        autoFocus
                        sx={{
                            '& .MuiInputBase-input': { fontSize: FS },
                            '& .MuiInputLabel-root': { fontSize: FS },
                            '& .MuiInputLabel-shrink': { fontSize: FS },
                        }}
                    />
                    <TextField
                        label="Amount (₹)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onKeyDown={handleKeyDown}
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                        sx={{
                            '& .MuiInputBase-input': { fontSize: FS },
                            '& .MuiInputLabel-root': { fontSize: FS },
                            '& .MuiInputLabel-shrink': { fontSize: FS },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={handleClose} color="inherit" sx={{ fontSize: FS }}>Cancel</Button>
                    <Button
                        onClick={addExpense}
                        variant="contained"
                        color="error"
                        disabled={!particular.trim() || !amount}
                        sx={{ fontSize: FS }}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ExpenseModal
