import React, { useState, useEffect } from 'react'
import '../../css/Print.scss'
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
            <h4 className="print-intro-text">
                In an attempt to go paperless, we are sending all the billing estimates over WhatsApp.<br />
                Your estimate is as follows : -
            </h4>
            <h3>Name   : {fullName}</h3>
            <h3>Mobile : {phoneNumber}</h3>
            <h3>Date   : {eventDate}</h3>
            <h3>
                <table id='table-style'>
                    <thead className='td-style print-thead-bold'>
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
                                        <td className='td-style print-item-name-cell'>{item.name}</td>
                                        <td className='td-style'>{item.quantity} {item.measured}.</td>
                                        <td className='td-style'>&#x20B9; {item.price}/-</td>
                                        <td className='td-style'>&#x20B9; {item.price * item.quantity}/-</td>

                                    </tr>)
                            })
                        }


                        {advanceAmount ? (<>
                            <tr>
                                <td colSpan="4" className="print-total-label"> Total</td>
                                <td className="print-total-value">   &#x20B9; {items.reduce((sum, i) => (
                                    sum += i.quantity * i.price
                                ), 0)}/-</td>
                            </tr>
                            <tr>
                                <td colSpan="4" className="print-total-label"> Advance payment(-)</td>
                                <td>  &#x20B9; {advanceAmount}/-</td>
                            </tr>

                            <tr>
                                <td className="print-balance-row" colSpan="5">Balance:
                                    &#x20B9; {items.reduce((sum, i) => (
                                        sum += i.quantity * i.price
                                    ), -advanceAmount)} /-</td>
                            </tr>
                        </>
                        ) :
                            (
                                <tr>
                                    <td className="print-balance-row" colSpan="5">Total:
                                        &#x20B9; {items.reduce((sum, i) => (
                                            sum += i.quantity * i.price
                                        ), 0)}/-</td>
                                </tr>
                            )}
                    </tbody>
                </table >
            </h3>

            <h4 className="print-contact-text">Contact :-<br />
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

            <img src={diwaliImg} alt="" className="print-diwali-img" />

            <br /> <br /><br /> <br />
            <h5 className="print-order-id"><b>
                OrderID :{id}</b>
            </h5>
        </div >
    )
}

export default OrderPrint