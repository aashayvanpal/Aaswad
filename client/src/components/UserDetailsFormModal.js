import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import axios from '../config/axios.js'
import './UserDetailsFormModal.scss'
import { reduceOrders } from './order/orderHelper.js';

const UserDetailsFormModal = (props) => {
    const {
        buttonLabel,
        className,
        userType,
        orderDates
    } = props;

    const [modal, setModal] = useState(false);
    const [name, setName] = useState('')
    const [customerId, setCustomerId] = useState('')
    const [email, setEmail] = useState('')
    const [phonenumber, setPhonenumber] = useState('')
    const [address, setAddress] = useState('')

    useEffect(() => {
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log('user data :', dataRequest)
                setCustomerId(dataRequest.data.id)
                setName(dataRequest.data.username)
                setEmail(dataRequest.data.email)
                setPhonenumber(dataRequest.data.phonenumber)
                setAddress(dataRequest.data.address)
            })
            .catch(err => console.log(err))
    }, [])

    const toggle = () => setModal(!modal);

    const orderSubmit = (e) => {
        e.preventDefault()
        console.log('inside orderSubmit')

        reduceOrders(orderDates)

        console.log('calculating amount and total amount ')

        let amounts = []
        for (let index in orderDates) {
            for (let date in orderDates[index]) {
                for (let orderType in orderDates[index][date]) {
                    amounts.push(orderDates[index][date][orderType].amount)
                }
            }
        }

        console.log('amounts with undefined', amounts)
        console.log('DEBUG orderDates', orderDates)

        amounts = amounts.filter((element) => { return element !== undefined }).reduce((acc, sum) => { return sum += acc })

        console.log('amounts final debug', amounts)

        const order = {
            customer: { customer_id: customerId, fullName: name, email, phoneNumber: phonenumber, address },
            orderDates,
            total: amounts,
            status: 'approve'
        }
        console.log('order to submit', order)

        axios.post('/multiOrders', order, {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(response => {
                if (response.data.errors) {
                    console.log('Validation Error : ', response.data.errors)
                    window.alert(response.data.message)
                } else {
                    console.log('success', response.data)
                }
            })
            .catch(err => console.log(err))

        localStorage.removeItem('bulkOrders')
        localStorage.removeItem('bulkOrderSetting')
    }

    return (
        <div>
            <Button
                variant="contained"
                className="user-details-modal-trigger-btn"
                onClick={toggle}
            >
                {buttonLabel}
            </Button>
            <Dialog open={modal} onClose={toggle} className={className} fullWidth maxWidth="sm">
                <DialogTitle className="user-details-modal-title">
                    Review your Details
                    {userType === 'Admin' && <> as Admin</>}
                    <IconButton onClick={toggle} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <DialogContent className="user-details-modal-content">
                    <form onSubmit={orderSubmit}>
                        Name <br /><input value={name} onChange={(e) => setName(e.target.value)} /><br />
                        Email <br /><input value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                        Phone number <br /><input value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} /><br />
                        Address <br /><textarea value={address} onChange={(e) => setAddress(e.target.value)} /><br />
                        <Button variant="contained" type="submit">Submit order</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default UserDetailsFormModal;
