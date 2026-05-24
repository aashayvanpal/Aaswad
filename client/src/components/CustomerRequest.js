import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import CustomerForm from './customer/Form.js'
import { addEventOrder } from '../apis/eventOrders';
import generateObjectID from '../helperFunctions/generateObjectID';
import { useSelector, useDispatch } from 'react-redux'
import { clearCart } from '../store/slices/cartSlice'
import { useCreateOrderMutation, useUpdateOrderMutation } from '../store/services/ordersApi'

const CustomerRequest = ({ type = "default" }) => {
    const [username, setUserName] = useState('')
    const [userType, setUserType] = useState('')
    const [phonenumber, setPhoneNumber] = useState('')
    const [address, setAddress] = useState('')
    const [openSubmitEnquiryModal, setOpenSubmitEnquiryModal] = useState(false)

    const dispatch = useDispatch()
    const cartItems = useSelector(state => state.cart.items)
    const editingOrder = useSelector(state => state.cart.editingOrder)

    const [createOrder] = useCreateOrderMutation()
    const [updateOrder] = useUpdateOrderMutation()

    useEffect(() => {
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                setUserName(dataRequest.data.username)
                setUserType(dataRequest.data.userType)
                setPhoneNumber(dataRequest.data.phonenumber)
                setAddress(dataRequest.data.address)
            })
            .catch(err => console.log(err))
    }, [])

    const emailNotify = (order) => {
        axios.post('/sendEmail/orderPlaced', { 'email': order.customer.email })
            .catch(err => console.error('[CustomerRequest] orderPlaced email failed:', err))
        axios.post('/sendEmail/newOrderNotify', { 'username': order.customer.fullName })
            .catch(err => console.error('[CustomerRequest] newOrderNotify email failed:', err))
    }

    const handleCustomerSubmit = async ({ customer: customerData, transport, AdvanceAmount, misc }) => {
        switch (type) {
            case 'eventOrder': {
                const orderId = generateObjectID()
                const order = {
                    items: cartItems,
                    customer: customerData,
                    transport,
                    AdvanceAmount,
                    misc,
                    status: 'approve',
                    orderId,
                }
                const id = localStorage.getItem('eventId')
                try {
                    await addEventOrder(id, order)
                    localStorage.removeItem('eventId')
                    dispatch(clearCart())
                } catch (err) {
                    console.error('[CustomerRequest] addEventOrder failed:', err)
                    window.alert(err?.response?.data?.message || 'Failed to submit event order. Please try again.')
                }
                break
            }
            default: {
                const order = {
                    items: cartItems,
                    customer: customerData,
                    transport,
                    AdvanceAmount,
                    misc,
                    status: 'approve',
                }

                if (editingOrder) {
                    try {
                        await updateOrder({ id: editingOrder._id, ...order }).unwrap()
                        setOpenSubmitEnquiryModal(true)
                        dispatch(clearCart())
                        emailNotify(order)
                    } catch (err) {
                        console.log(err)
                        window.alert(err?.data?.message || 'Update failed')
                    }
                } else {
                    try {
                        await createOrder(order).unwrap()
                        setOpenSubmitEnquiryModal(true)
                        dispatch(clearCart())
                        emailNotify(order)
                    } catch (err) {
                        console.log(err)
                        window.alert(err?.data?.message || 'Order creation failed')
                    }
                }
                break
            }
        }
    }

    return (
        <div id="request-div">
            <CustomerForm
                handleCustomerSubmit={handleCustomerSubmit}
                openSubmitEnquiryModal={openSubmitEnquiryModal}
                userType={userType}
            />
        </div>
    )
}

export default CustomerRequest
