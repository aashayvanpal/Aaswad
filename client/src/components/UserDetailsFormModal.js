import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from '../config/axios.js'

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
        // getting user data
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log("user data :", dataRequest)

                setCustomerId(dataRequest.data.id)
                setName(dataRequest.data.username)
                setEmail(dataRequest.data.email)
                setPhonenumber(dataRequest.data.phonenumber)
                setAddress(dataRequest.data.address)
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    const toggle = () => setModal(!modal);

    const orderSubmit = (e) => {
        e.preventDefault()
        console.log('inside orderSubmit')
        // console.log('name:', name)
        // console.log('email:', email)
        // console.log('phonenumber:', phonenumber)
        // console.log('address:', address)
        // console.log('final order:', orderDates)



        // if the orders have empty array , remove the property

        // order.forEach(orderObj => {
        //     for (let obj in orderObj) {
        //         // console.log(orderObj[obj])
        //         for (let mealType in orderObj[obj]) {
        //             // console.log(orderObj[obj][mealType].items.length)
        //             if (orderObj[obj][mealType].items.length === 0) {
        //                 delete orderObj[obj][mealType]
        //             }
        //         }
        //     }
        // })


        orderDates.forEach(orderObj => {
            for (let obj in orderObj) {
                // console.log(orderObj[obj])
                for (let mealType in orderObj[obj]) {
                    // console.log(orderObj[obj][mealType].items.length)
                    if (orderObj[obj][mealType].items.length === 0) {
                        delete orderObj[obj][mealType]
                    }
                }
            }
        })

        // calculating amount and total amount 
        console.log('calculating amount and total amount ')
        // console.log('orderDates', orderDates)
        orderDates.forEach(index => {
            for (let date in orderDates[index]) {
                for (let orderType in orderDates[index][date]) {
                    let sum = 0
                    orderDates[index][date][orderType].items.reduce((sum, i) => {
                        sum += i.quantity * i.price
                        console.log('sum', sum)
                        orderDates[index][date][orderType]['amount'] = sum
                    }, 0)
                }
            }
        })

        // orderDates[i][date][orderType].items.reduce((sum, i) => (
        //     sum += i.quantity * i.price
        // ), 0)

        console.log('check sum object here: ', orderDates)
        console.log('calculating amount and total amount end ')

        const order = {
            customer: { customer_id: customerId, fullName: name, email, phoneNumber: phonenumber, address, },
            orderDates,
            status: 'approve'
        }
        console.log('order to submit', order)

        // console.log(order)


        // // post request 
        // axios.post('/multiOrders', order, {
        //     headers: {
        //         "x-auth": localStorage.getItem('token')
        //     }
        // })
        //     .then(response => {
        //         if (response.data.errors) {
        //             console.log('Validation Error : ', response.data.errors)
        //             window.alert(response.data.message)
        //         }
        //         else {
        //             console.log('success', response.data)
        //             // localStorage.removeItem("cartItems")
        //             // localStorage.removeItem("order")

        //             // window.location.href = '/menu'

        //             // Email notification
        //             // emailNotify(order)
        //         }
        //     })
        //     .catch(err => console.log(err))


        // // delete bulkOrders , bulkSettings
        // localStorage.removeItem('bulkOrders')
        // localStorage.removeItem('bulkOrderSetting')
        // // redirect to multiorders view page
        // window.location.href = '/multiorders'

    }
    return (
        <div >
            <Button style={{
                "backgroundColor": "#dbc268",
                "color": "black",
                "fontSize": "22px"
            }} className="#" id="#" onClick={toggle}>
                {buttonLabel}
            </Button>
            <Modal isOpen={modal} toggle={toggle} className={className} >
                <ModalHeader style={{ "backgroundColor": "#ebc642" }} toggle={toggle}>Review your Details
                    {userType === "Admin" ? (<> as Admin</>) : (null)}
                </ModalHeader>
                <ModalBody style={{ "backgroundColor": "#fff5d2", padding: "0px" }} >
                    <form onSubmit={orderSubmit}>
                        Name < br /><input value={name} onChange={(e) => setName(e.target.value)} /> < br />
                        Email < br /><input value={email} onChange={(e) => setEmail(e.target.value)} />< br />
                        Phone number < br /><input value={phonenumber} onChange={(e) => setPhonenumber(e.target.value)} />< br />
                        Address < br /><textarea value={address} onChange={(e) => setAddress(e.target.value)} />< br />
                        <Button >Submit order</Button>
                    </form>
                </ModalBody>
            </Modal >
        </div >
    );
}

export default UserDetailsFormModal;