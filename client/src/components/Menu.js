import React, { useState, useEffect } from 'react'
import axios from '../config/axios'
import CartModel from './CartModel.js'
import cardCurve from '../images/item-curve.svg'
import noItemFound from '../images/no-item-found.svg'
import LoadingSpinner from './LoadingSpinner.js'
import '../css/app-css.css'
import { Stepper } from 'react-form-stepper'
import { getUserDetails } from '../assets/user-functions.js'
import NavigationBar from './NavigationBar'
import { Alert, Button } from 'reactstrap';
import { Link } from 'react-router-dom'
import ShowBtn from '../assets/ShowBtn'
import clearIcon from '../images/clear-icon.png'
import '../css/AdminCart.css'

// for loading from google images :(not working) 
// <img src={`https://photos.google.com/share/AF1QipMK9yJs7N52kZcsS17jVq8mvLsi3NPhGkyrGv3IUhDOx0WbPcW5-ZVmPnj0MvTg_A${item.imgUrl}`} alt={item.name + " image"} id="imageStyling" /> */}


// Use this as replacement v1.0.4 :problem of image loading dynamically is solved
// <img src={`/images/food-item-images/${item.imgUrl}`} alt={item.name + " image"} id="imageStyling" />


const Menu = () => {
    const [items, setItems] = useState([])
    const [searchFilter, setSearchFilter] = useState([])
    const [inputSearch, setInputSearch] = useState('')
    const [username, setUserName] = useState('')
    const [userType, setUserType] = useState(false)
    const [isFavourite, setIsFavourite] = useState(false)
    const [spinnerLoading, setSpinnerLoading] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    // const [cartItems, setCartItems] = useState([])
    // const [showItemQtyBar, setShowItemQtyBar] = useState(false)

    useEffect(() => {
        // Do a get request to /account to get user name , add x-auth as header to it
        // just set the token in localStorage and get it in x-auth , the code is working fine,,,

        getUserDetails()
            .then(res => {
                console.log("user data inside component did mount new :", res)
                setUserName(res.username)
                setUserType(res.userType)
                getUserMenu()

            })
            .catch(err => {
                console.log(err)
                window.alert('Please login ,you will be redirected')
                window.location.href = '/signin'
            })
    }, [])

    const favouriteHandle = () => {
        setIsFavourite(true)
        console.log('Favourite button was clicked!')
        console.log("I got updated! ")
        console.log("Favourite :", isFavourite)
    }

    // const CartRemoveHandle = () => {
    //     console.log('Remove from Cart button was clicked!')
    //     setShowItemQtyBar(false)
    // }

    const getUserMenu = () => {
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

                    var oldSelectedItems = JSON.parse(localStorage.getItem("cartItems")).filter(item => items.find(i => item._id === i._id))
                    console.log(oldSelectedItems)
                    setSearchFilter(oldSelectedItems)
                    setItems(oldSelectedItems)
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
                    setItems(filteredItems)
                    setSearchFilter(filteredItems)
                }

                console.log("items:", items)

                setSpinnerLoading(false)

            })
            .catch(err => {
                console.log(err)
            })
    }

    // trying to get the cart rendering with newCheckBoxChange
    const newCheckboxChange = (item) => {
        console.log('inside newCheckBoxChange function', item)
        newtoggleIsSelected(item._id)
    }


    const newtoggleIsSelected = (id) => {
        console.log('inside newToggleIsSelected')
        console.log('items state:', items)
        console.log('searchfilter state:', searchFilter)

        const foundItem = items.find(item => item._id === id)
        console.log('Found the item:', foundItem)


        var newVal = items.map(item => [foundItem].find(o => {
            if (o._id === item._id) {
                foundItem.isSelected = !foundItem.isSelected
                // foundItem.quantity = 1
                return foundItem
            }
        }) || item);

        console.log('newVal:', newVal)
        // setFilteredItems(newVal)
        setItems(newVal)
        localStorage.setItem("cartItems", JSON.stringify(newVal))
        console.log('end of  newToggleIsSelected')

    }


    const resetIsSelected = (id) => {
        // Delete item from the cartItems do setState of cartItems
        console.log('inside the removeAndReset function')
        console.log('delete this id from the cartItems :', id)
        // this.removeItemFromCart(id)
        // console.log('Id removed from the cart check...')

        // Reset the items.isSelected to false
        // find the item in items[] then change isSelected to false
        console.log('items state:', items)
        const foundItem = items.find(item => item._id === id)

        console.log('Item found :', foundItem)
        console.log('Item found\'s  items.isSelected before:', foundItem.isSelected)

        console.log('Edit item.isSelected to false : ', foundItem)


        const index = items.findIndex(item => item._id === id)
        console.log('the index is :', index)

        // console.log('state of items :', this.state.items)
        // console.log('spread :', ...this.state.items)
        console.log('spread index :', items[index])
        console.log('spread index.isSelected before:', items[index].isSelected)
        // console.log('spread index.isSelected after:', !this.state.items[index].isSelected)

        var changedItems = items
        changedItems[index].isSelected = false

        setItems([...changedItems])
        setSearchFilter(items)

        // this.setState({ filteredItems: changedItems })
        localStorage.setItem("cartItems", JSON.stringify(items))


        console.log('Items found\'s isSelected after:', items)
        // // console.log('Item found\'s display after:', foundItem.display)

        console.log('end of resetIsSelected Function')
        return null
    }

    const requestOrder = (cartItems) => {
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

    const handleChange = (e) => {
        console.log('Inside handleChange')
        console.log('e.target:', e.target)
        console.log('e.target.value:', e.target.value)
        setInputSearch(e.target.value)
        console.log('this.state.items:', items)
        console.log('this.state.items filtered:', items.filter(item => item.name.includes(e.target.value)))

        let searchFilter = items.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setSearchFilter(searchFilter)

    }

    const handleSelect = (e) => {
        console.log('You changed the select option')
        console.log('Value is:', e.target.value)

        setSearchFilter(items.filter(item => item.category.includes(e.target.value.toLowerCase())))
    }

    const clearSearch = () => {
        console.log("clear search button clicked!")
        // this.handleChange(document.getElementById("inputSearch"))
        setSearchFilter(items)
        setInputSearch('')
        console.log(document.getElementById("inputSearch"))
        console.log(document.getElementById("filterItems").value = "all")
        document.getElementById("inputSearch").value = ""
        document.getElementById("filterItems").value = "all"
    }

    return (
        <div>
            {userType === "Admin" ? (
                <>
                    <h2 style={{ "textAlign": "center" }}>Welcome - {username} you are - {userType}</h2>
                    <ShowBtn />
                    <button id="ShowButton" onClick={() => {
                        if (localStorage.getItem("cartItems")) {
                            JSON.parse(localStorage.getItem("cartItems")).forEach(item => {
                                resetIsSelected(item._id)
                            })
                            localStorage.removeItem("cartItems")
                            localStorage.removeItem("order")
                        }
                    }}>Clear Local</button>
                    <button onClick={() => setShowAlert(true)}>Toast +</button>
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
                                <Toast delay={300} isOpen={this.state.showAlert} autohide>
                                    <ToastBody>
                                        Your enquiry is submitted successfully , you can view the status by clicking <Link to='/myOrders'>here</Link>
                                        <button onClick={() => this.setState({ showAlert: false })}>X</button>
                                    </ToastBody>
                                </Toast>
                            </div> */}
                        <Alert style={{
                            "backgroundColor": "#dbc268", 'color': "green",
                        }} isOpen={showAlert}>
                            Your enquiry is submitted successfully , you can view the status by clicking <Link to='/myOrders'>here</Link>
                            <Button color="danger" style={{
                                "float": "right",
                                "color": "white",
                                "marginTop": "-5px",
                            }} onClick={() => setShowAlert(false)}>X</Button>
                        </Alert>
                        <h1 id="Menu-style">Choose Your Menu</h1>

                        <div id="filteringOptions">
                            <input onChange={handleChange} value={inputSearch} name="inputSearch" id="inputSearch" placeholder="Search your item" />

                            {/* <h2 style={{ "fontSize": "22px", "display": "inline-block" }}>Filter Items </h2> */}

                            <select onChange={handleSelect}
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
                            <button style={{ "padding": "12px", "cursor": "pointer", "backgroundColor": "#dbc268", "marginLeft": "30px", "borderRadius": "10px" }} onClick={clearSearch}>
                                <img src={clearIcon} alt="" width="30px" height="30px" />
                                Clear Filters</button>
                        </div>
                        <Stepper className="stepper-color"
                            steps={[{ label: 'Select Items' }, { label: 'Enter Quantity' }, { label: 'Submit Enquiry' }]}
                            activeStep={0}
                        />
                        <hr style={{ "height": "10px" }} />
                        {spinnerLoading ? (
                            <LoadingSpinner LoadingSpinner={spinnerLoading} />
                        )
                            :
                            (
                                <div id="menu-container">
                                    <div id="display-cards-container">
                                        {/* total length -{this.state.searchFilter.length} */}
                                        {searchFilter.length === 0 ? (
                                            <div style={{ "textAlign": "center", "width": "100%" }}>
                                                <h1 style={{ "color": "red" }}>This item could not be found, please search another dish</h1>
                                                <img src={noItemFound} alt="no-item-found" width="60%" height="60%" />
                                                <br />
                                                <br />
                                                <br />
                                            </div>
                                        ) : (
                                            searchFilter.map((item, i) => {
                                                return (
                                                    <div key={i} className="card-style" onClick={() => {
                                                        newCheckboxChange(item)
                                                    }}>
                                                        <div className="card-body-style">
                                                            <div style={{ "height": "150px", "width": "100%" }}>

                                                                <img src={`/images/food-item-images/${item.imgUrl}`} alt={item.name + " image"} id="imageStyling" />

                                                                {/* <img src={item.imgUrl} alt={item.name + " image"} id="imageStyling" /> */}
                                                                <img src={cardCurve} width="305px" height="148px" alt="" style={{ "position": "relative", "left": "-7px" }} />
                                                            </div>
                                                            <div className="contents">
                                                                <h1 className="itemName" style={{ "textAlign": "center", "width": "90%" }}>{i+1}.{item.name}</h1>
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
                    <CartModel
                        buttonLabel={`Cart - ${items.filter(item => item.isSelected).length}`}
                        resetIsSelected={resetIsSelected}
                        requestOrder={requestOrder}
                        userType={userType}
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

export default Menu