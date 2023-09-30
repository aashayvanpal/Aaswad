import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ExpenseModal = (props) => {
    const {
        buttonLabel,
        className,
        expenseItems,
        setExpenseItems,
        refresh,
        setRefresh,
        resetIsSelected,
        requestOrder,
        userType,
        report = [], //default set to array

    } = props;

    const [modal, setModal] = useState(false);
    const [particular, setParticular] = useState('');
    const [amount, setAmount] = useState(null);

    const toggle = () => setModal(!modal);

    const cancelModal = () => {
        toggle()
    }
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
        <div >
            <Button style={{
                "backgroundColor": "#dbc268",
                "color": "black",
                "fontSize": "22px"
            }} onClick={toggle}>
                {buttonLabel}

            </Button>
            <Modal isOpen={modal} toggle={toggle} className={className} >
                <ModalHeader style={{ "backgroundColor": "#ebc642" }} toggle={toggle}>
                    Add Expense Details
                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "20px" }} >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        Particular <input value={particular} onChange={(e) => setParticular(e.target.value)} style={{ width: '248px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Amount <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '248px' }} />

                    </div>

                </ModalBody>
                <ModalFooter style={{ backgroundColor: '#fff5d2', display: 'flex', gap: '275px' }}>

                    <button style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={cancelModal}>Cancel</button>
                    <button style={{ backgroundColor: 'rgb(219, 194, 104)' }} onClick={(e) => addExpense()}>Add Expense</button>

                </ModalFooter>

            </Modal >
        </div >
    );
}

export default ExpenseModal;