import React, { useState, useEffect } from 'react'
import '../../css/Print.css'
import diwaliImg from '../../images/diw.jpeg'
import logo from '../../images/aaswad-logo.svg'
// Displaying image to center css :
// display: block;
//   margin-left: auto;
//   margin-right: auto;
//   width: 50%;

const OrderPrint = () => {

    const [order, setOrder] = useState({})
    const [fullName, setFullName] = useState('')
    const [items, setItems] = useState([])
    const [eventDate, setEventDate] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [id, setId] = useState('')
    const [advanceAmount, setAdvanceAmount] = useState('')

    useEffect(() => {
        console.log("inside component did mount")
        
        let order = JSON.parse(localStorage.getItem('order'))
        setOrder(order)
        console.log("order :", order)
        console.log("state of order :", order)

        const { fullName, items, eventDate, phoneNumber, id, advanceAmount } = JSON.parse(localStorage.getItem('order'))

        setFullName(fullName)
        setItems(items)
        setEventDate(eventDate)
        setPhoneNumber(phoneNumber)
        setId(id)
        setAdvanceAmount(advanceAmount)
        console.log("items", items)
        console.log("isArray items", Array.isArray(items))
        // SET state for advance payment here
        console.log("------Debug------:", advanceAmount)

        console.log("this.state.advancePayment:", advanceAmount)
    }, [])


    return (
        <div id="Bill-Card">
            <img src={logo} alt="logo" id='logo' />
            <h4 style={{ "marginBottom": "50px" }}>
                In an attempt to go paperless, we are sending all the billing estimates over WhatsApp.<br />
                Your estimate is as follows : -
            </h4>
            <h3>Name   : {fullName}</h3>
            <h3>Mobile : {phoneNumber}</h3>
            <h3>Date   : {eventDate}</h3>
            <h3>
                <table id='table-style'>
                    <thead className='td-style' style={{ "fontWeight": "bold" }}>
                        <td className='td-style'>Sl No.</td>
                        <td className='td-style'>Particulars</td>
                        <td className='td-style'>Quantity</td>
                        <td className='td-style'>Rate</td>
                        <td className='td-style'>Amount (in INR)</td>
                    </thead>
                    <tbody>
                        {
                            items.map((item, i) => {
                                return (
                                    <tr>
                                        <td className='td-style'>{i + 1}</td>
                                        <td className='td-style' style={{
                                            "textAlign": "left",
                                            "paddingLeft": "20px"
                                        }}>{item.name}</td>
                                        <td className='td-style'>{item.quantity} {item.measured}.</td>
                                        <td className='td-style'>&#x20B9; {item.price}/-</td>
                                        <td className='td-style'>&#x20B9; {item.price * item.quantity}/-</td>

                                    </tr>)
                            })
                        }


                        {advanceAmount ? (<>
                            <tr>
                                <td colSpan="4" style={{
                                    "border": "1px solid black",
                                    "textAlign": "right", fontWeight: "bold"
                                }}> Total</td>
                                <td style={{
                                    "border": "1px solid black"
                                }}>   &#x20B9; {items.reduce((sum, i) => (
                                    sum += i.quantity * i.price
                                ), 0)}/-</td>
                            </tr>
                            <tr>
                                <td colSpan="4" style={{
                                    "border": "1px solid black",
                                    "textAlign": "right", fontWeight: "bold"
                                }}> Advance payment(-)</td>
                                <td>  &#x20B9; {advanceAmount}/-</td>
                            </tr>

                            <tr>
                                <td style={{
                                    "border": "1px solid black",
                                    "textAlign": "right",
                                    "paddingRight": "80px",
                                    "fontWeight": "bold",
                                }} colSpan="5">Balance:
                                    &#x20B9; {items.reduce((sum, i) => (
                                        sum += i.quantity * i.price
                                    ), -advanceAmount)} /-</td>
                            </tr>
                        </>
                        ) :
                            (
                                <tr>
                                    <td style={{
                                        "border": "1px solid black",
                                        "textAlign": "right",
                                        "paddingRight": "80px",
                                        "fontWeight": "bold",
                                    }} colSpan="5">Total:
                                        &#x20B9; {items.reduce((sum, i) => (
                                            sum += i.quantity * i.price
                                        ), 0)}/-</td>
                                </tr>
                            )}
                    </tbody>
                </table >
            </h3>

            <h4 style={{ "fontFamily": "'Lato' , sans-serif" }}>Contact :-<br />
                Varsha Vanpal <br /> Mobile : 9742814239<br />
                Email : varsha.vanpal@gmail.com <br /></h4>

            <br /><br />
            {/* <img src="https://static.toiimg.com/photo/msid-66475760/66475760.jpg?952246" alt="" width="45%" height="300px"
                style={{
                    "marginRight": "50px", "marginLeft": "30px"
                }} />

            <img src="https://i.pinimg.com/originals/8f/f5/ec/8ff5ec000c3b3ac91d12f88a6d0fd39c.jpg" alt="" width="45%" height="300px"
                style={{ "marginLeft": "auto", "marginRight": "auto" }} /><br /> */}
            {/* <h3 style={{ "textAlign": "center" }}><b>
                Happy Diwali</b>
            </h3><br /> <br /> */}

            <img src={diwaliImg} alt=""
                style={{
                    'display': "block",
                    "marginRight": "auto",
                    "marginLeft": "auto",
                    'width': "400px",
                    'height': "300px",
                    'borderRadius': "10px"
                }} />

            <br /> <br /><br /> <br />
            <h5 style={{ "textAlign": "right" }}><b>
                OrderID :{id}</b>
            </h5>
        </div >
    )
}

export default OrderPrint