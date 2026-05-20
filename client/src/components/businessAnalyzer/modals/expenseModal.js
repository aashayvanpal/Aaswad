import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ExpenseModal = (props) => {
    const {
        buttonLabel,
        className,
        expenseItems,
        setExpenseItems,
        refresh,
        setRefresh,
    } = props;

    const [modal, setModal] = useState(false);
    const [particular, setParticular] = useState('');
    const [amount, setAmount] = useState(null);

    const toggle = () => setModal(!modal);

    const addExpense = () => {
        const expense = { particular, amount: Number(amount) }
        const newExpenseItem = [...expenseItems, expense]
        setExpenseItems(newExpenseItem)
        let business = JSON.parse(localStorage.getItem('business'))
        if (business && business.income) {
            business = { income: business.income, expense: newExpenseItem }
        } else {
            business = { income: [], expense: newExpenseItem }
        }
        localStorage.setItem('business', JSON.stringify(business))
        toggle()
    }

    return (
        <div>
            <Button
                variant="contained"
                style={{ backgroundColor: '#dbc268', color: 'black', fontSize: '22px' }}
                onClick={toggle}
            >
                {buttonLabel}
            </Button>
            <Dialog open={modal} onClose={toggle} className={className} fullWidth maxWidth="sm">
                <DialogTitle style={{ backgroundColor: '#ebc642', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Add Expense Details
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent style={{ backgroundColor: '#fff5d2', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        Particular <input value={particular} onChange={(e) => setParticular(e.target.value)} style={{ width: '248px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Amount <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '248px' }} />
                    </div>
                </DialogContent>
                <DialogActions style={{ backgroundColor: '#fff5d2', display: 'flex', gap: '275px' }}>
                    <button style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={toggle}>Cancel</button>
                    <button style={{ backgroundColor: 'rgb(219, 194, 104)' }} onClick={addExpense}>Add Expense</button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ExpenseModal;
