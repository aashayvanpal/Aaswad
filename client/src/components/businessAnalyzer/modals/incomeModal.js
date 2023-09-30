import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const IncomeModal = (props) => {
    const {
        buttonLabel,
        className,
        incomeItems,
        setIncomeItems,
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
    const addIncome = () => {
        const income = { particular, amount: Number(amount) }
        const newIncomeItems = [...incomeItems, income]
        setIncomeItems(newIncomeItems)
        let business = JSON.parse(localStorage.getItem('business'))
        if (business && business.expense) {
            business = { income: newIncomeItems, expense: business.expense }
        } else {
            business = { income: newIncomeItems, expense: [] }
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
                    Add Income Details
                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "20px" }} >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        Particular <input value={particular} onChange={(e) => setParticular(e.target.value)} style={{ width: '248px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        Amount <input value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: '248px' }} />

                    </div>

                </ModalBody>
                <ModalFooter style={{ backgroundColor: '#fff5d2', display: 'flex', gap: '280px' }}>

                    <button style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={cancelModal}>Cancel</button>
                    <button style={{ backgroundColor: 'rgb(219, 194, 104)' }} onClick={(e) => addIncome()}>Add Income</button>

                </ModalFooter>

            </Modal >
        </div >
    );
}

export default IncomeModal;