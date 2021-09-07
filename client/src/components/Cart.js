import React from 'react'
import { Link } from 'react-router-dom'
import { Table, Button } from 'reactstrap';
import NoItemsInCart from '../images/2.jpg'
import proceedImage from '../images/proceed.svg'
import { Stepper } from 'react-form-stepper'


export default class Cart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cartItems: [],
            reqOrder: [],
            defaultItems: []
        }

        this.plusHandle = this.plusHandle.bind(this)

    }


    componentDidMount() {
        // get all orders from /menu find and display all items from that _id
        console.log('inside componentdidmount Cart')
        // console.log('local storage render items :')
        // console.log(localStorage.getItem('orderItems'))
        // console.log(localStorage.getItem('orderItems').items)
        // console.log('fetching :', localStorage.getItem('orderItems'))
        // // console.log(Array.isArray(JSON.parse(localStorage.getItem('orderItems'))))
        // const parsedItems = JSON.parse(localStorage.getItem('orderItems'))
        // console.log('parsedItems :', parsedItems)
        // console.log('parsedItems isArray?:', Array.isArray(parsedItems))
        // console.log('before setstate')
        // console.log(this.state.reqOrder)
        // this.setState({
        //     reqOrder: parsedItems
        // })

        // console.log('after setstate')

        // console.log(this.state.reqOrder)

        if (localStorage.getItem("cartItems")) {
            var trueValues = JSON.parse(localStorage.getItem("cartItems")).filter(item => item.isSelected === true)
            this.setState({
                cartItems: trueValues,
                defaultItems: JSON.parse(localStorage.getItem("cartItems"))
            })
        }
        else
            this.setState({ cartItems: [] })
    }

    handleRemove = (id) => {
        console.log('clicked on remove button for id :', id)
        this.setState((prevState) => ({
            cartItems: prevState.cartItems.filter(item => item._id !== id)
        }))

        // localStorage.setItem("cartItems", JSON.stringify([...this.state.cartItems, ...this.state.defaultItems]))
    }

    disableButton = (index) => {
        console.log("disable the - button for the id :", index + 1)
        var minusButtonId = document.getElementById(index + 1)
        console.log("minusButton", minusButtonId)
        minusButtonId.disabled = true
    }

    EnableButton = (index) => {
        console.log("Enable the - button for the id :", index + 1)
        var minusButtonId = document.getElementById(index + 1)
        console.log("minusButton", minusButtonId)
        minusButtonId.disabled = false
    }

    minusHandle = (id) => {
        console.log('clicked on - button for id :', id)

        console.log('reqOrder/cartItems state:', this.state.cartItems)
        const foundItem = this.state.cartItems.find(item => item._id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = this.state.cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders/cartItems :', this.state.cartItems)
        console.log('spread :', ...this.state.cartItems)
        console.log('spread index :', this.state.cartItems[index])
        console.log('spread index.quantity before:', this.state.cartItems[index].quantity)

        var changedItems = this.state.cartItems
        changedItems[index].quantity = Number(changedItems[index].quantity) - 1


        this.setState({ cartItems: changedItems })
        // here the array is correct , it needs all the other isSelected:false 


        // localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
        if (changedItems[index].quantity <= 1) {
            this.disableButton(index)
            // this.handleRemove(id)
            // this.props.resetIsSelected(id)
            // changedItems[index].quantity = 1
            // this.setState({ cartItems: changedItems })
        } else {
            this.EnableButton(index)
        }


        console.log('Items found\'s quantity after:', this.state.cartItems)
        console.log("==DEBUG==")
        console.log("Default items:")
        console.log(this.state.defaultItems)
        console.log("this.state.cartItems:")
        console.log(this.state.cartItems)

        var updatedCart = this.state.cartItems.filter(obj => this.state.defaultItems.find(p => p.id === obj.id) || obj);
        console.log("check here")
        console.log(updatedCart)//here is correct , the not true values are not present 
        console.log("false filter")
        // console.log(this.state.defaultItems.filter(item => item.isSelected === false))
        var falseFilter = this.state.defaultItems.filter(item => item.isSelected === false)
        var desiredResult = [...updatedCart, ...falseFilter]
        console.log(desiredResult)

        localStorage.setItem("cartItems", JSON.stringify(desiredResult))
        console.log('end of - Function')
    }

    plusHandle = (id) => {
        console.log('clicked on + button for id :', id)

        console.log('reqOrder/cartItems state:', this.state.cartItems)
        const foundItem = this.state.cartItems.find(item => item._id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = this.state.cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders/cartItems :', this.state.cartItems)
        console.log('spread :', ...this.state.cartItems)
        console.log('spread index :', this.state.cartItems[index])
        console.log('spread index.quantity before:', this.state.cartItems[index].quantity)

        var changedItems = this.state.cartItems
        changedItems[index].quantity = Number(changedItems[index].quantity) + 1


        this.setState({ cartItems: changedItems })
        // here the array is correct , it needs all the other isSelected:false 


        // localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))
        if (changedItems[index].quantity <= 0) {
            this.disableButton(index)

        } else {
            this.EnableButton(index)
        }


        console.log('Items found\'s quantity after:', this.state.cartItems)
        console.log("==DEBUG==")
        console.log("Default items:")
        console.log(this.state.defaultItems)
        console.log("this.state.cartItems:")
        console.log(this.state.cartItems)

        var updatedCart = this.state.cartItems.filter(obj => this.state.defaultItems.find(p => p.id === obj.id) || obj);
        console.log("check here")
        console.log(updatedCart)//here is correct , the not true values are not present 
        console.log("false filter")
        // console.log(this.state.defaultItems.filter(item => item.isSelected === false))
        var falseFilter = this.state.defaultItems.filter(item => item.isSelected === false)
        var desiredResult = [...updatedCart, ...falseFilter]
        console.log(desiredResult)

        localStorage.setItem("cartItems", JSON.stringify(desiredResult))
        console.log('end of + Function')

    }


    handleChange(e, qty, id) {
        console.log('inside the new handleChange')
        console.log('e :', e)
        console.log('e.target :', e.target)
        console.log('e.target.value :', e.target.value)
        console.log('qty :', qty)


        console.log('change quantity of this id:', id)

        const foundItem = this.state.cartItems.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s quantity before:', foundItem.quantity)

        console.log('Edit item : ', foundItem)

        const index = this.state.cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrder :', this.state.cartItems)
        console.log('spread :', ...this.state.cartItems)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = this.state.cartItems
        console.log('quantity :', qty)
        console.log('quantity should become :', e.target.value)
        changedItems[index].quantity = e.target.value

        this.setState({
            cartItems: changedItems
        })

        // localStorage.setItem("cartItems", JSON.stringify(this.state.cartItems))


        // console.log("==DEBUG==")
        console.log("Default items:")
        console.log(this.state.defaultItems)
        console.log("this.state.cartItems:")
        console.log(this.state.cartItems)

        var updatedCart = this.state.cartItems.filter(obj => this.state.defaultItems.find(p => p.id === obj.id) || obj);
        console.log("check here")
        console.log(updatedCart)//here is correct , the not true values are not present 
        console.log("false filter")
        // console.log(this.state.defaultItems.filter(item => item.isSelected === false))
        var falseFilter = this.state.defaultItems.filter(item => item.isSelected === false)
        var desiredResult = [...updatedCart, ...falseFilter]
        console.log(desiredResult)

        localStorage.setItem("cartItems", JSON.stringify(desiredResult))


        if (changedItems[index].quantity <= 0) {
            this.disableButton(index)
        } else {
            this.EnableButton(index)
        }
    }

    clearCart() {
        JSON.parse(localStorage.getItem("cartItems")).forEach(item => {
            this.props.resetIsSelected(item._id)
        })
        localStorage.removeItem("cartItems")
        this.setState({ cartItems: [] })
    }

    render() {
        // console.log("check props for cart items to show :", this.props.items.length)
        // console.log("check props for cart items to show :", this.props.items)
        console.log("check props for cart items to show :", this.props.cartItems)
        return (
            <div id="inner-Cart" >

                {/* <h1 id="cart-text-style" > Cart :</h1> */}
                {
                    this.state.cartItems.filter(item => item.isSelected === true).length === 0 ? (
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
                                <Stepper className="stepper-color" style={{ "backgroundColor": "#fff5d2" }}
                                    steps={[{ label: 'Select Items' }, { label: 'Enter Quantity' }, { label: 'Submit Enquiry' }]}
                                    activeStep={1}
                                />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Sl No</th>
                                            <th>Item Name</th>
                                            <th>Quantity</th>
                                            {/* <th scope="row" ><h2>Price</h2></th> */}
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            // this.props.items.filter(item => item.isSelected === true).map((item, i) => {
                                            this.state.cartItems.map((item, i) => {
                                                return (
                                                    <tr key={item._id} >
                                                        <td style={{ "textAlign": "center" }}>{i + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td style={{ "display": "inline-flex" }}>
                                                            {(item.quantity <= 1) ? (
                                                                <button disabled="true" id={i + 1} onClick={() => { this.minusHandle(item._id) }}>-</button>
                                                            ) : (
                                                                <button id={i + 1} onClick={() => { this.minusHandle(item._id) }}>-</button>
                                                            )}
                                                            <input name="quantity" onChange={(e) => { this.handleChange(e, item.quantity, item._id) }} value={item.quantity} style={{ "width": "35px", textAlign: "center" }} />
                                                            <button onClick={(e) => { this.plusHandle(item._id) }}>+</button>

                                                        </td>
                                                        <td>
                                                            <Button color="danger" style={{ "height": "33px", "fontWeight": "bold", "display": "block", "margin": "auto" }} onClick={() => {
                                                                this.props.resetIsSelected(item._id)
                                                                this.handleRemove(item._id)
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
                                <div style={{ "display": "flex", "justifyContent": "space-evenly" }}>
                                    <Button color="danger" style={{ "fontWeight": "bold" }} onClick={() => this.clearCart()}>Clear Cart</Button>
                                    <Link to='/request'
                                        onClick={() => {
                                            // console.log('request button clicked!')
                                            // window.alert('request button clicked')
                                            this.props.requestOrder(this.state.cartItems)
                                        }}>

                                        <Button style={{
                                            "backgroundColor": "#dbc268", "color": "black", "width": "100%", "fontWeight": "bold"
                                        }}>
                                            Proceed &nbsp;&nbsp;&nbsp; <img src={proceedImage} alt="proceedImage" style={{ "marginRight": "20px" }} />
                                        </Button>

                                    </Link>
                                </div >
                            </div >
                        )
                }
            </div >
        );
    }
}