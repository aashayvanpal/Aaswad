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
            reqOrder: []
        }

        this.plusHandle = this.plusHandle.bind(this)

    }



    // componentDidMount() {
    //     console.log('inside componentdidmount')
    //     var filteredItems = this.props.items.filter(item => item.isSelected === true)
    //     this.setState({ cartItems: filteredItems })
    // }


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

        this.setState({
            cartItems: this.props.items.filter(item => item.isSelected === true)
        })


    }

    handleRemove = (id) => {
        console.log('clicked on remove button for id :', id)
        this.setState((prevState) => ({
            cartItems: prevState.cartItems.filter(item => item._id !== id)
        }))
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

        console.log('reqOrder state:', this.state.cartItems)
        const foundItem = this.state.cartItems.find(item => item._id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = this.state.cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders :', this.state.cartItems)
        console.log('spread :', ...this.state.cartItems)
        console.log('spread index :', this.state.cartItems[index])
        console.log('spread index.quantity before:', this.state.cartItems[index].quantity)

        var changedItems = this.state.cartItems
        changedItems[index].quantity = changedItems[index].quantity - 1



        this.setState({ reqOrder: changedItems })
        // If the quantity goes below 0 disable the - button 

        if (changedItems[index].quantity <= 0) {
            this.disableButton(index)
        } else {
            this.EnableButton(index)
        }


        console.log('Items found\'s quantity after:', this.state.reqOrder)
        console.log('end of - Function')

    }

    plusHandle = (id, e) => {
        console.log('clicked on + button for id :', id)

        console.log('reqOrder state:', this.state.cartItems)
        const foundItem = this.state.cartItems.find(item => item._id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = this.state.cartItems.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders :', this.state.cartItems)
        console.log('spread :', ...this.state.cartItems)
        console.log('spread index :', this.state.cartItems[index])
        console.log('spread index.quantity before:', this.state.cartItems[index].quantity)
        console.log('e.target.value:', e.target)
        console.log('e.target.quantity:', e.target['quantity'])
        console.log('e:', e)

        var changedItems = this.state.cartItems
        changedItems[index].quantity = Number(changedItems[index].quantity) + 1

        this.setState({ cartItems: changedItems })

        if (changedItems[index].quantity <= 0) {
            this.disableButton(index)
        } else {
            this.EnableButton(index)
        }


        console.log('Items found\'s quantity after:', this.state.cartItems)
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

        // this.setState(prevState => ({
        //     display: !prevState.display
        //   }));

        // console.log('current state id',this.state.items.id[itemToToggle])
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

        if (changedItems[index].quantity <= 0) {
            this.disableButton(index)
        } else {
            this.EnableButton(index)
        }


        // this.setState(prevState => ({
        //     confirms: [
        //         prevState.confirms[index].status = !prevState.confirms[index].status,
        //         ...prevState.confirms
        //     ]
        // }))
        // put request

        // this.setState({
        //     reqOrder[1].quantity: e.target.value
        // })
    }


    render() {
        // console.log("check props for cart items to show :", this.props.items.length)
        // console.log("check props for cart items to show :", this.props.items)
        console.log("check props for cart items to show :", this.props.cartItems)
        return (
            <div id="inner-Cart" >
                {/* <h1 id="cart-text-style" > Cart :</h1> */}
                {
                    this.props.items.filter(item => item.isSelected === true).length === 0 ? (
                        <>
                            <h1 style={{
                                "margin": "30px",
                                "textAlign": "center",
                                "marginTop": "70px"
                            }}>No items in cart</h1>
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
                                                        <td style={{ "display": "inline-flex" }}><button id={i + 1} onClick={() => { this.minusHandle(item._id) }}>-</button><input name="quantity" onChange={(e) => { this.handleChange(e, item.quantity, item._id) }} value={item.quantity} style={{ "width": "35px", textAlign: "center" }} /><button onClick={(e) => { this.plusHandle(item._id, e) }}>+</button>

                                                        </td>
                                                        <td>
                                                            <Button color="danger" style={{ "height": "33px", "fontWeight": "bold", "display": "block", "margin": "auto" }} onClick={() => {
                                                                this.props.resetIsSelected(item._id)
                                                                this.handleRemove(item._id)
                                                                // this.props.removeItemFromCart(item.id)
                                                            }}
                                                            >
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
                                <Link to='/request'

                                    onClick={() => {
                                        // console.log('request button clicked!')
                                        // window.alert('request button clicked')
                                        this.props.requestOrder(this.state.cartItems)
                                    }}>
                                    <Button style={{
                                        "backgroundColor": "#dbc268", "color": "black", "width": "100%"
                                    }}>
                                        Proceed &nbsp;&nbsp;&nbsp; <img src={proceedImage} alt="proceedImage" style={{ "marginRight": "20px" }} />
                                    </Button>
                                </Link>
                            </div>
                        )
                }


            </div >
        );
    }
}