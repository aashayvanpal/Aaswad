import React from 'react';
import axios from '../config/axios';
import CustomerForm from './customer/Form.js'
// import { Table } from 'reactstrap';
// import { Link } from 'react-router-dom'

export default class CustomerRequest extends React.Component {
    constructor() {
        super()
        this.state = {
            reqOrder: [],
            username: '',
            userType: ''
        }

        this.handleRemove = this.handleRemove.bind(this)
        this.plusHandle = this.plusHandle.bind(this)
        this.minusHandle = this.minusHandle.bind(this)
        this.disableButton = this.disableButton.bind(this)
        this.EnableButton = this.EnableButton.bind(this)
        this.handleCustomerSubmit = this.handleCustomerSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)

    }

    componentDidMount() {
        // get all orders from /menu find and display all items from that _id
        console.log('inside componentdidmount customer request')
        // console.log('local storage render items :')
        // console.log(localStorage.getItem('orderItems'))
        // console.log(localStorage.getItem('orderItems').items)
        console.log('fetching :', localStorage.getItem('orderItems'))
        // console.log(Array.isArray(JSON.parse(localStorage.getItem('orderItems'))))
        const parsedItems = JSON.parse(localStorage.getItem('orderItems'))
        console.log('parsedItems :', parsedItems)
        console.log('parsedItems isArray?:', Array.isArray(parsedItems))
        console.log('before setstate')
        console.log(this.state.reqOrder)
        this.setState({
            reqOrder: parsedItems
        })

        console.log('after setstate')

        console.log(this.state.reqOrder)

        // Do a get request to /account to get user name , add x-auth as header to it
        // just set the token in localStorage and get it in x-auth , the code is working fine,,,
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                console.log("user data :", dataRequest)
                this.setState({
                    username: dataRequest.data.username,
                    userType: dataRequest.data.userType

                })
            })
            .catch(err => {
                console.log(err)
            })

    }

    handleRemove = (id) => {
        console.log('clicked on remove button for id :', id)
        this.setState((prevState) => ({
            reqOrder: prevState.reqOrder.filter(item => item.id !== id)
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

        console.log('reqOrder state:', this.state.reqOrder)
        const foundItem = this.state.reqOrder.find(item => item.id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = this.state.reqOrder.findIndex(item => item.id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders :', this.state.reqOrder)
        console.log('spread :', ...this.state.reqOrder)
        console.log('spread index :', this.state.reqOrder[index])
        console.log('spread index.quantity before:', this.state.reqOrder[index].quantity)

        var changedItems = this.state.reqOrder
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

        console.log('reqOrder state:', this.state.reqOrder)
        const foundItem = this.state.reqOrder.find(item => item.id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  reqOrder.quantity before:', foundItem.quantity)


        const index = this.state.reqOrder.findIndex(item => item.id === id)
        console.log('the index is :', index)

        console.log('state of reqOrders :', this.state.reqOrder)
        console.log('spread :', ...this.state.reqOrder)
        console.log('spread index :', this.state.reqOrder[index])
        console.log('spread index.quantity before:', this.state.reqOrder[index].quantity)
        console.log('e.target.value:', e.target)
        console.log('e.target.quantity:', e.target['quantity'])
        console.log('e:', e)

        var changedItems = this.state.reqOrder
        changedItems[index].quantity = Number(changedItems[index].quantity) + 1

        this.setState({ reqOrder: changedItems })

        if (changedItems[index].quantity <= 0) {
            this.disableButton(index)
        } else {
            this.EnableButton(index)
        }


        console.log('Items found\'s quantity after:', this.state.reqOrder)
        console.log('end of + Function')

    }

    handleCustomerSubmit(customerData) {
        // e.preventDefault()
        console.log('clicked on submit enquiry button lol fail')
        console.log('Send these items for approval :', this.state.reqOrder)
        console.log('Submit this customer data :', customerData)

        const order = {
            items: this.state.reqOrder,
            customer: customerData,
            status: 'approve'
        }

        console.log('order :', order)

        // post request -> order 
        axios.post('/request', order, {
            headers: {
                "x-auth": localStorage.getItem('token')
            }
        })
            .then(response => {
                if (response.data.errors) {
                    console.log('Validation Error : ', response.data.errors)
                    window.alert(response.data.message)
                }
                else {
                    console.log('success', response.data)
                    // this.props.history.push('/items')
                }
            })



        window.alert('Thank you for placing order we will get back')

    }

    // handleChange = (id, qty) => {
    //     console.log('inside handleChange')
    //     console.log('change quantity of this id:', id)

    //     const foundItem = this.state.reqOrder.find(item => item.id === id)
    //     console.log('Item found :', foundItem)
    //     console.log('Item found\'s quantity before:', foundItem.quantity)

    //     // this.setState(prevState => ({
    //     //     display: !prevState.display
    //     //   }));

    //     // console.log('current state id',this.state.items.id[itemToToggle])
    //     console.log('Edit item : ', foundItem)


    //     const index = this.state.reqOrder.findIndex(item => item.id === id)
    //     console.log('the index is :', index)

    //     console.log('state of reqOrder :', this.state.reqOrder)
    //     console.log('spread :', ...this.state.reqOrder)
    //     // console.log('spread index 2:', this.state.items[2])
    //     // console.log('spread index 2 display before:', this.state.items[2].display)
    //     // console.log('spread index 2 display after:', !this.state.items[2].display)

    //     var changedItems = this.state.reqOrder
    //     console.log('quantity :', qty)
    //     // changedItems[index].quantity = 'confirmed'

    //     // this.setState((prevState) => ({
    //     //     confirms: [changedItems[index], ...prevState.confirms]
    //     // }))

    //     // this.setState({
    //     //     approves: changedItems.filter(item => item.status === 'approve')
    //     // })

    //     // // this.setState(prevState => ({
    //     // //     confirms: [
    //     // //         prevState.confirms[index].status = !prevState.confirms[index].status,
    //     // //         ...prevState.confirms
    //     // //     ]
    //     // // }))
    //     // // put request

    //     // // this.setState({
    //     // //     reqOrder[1].quantity: e.target.value
    //     // // })
    // }

    handleChange(e, qty, id) {
        console.log('inside the new handleChange')
        console.log('e :', e)
        console.log('e.target :', e.target)
        console.log('e.target.value :', e.target.value)
        console.log('qty :', qty)


        console.log('change quantity of this id:', id)

        const foundItem = this.state.reqOrder.find(item => item.id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s quantity before:', foundItem.quantity)

        // this.setState(prevState => ({
        //     display: !prevState.display
        //   }));

        // console.log('current state id',this.state.items.id[itemToToggle])
        console.log('Edit item : ', foundItem)


        const index = this.state.reqOrder.findIndex(item => item.id === id)
        console.log('the index is :', index)

        console.log('state of reqOrder :', this.state.reqOrder)
        console.log('spread :', ...this.state.reqOrder)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = this.state.reqOrder
        console.log('quantity :', qty)
        console.log('quantity should become :', e.target.value)
        changedItems[index].quantity = e.target.value

        this.setState({
            reqOrder: changedItems
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
        console.log('customer request')
        return (
            <div style={{ "display": "inline" }}>
                {
                    this.state.userType === "Admin" ? (
                        <button id="ShowButton" onClick={() => {
                            var navBarElement = document.getElementById("Nav-bar")
                            navBarElement.style.display = "block"

                            var showElement = document.getElementById("ShowButton")
                            showElement.style.display = "none"

                        }}>Show</button>
                    ) : (null)
                }



                <CustomerForm handleCustomerSubmit={this.handleCustomerSubmit} />
                {/* <button onClick={this.handleSubmit}>Submit Enquiry</button> */}
            </div >
        );
    }
}