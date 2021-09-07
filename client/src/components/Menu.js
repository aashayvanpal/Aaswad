import React from 'react'
import axios from '../config/axios'
import CartModel from './CartModel.js'
import cardCurve from '../images/item-curve.svg'
import noItemFound from '../images/no-item-found.svg'
import LoadingSpinner from './LoadingSpinner.js'
import '../css/app-css.css'
import { Stepper } from 'react-form-stepper'
import { getUserDetails } from '../assets/user-functions.js'
import Header from "./Header.js"
import NavigationBar from './NavigationBar'
import { Toast, ToastBody, ToastHeader } from 'reactstrap';
import { Link } from 'react-router-dom'


// for loading from google images :(not working) 
// <img src={`https://photos.google.com/share/AF1QipMK9yJs7N52kZcsS17jVq8mvLsi3NPhGkyrGv3IUhDOx0WbPcW5-ZVmPnj0MvTg_A${item.imgUrl}`} alt={item.name + " image"} id="imageStyling" /> */}


// Use this as replacement v1.0.4 :problem of image loading dynamically is solved
// <img src={`/images/food-item-images/${item.imgUrl}`} alt={item.name + " image"} id="imageStyling" />



export default class Menu extends React.Component {
    constructor() {
        super()
        this.state = {
            isFavourite: false,
            items: [],
            cartItems: [],
            inputSearch: '',
            searchFilter: [],
            username: '',
            userType: false,
            spinnerLoading: false
        }

        // this.CartHandle = this.CartHandle.bind(this)
        this.CartRemoveHandle = this.CartRemoveHandle.bind(this)
        this.favouriteHandle = this.favouriteHandle.bind(this)
        // this.checkboxChange = this.checkboxChange.bind(this)
        this.newCheckboxChange = this.newCheckboxChange.bind(this)
        this.isCheckedValue = this.isCheckedValue.bind(this)
        this.resetIsSelected = this.resetIsSelected.bind(this)
        this.toggleIsSelected = this.toggleIsSelected.bind(this)
        this.newtoggleIsSelected = this.newtoggleIsSelected.bind(this)
        this.requestOrder = this.requestOrder.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.clearSearch = this.clearSearch.bind(this)
        this.getUserMenu = this.getUserMenu.bind(this)



    }

    favouriteHandle() {
        this.setState({
            isFavourite: true
        })
        console.log('Favourite button was clicked!')
        console.log("I got updated! ")

        console.log("Favourite :", this.state.isFavourite)
    }
    CartRemoveHandle() {
        console.log('Remove from Cart button was clicked!')

        this.setState({
            showItemQtyBar: false
        })

    }


    componentDidMount() {

        // Do a get request to /account to get user name , add x-auth as header to it
        // just set the token in localStorage and get it in x-auth , the code is working fine,,,

        getUserDetails()
            .then(res => {
                console.log("user data inside component did mount new :", res)
                this.setState({
                    username: res.username,
                    userType: res.userType
                })
                this.getUserMenu()

            })
            .catch(err => {
                console.log(err)
                window.alert('Please login ,you will be redirected')
                window.location.href = '/signin'
            })
    }

    getUserMenu() {
        axios.get('/api/menu', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                if (localStorage.getItem("cartItems")) {
                    console.log("using localstorage to set the state")
                    const items = response.data
                    let filteredItems = items.filter(item => item.display === true)
                    filteredItems.forEach(item => {
                        item.isSelected = false
                        item.quantity = 1
                    })
                    this.setState({
                        items: filteredItems,
                    })

                    var oldSelectedItems = JSON.parse(localStorage.getItem("cartItems")).filter(item => this.state.items.find(i => item._id === i._id))
                    console.log(oldSelectedItems)
                    this.setState({
                        searchFilter: oldSelectedItems,
                        items: oldSelectedItems
                    })
                } else {
                    console.log('Data : ', response.data)
                    const items = response.data
                    console.log('items after request :', items)
                    console.log('items after filtering :')
                    let filteredItems = items.filter(item => item.display === true)
                    filteredItems.forEach(item => {
                        item.isSelected = false
                        item.quantity = 1
                    })
                    this.setState({
                        items: filteredItems,
                        searchFilter: filteredItems
                    })
                }

                console.log("this.state.items:", this.state.items)

                this.setState({ spinnerLoading: false })

            })
            .catch(err => {
                console.log(err)
            })
    }

    
    // trying to get the cart rendering with newCheckBoxChange
    newCheckboxChange(item) {
        console.log('inside newCheckBoxChange function', item)
        // this.toggleIsSelected(item._id)
        this.newtoggleIsSelected(item._id)
    }

    toggleIsSelected = (id) => {
        // Delete item from the cartItems do setState of cartItems
        console.log('inside the toggleIsSelected function')
        console.log('toggle this id from the items :', id)
        // this.removeItemFromCart(id)
        // console.log('Id removed from the cart check...')

        // Reset the items.isSelected to false
        // find the item in items[] then change isSelected to false
        console.log('items state:', this.state.items)
        console.log('searchfilter state:', this.state.searchFilter)
        // If below line is removed , the filtering works ,else it removes everything after the checkbox is selected
        this.setState({ searchFilter: this.state.items })


        const foundItem = this.state.items.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s  items.isSelected before:', foundItem.isSelected)
        console.log('Edit item.isSelected to false : ', foundItem)
        const index = this.state.items.findIndex(item => item._id === id)
        console.log('the index is :', index)
        console.log('state of items :', this.state.items)
        // console.log('spread :', ...this.state.items)
        console.log('spread index :', this.state.items[index])
        console.log('spread index.isSelected before:', this.state.items[index].isSelected)
        // console.log('spread index.isSelected after:', !this.state.items[index].isSelected)
        var changedItems = this.state.items
        changedItems[index].isSelected = !changedItems[index].isSelected
        // this.setState({ items: changedItems })
        this.setState({ searchFilter: changedItems })

        // localStorage.setItem('cartItems', JSON.stringify(this.state.items))
        localStorage.setItem('cartItems', JSON.stringify(this.state.searchFilter))
        console.log('Items found\'s isSelected after:', this.state.items)

        // // console.log('Item found\'s display after:', foundItem.display)

        // this.clearSearch()

        console.log('end of toggleIsSelected Function')
        return null
    }

    newtoggleIsSelected = (id) => {
        console.log('inside newToggleIsSelected')
        console.log('items state:', this.state.items)
        console.log('searchfilter state:', this.state.searchFilter)

        const foundItem = this.state.items.find(item => item._id === id)
        console.log('Found the item:', foundItem)


        var newVal = this.state.items.map(item => [foundItem].find(o => {
            if (o._id === item._id) {
                foundItem.isSelected = !foundItem.isSelected
                // foundItem.quantity = 1
                return foundItem
            }
        }) || item);

        console.log('newVal:', newVal)
        this.setState({ filteredItems: newVal })
        this.setState({ items: newVal })
        localStorage.setItem("cartItems", JSON.stringify(newVal))
        console.log('end of  newToggleIsSelected')

    }

    resetIsSelected = (id) => {
        // Delete item from the cartItems do setState of cartItems
        console.log('inside the removeAndReset function')
        console.log('delete this id from the cartItems :', id)
        // this.removeItemFromCart(id)
        // console.log('Id removed from the cart check...')

        // Reset the items.isSelected to false
        // find the item in items[] then change isSelected to false
        console.log('items state:', this.state.items)
        const foundItem = this.state.items.find(item => item._id === id)


        console.log('Item found :', foundItem)
        console.log('Item found\'s  items.isSelected before:', foundItem.isSelected)

        console.log('Edit item.isSelected to false : ', foundItem)


        const index = this.state.items.findIndex(item => item._id === id)
        console.log('the index is :', index)

        // console.log('state of items :', this.state.items)
        // console.log('spread :', ...this.state.items)
        console.log('spread index :', this.state.items[index])
        console.log('spread index.isSelected before:', this.state.items[index].isSelected)
        // console.log('spread index.isSelected after:', !this.state.items[index].isSelected)

        var changedItems = this.state.items
        changedItems[index].isSelected = false

        this.setState({ items: changedItems, searchFilter: this.state.items })

        // this.setState({ filteredItems: changedItems })
        localStorage.setItem("cartItems", JSON.stringify(this.state.items))


        console.log('Items found\'s isSelected after:', this.state.items)
        // // console.log('Item found\'s display after:', foundItem.display)

        console.log('end of resetIsSelected Function')
        return null
    }

    isCheckedValue(id) {
        console.log('check for this id ', id)
        return true
    }

    requestOrder(cartItems) {
        console.log('inside request order function')
        // var cartItems = this.state.items.filter(item => item.isSelected === true)
        // console.log('Approve these items :', cartItems)
        // console.log('post request axios ')
        // console.log('Approve these items[0].name :', approveOrder[0].name)

        // var objNames = approveOrder.forEach(item => console.log(item.name))
        // console.log(approveOrder.map(item => { item.name, item.price }))

        // const approveOrder = cartItems.map(item => (
        //     {
        //         id: item._id,
        //         name: item.name,
        //         price: item.price,
        //         measured: item.measured,
        //         quantity: 1,
        //     }
        // ));

        // console.log(approveOrder)
        // console.log(Array.isArray(approveOrder))
        // console.log('stringify:', JSON.stringify(approveOrder))

        console.log('Approve these items :', cartItems)
        var desiredCartItems = cartItems.filter(item => item.quantity > 0)
        localStorage.setItem('orderItems', JSON.stringify(desiredCartItems))

        console.log('fetching all order items', localStorage.getItem('orderItems'))
        console.log('items are array ?:', Array.isArray(JSON.parse(localStorage.getItem('orderItems'))))

    }

    handleChange = (e) => {
        console.log('Inside handleChange')
        console.log('e.target:', e.target)
        console.log('e.target.value:', e.target.value)
        console.log('this.state.items:', this.state.items)
        console.log('this.state.items filtered:', this.state.items.filter(item => item.name.includes(e.target.value)))

        let searchFilter = this.state.items.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        this.setState({ searchFilter })

    }

    handleSelect(e) {
        console.log('You changed the select option')
        console.log('Value is:', e.target.value)

        this.setState({
            searchFilter:
                this.state.items.filter(item => item.category.includes(e.target.value.toLowerCase()))
        })



    }

    clearSearch() {
        console.log("clear search button clicked!")
        // this.handleChange(document.getElementById("inputSearch"))
        this.setState({
            searchFilter: this.state.items
        })
        console.log(document.getElementById("inputSearch"))
        console.log(document.getElementById("filterItems").value = "all")
        document.getElementById("inputSearch").value = ""
        document.getElementById("filterItems").value = "all"
    }
    render() {
        return (
            <div>
                <Header />
                {this.state.userType === "Admin" ? (
                    <>
                        <h2 style={{ "textAlign": "center" }}>Welcome - {this.state.username} you are - {this.state.userType}</h2>
                        <button id="ShowButton" onClick={() => {
                            var navBarElement = document.getElementById("Nav-bar")
                            navBarElement.style.display = "block"

                            var showElement = document.getElementById("ShowButton")
                            showElement.style.display = "none"

                        }}>Show</button>
                        <button id="ShowButton" onClick={() => {
                            if (localStorage.getItem("cartItems")) {
                                JSON.parse(localStorage.getItem("cartItems")).forEach(item => {
                                    this.resetIsSelected(item._id)
                                })
                                localStorage.removeItem("cartItems")
                            }
                        }}>Clear Local</button>
                    </>
                ) : null
                }
                <div style={{ "display": "flex" }}>
                    <NavigationBar />
                    <div className="Menu-Cart" >
                        <div className="inner-Menu" >
                            {/* <div style={{
                             "backgroundColor": "#dbc268", 'color': "green", "border-radius": "5px", "padding": "10px", "fontWeight": "bold", "fontSize": "20px", "marginBottom": "10px"
                            }}>
                            <Toast delay={300} autohide>
                                <ToastBody>
                                    Your enquiry is submitted successfully , you can view the status by clicking <Link to='/myOrders'>here</Link>
                                </ToastBody>
                            </Toast>
                            </div> */}
                            <h1 id="Menu-style">Choose Your Menu</h1>

                            <div id="filteringOptions">
                                <input onChange={this.handleChange} value={this.inputSearch} name="inputSearch" id="inputSearch" placeholder="Search your item" />

                                {/* <h2 style={{ "fontSize": "22px", "display": "inline-block" }}>Filter Items </h2> */}

                                <select onChange={this.handleSelect}
                                    style={{
                                        "fontSize": "22px",
                                        "padding": "10px",
                                        "width": "160px",
                                        "marginLeft": "10px",
                                        "borderRadius": "10px",
                                        "backgroundColor": "#dbc268"
                                    }}

                                    id="filterItems"
                                >
                                    <option value="all">All</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="sweets">Sweets</option>
                                    <option value="snacks">Snacks</option>
                                    <option value="special">Special</option>
                                </select>
                                <button style={{ "padding": "12px", "cursor": "pointer", "backgroundColor": "#dbc268", "marginLeft": "30px", "borderRadius": "10px" }} onClick={this.clearSearch}>Clear Filters</button>
                            </div>
                            <Stepper className="stepper-color"
                                steps={[{ label: 'Select Items' }, { label: 'Enter Quantity' }, { label: 'Submit Enquiry' }]}
                                activeStep={0}
                            />
                            <hr style={{ "height": "10px" }} />
                            {this.state.spinnerLoading ? (
                                <LoadingSpinner LoadingSpinner={this.state.spinnerLoading} />
                            )
                                :
                                (
                                    <div id="menu-container">
                                        <div id="display-cards-container">
                                            {/* total length -{this.state.searchFilter.length} */}
                                            {this.state.searchFilter.length === 0 ? (
                                                <div style={{ "textAlign": "center", "width": "100%" }}>
                                                    <h1 style={{ "color": "red" }}>This item could not be found, please search another dish</h1>
                                                    <img src={noItemFound} alt="no-item-found" width="60%" height="60%" />
                                                    <br />
                                                    <br />
                                                    <br />
                                                </div>
                                            ) : (
                                                this.state.searchFilter.map((item, i) => {
                                                    return (
                                                        <div key={i} className="card-style" onClick={() => {
                                                            this.newCheckboxChange(item)
                                                        }}>
                                                            <div className="card-body-style">
                                                                <div style={{ "height": "150px", "width": "100%" }}>

                                                                    <img src={`/images/food-item-images/${item.imgUrl}`} alt={item.name + " image"} id="imageStyling" />

                                                                    {/* <img src={item.imgUrl} alt={item.name + " image"} id="imageStyling" /> */}
                                                                    <img src={cardCurve} width="305px" height="148px" alt="" style={{ "position": "relative", "left": "-7px" }} />
                                                                </div>
                                                                <div className="contents">
                                                                    <h1 className="itemName" style={{ "textAlign": "center" }}>{item.name}</h1>
                                                                    <input type="checkbox" id="checkBoxStyling" checked={item.isSelected} onChange={() => { }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                        <br />
                                    </div>
                                )}
                        </div>
                        <CartModel buttonLabel={`Cart - ${this.state.items.filter(item => item.isSelected).length}`}
                            resetIsSelected={this.resetIsSelected}
                            requestOrder={this.requestOrder}
                        />
                    </div >
                </div>

                <div style={{
                    "marginTop": "30px",
                    "textAlign": "center",
                    "color": "#dbc268",
                    "backgroundColor": "#353535"
                }}>
                    © Copyrights Reserved 2021
                </div>
            </div >
        );
    }
}