import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Table, Button } from 'reactstrap';
import NoItemsInCart from '../images/2.jpg'
import proceedImage from '../images/proceed.svg'
import { Stepper } from 'react-form-stepper'
import clearCartImg from '../images/clear-cart-icon.png'
import VisibilityContext from './Context.js'
import '../css/AdminCart.css'

const AdminCart = (props) => {

    const [cartItems, setCartItems] = useState([])
    const [defaultItems, setDefaultItems] = useState([])
    const [bulkMealType, setBulkMealType] = useState('')
    const [bulkDate, setBulkDate] = useState('')
    const [bulkIndex, setBulkIndex] = useState('')
    let [total, setTotal] = useState(0)
    const { actions } = useContext(VisibilityContext);
    // const context = useContext(context);

    useEffect(() => {
        // get all orders from /menu find and display all items from that _id
        console.log('inside componentdidmount Cart')
        // console.log('local storage render items :')
        // console.log(localStorage.getItem('orderItems'))
        // console.log(localStorage.getItem('orderItems').items)
        // console.log('fetching :', localStorage.getItem('orderItems'))
        // // console.log(Array.isArray(JSON.parse(localStorage.getItem('orderItems'))))

        if (localStorage.getItem("cartItems")) {
            var trueValues = JSON.parse(localStorage.getItem("cartItems")).filter(item => item.isSelected === true)
            setCartItems(trueValues)
            setDefaultItems(JSON.parse(localStorage.getItem("cartItems")))
        }

        if (localStorage.getItem('bulkOrderSetting')) {
            const bulkOrderSetting = JSON.parse(localStorage.getItem('bulkOrderSetting'))
            setBulkMealType(bulkOrderSetting[1])
            setBulkDate(bulkOrderSetting[0])
            setBulkIndex(bulkOrderSetting[2])
        }
    }, [])


    const handleRemove = (id) => {
        console.log('clicked on remove button for id :', id)
        setCartItems(cartItems.filter(item => item._id !== id))
        // localStorage.setItem("cartItems", JSON.stringify([...this.state.cartItems, ...this.state.defaultItems]))
    }

    const disableButton = (index) => {
        console.log("disable the - button for the id :", index + 1)
        var minusButtonId = document.getElementById(index + 1)
        console.log("minusButton", minusButtonId)
        minusButtonId.disabled = true
    }

    const EnableButton = (index) => {
        console.log("Enable the - button for the id :", index + 1)
        var minusButtonId = document.getElementById(index + 1)
        console.log("minusButton", minusButtonId)
        minusButtonId.disabled = false
    }

    const minusHandle = (id) => {
        console.log('clicked on - button for id :', id)

        console.log('reqOrder/cartItems state:', cartItems)
        const foundItem = cartItems.find(item => item._id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders/cartItems :', cartItems)
        console.log('spread :', ...cartItems)
        console.log('spread index :', cartItems[index])
        console.log('spread index.quantity before:', cartItems[index].quantity)

        var changedItems = cartItems
        changedItems[index].quantity = Number(changedItems[index].quantity) - 1

        setCartItems([...changedItems])
        // here the array is correct , it needs all the other isSelected:false 


        // localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
        if (changedItems[index].quantity <= 1) {
            disableButton(index)
            // this.handleRemove(id)
            // this.props.resetIsSelected(id)
            // changedItems[index].quantity = 1
            // this.setState({ cartItems: changedItems })
        } else {
            EnableButton(index)
        }


        console.log('Items found\'s quantity after:', cartItems)
        console.log("==DEBUG==")
        console.log("Default items:")
        console.log(defaultItems)
        console.log("cartItems:")
        console.log(cartItems)

        var updatedCart = cartItems.filter(obj => defaultItems.find(p => p.id === obj.id) || obj);
        console.log("check here")
        console.log(updatedCart)//here is correct , the not true values are not present 
        console.log("false filter")
        // console.log(this.state.defaultItems.filter(item => item.isSelected === false))
        var falseFilter = defaultItems.filter(item => item.isSelected === false)
        var desiredResult = [...updatedCart, ...falseFilter]
        console.log(desiredResult)

        localStorage.setItem("cartItems", JSON.stringify(desiredResult))
        console.log('end of - Function')
    }

    const plusHandle = (id) => {
        console.log('clicked on + button for id :', id)

        console.log('reqOrder/cartItems state:', cartItems)
        const foundItem = cartItems.find(item => item._id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders/cartItems :', cartItems)
        console.log('spread :', ...cartItems)
        console.log('spread index :', cartItems[index])
        console.log('spread index.quantity before:', cartItems[index].quantity)

        var changedItems = cartItems
        changedItems[index].quantity = Number(changedItems[index].quantity) + 1

        setCartItems([...changedItems])
        // here the array is correct , it needs all the other isSelected:false 


        // localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
        if (changedItems[index].quantity <= 0) {
            disableButton(index)

        } else {
            EnableButton(index)
        }


        console.log('Items found\'s quantity after:', cartItems)
        console.log("==DEBUG==")
        console.log("Default items:")
        console.log(defaultItems)
        console.log("cartItems:")
        console.log(cartItems)

        var updatedCart = cartItems.filter(obj => defaultItems.find(p => p.id === obj.id) || obj);
        console.log("check here")
        console.log(updatedCart)//here is correct , the not true values are not present 
        console.log("false filter")
        // console.log(this.state.defaultItems.filter(item => item.isSelected === false))
        var falseFilter = defaultItems.filter(item => item.isSelected === false)
        var desiredResult = [...updatedCart, ...falseFilter]
        console.log(desiredResult)

        localStorage.setItem("cartItems", JSON.stringify(desiredResult))
        console.log('end of + Function')
    }

    const handlePriceChange = (e, price, id) => {
        console.log('inside the handlePrice')
        console.log('e :', e)
        console.log('e.target :', e.target)
        console.log('e.target.value :', e.target.value)
        console.log('price :', price)

        console.log('change quantity of this id:', id)

        const foundItem = cartItems.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s price before:', foundItem.price)

        console.log('Edit item : ', foundItem)

        const index = cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrder :', cartItems)
        console.log('spread :', ...cartItems)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = cartItems
        console.log('price :', price)
        console.log('price should become :', e.target.value)
        changedItems[index].price = e.target.value

        setCartItems([...changedItems])
        // localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
        // console.log("==DEBUG==")
        console.log("Default items:")
        console.log(defaultItems)
        console.log("cartItems:")
        console.log(cartItems)

        var updatedCart = cartItems.filter(obj => defaultItems.find(p => p.id === obj.id) || obj);
        console.log("check here")
        console.log(updatedCart)//here is correct , the not true values are not present 
        console.log("false filter")
        // console.log(this.state.defaultItems.filter(item => item.isSelected === false))
        var falseFilter = defaultItems.filter(item => item.isSelected === false)
        var desiredResult = [...updatedCart, ...falseFilter]
        console.log(desiredResult)

        localStorage.setItem("cartItems", JSON.stringify(desiredResult))

        if (changedItems[index].quantity <= 0) {
            disableButton(index)
        } else {
            EnableButton(index)
        }
    }

    const handleChange = (e, qty, id) => {
        console.log('inside the new handleChange')
        console.log('e :', e)
        console.log('e.target :', e.target)
        console.log('e.target.value :', e.target.value)
        console.log('qty :', qty)

        console.log('change quantity of this id:', id)

        const foundItem = cartItems.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s quantity before:', foundItem.quantity)

        console.log('Edit item : ', foundItem)

        const index = cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrder :', cartItems)
        console.log('spread :', ...cartItems)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = cartItems
        console.log('quantity :', qty)
        console.log('quantity should become :', e.target.value)
        changedItems[index].quantity = e.target.value

        setCartItems([...changedItems])
        // localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))


        // console.log("==DEBUG==")
        console.log("Default items:")
        console.log(defaultItems)
        console.log("this.state.cartItems:")
        console.log(cartItems)

        var updatedCart = cartItems.filter(obj => defaultItems.find(p => p.id === obj.id) || obj);
        console.log("check here")
        console.log(updatedCart)//here is correct , the not true values are not present 
        console.log("false filter")
        // console.log(this.state.defaultItems.filter(item => item.isSelected === false))
        var falseFilter = defaultItems.filter(item => item.isSelected === false)
        var desiredResult = [...updatedCart, ...falseFilter]
        console.log(desiredResult)

        localStorage.setItem("cartItems", JSON.stringify(desiredResult))


        if (changedItems[index].quantity <= 0) {
            disableButton(index)
        } else {
            EnableButton(index)
        }
    }

    const clearCart = () => {
        JSON.parse(localStorage.getItem("cartItems")).forEach(item => {
            props.resetIsSelected(item._id)
        })
        localStorage.removeItem("cartItems")
        setCartItems([])
    }



    // console.log("check props for cart items to show :", this.props.items.length)
    // console.log("check props for cart items to show :", this.props.items)
    // console.log("check props for cart items to show :", this.props.cartItems)

    const multiOrder = () => {
        console.log('setchild component', actions)
        let order = actions.orderDates
        order[bulkIndex][bulkDate][bulkMealType].items = cartItems
        // console.log('current state of orderDates1', bulkDate)
        // console.log('current state of orderDates2', bulkMealType)
        console.log('cart items', cartItems)
        console.log('order', order)
        console.log('current state of orderDates', actions.orderDates)
        actions.setOrderDates(order)
        // localStorage.setItem('bulkOrders', JSON.stringify(order))
        // console.log(order[0]['2022/07/06']['Breakfast'][0].name)
        // actions.setTextvalue(`the value is changed to ${order[bulkIndex][bulkDate][bulkMealType].items[0].name}`)
        // actions.setTextvalue(`the value is changed to ${order[0]['2022/07/06']['Breakfast'][0].name}`)
        actions.setShowMultiDateComponent(true)
    }
    return (
        <div id="inner-Cart" >
            {/* <h1 id="cart-text-style" > Cart :</h1> */}
            {
                cartItems.filter(item => item.isSelected === true).length === 0 ? (
                    <>
                        <h1 style={{
                            "margin": "30px",
                            "textAlign": "center",
                            "marginTop": "70px"
                        }}>No items in Cart</h1>
                        <img src={NoItemsInCart} alt="NoItemsInCart" height="100%" width="100%" />
                    </>
                )
                    :
                    (
                        <div>
                            <Stepper className="stepper-color" style={{ "backgroundColor": "#fff5d2", marginTop: "10px", padding: "0px" }}
                                steps={[{ label: 'Select Items' }, { label: 'Enter Quantity' }, { label: 'Submit Enquiry' }]}
                                activeStep={1}
                            />
                            <h2 style={{ textAlign: "center", }}>Total amount - {
                                cartItems.reduce((sum, i) => (
                                    sum += i.quantity * i.price
                                ), 0)}
                            </h2>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Sl No</th>
                                        <th>Item Name</th>
                                        <th>Price<br />Amt</th>
                                        <th>Quantity</th>
                                        <th>Remove</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        // this.props.items.filter(item => item.isSelected === true).map((item, i) => {
                                        cartItems.map((item, i) => {
                                            // total += item.quantity * item.price

                                            // setTotal(total += item.quantity * item.price)
                                            return (
                                                <tr key={item._id} >
                                                    <td style={{ "textAlign": "center" }}>{i + 1}</td>
                                                    <td><h5>{item.name}</h5></td>

                                                    <td style={{ textAlign: "center" }}>
                                                        <input name="price" value={item.price} onChange={(e) => { handlePriceChange(e, item.price, item._id) }} style={{ "width": "35px", textAlign: "center" }} />
                                                        <br />{item.price * item.quantity}
                                                    </td>

                                                    <td style={{ "display": "inline-flex" }}>
                                                        {(item.quantity <= 1) ? (
                                                            <button disabled="true" id={i + 1} onClick={() => { minusHandle(item._id) }}>-</button>
                                                        ) : (
                                                            <button id={i + 1} onClick={() => { minusHandle(item._id) }}>-</button>
                                                        )}
                                                        <input name="quantity" onChange={(e) => { handleChange(e, item.quantity, item._id) }} value={item.quantity} style={{ "width": "35px", textAlign: "center" }} />
                                                        <button onClick={(e) => { plusHandle(item._id) }}>+</button>

                                                    </td>
                                                    <td>
                                                        <Button color="danger" style={{ "height": "33px", "fontWeight": "bold", "display": "block", "margin": "auto" }} onClick={() => {
                                                            props.resetIsSelected(item._id)
                                                            handleRemove(item._id)
                                                        }}>
                                                            X
                                                        </Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>

                            <hr />
                            <div style={{ "display": "flex", "justifyContent": "space-evenly", padding: "10px" }}>
                                <Button color="danger" style={{ "fontWeight": "bold" }} onClick={() => clearCart()}>
                                    <img src={clearCartImg} alt="" height="25px" width="25px" />
                                    Clear Cart
                                </Button>

                                <Link to='/request'
                                    id="proceed-btn"
                                    onClick={() => {
                                        // console.log('request button clicked!')
                                        // window.alert('request button clicked')
                                        props.requestOrder(cartItems)
                                    }}>
                                    <Button
                                        style={{ fontWeight: "bold", backgroundColor: '#dbc268', color: 'black' }}
                                    >
                                        Proceed admin &nbsp;&nbsp;&nbsp; <img src={proceedImage} alt="proceedImage" style={{ "marginRight": "15px" }} />
                                    </Button >
                                </Link>

                            </div >
                            {bulkDate} for {bulkMealType}
                            <button onClick={multiOrder}>Proceed to multiOrder</button>
                        </div >
                    )
            }
        </div >
    );
}
export default AdminCart