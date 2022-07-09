import React, { useState, useEffect, createContext } from "react"
import { Accordion } from 'react-bootstrap';
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import Menu from './Menu.js'
import _ from 'lodash'
import '../css/MultiDateOrders.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import VisibilityContext from './Context'
import axios from "../config/axios.js";

export default function MultiDateOrders() {
    const today = new Date()
    const tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)

    const [values, setValues] = useState([today, tomorrow])
    const [dates, setDates] = useState([])
    const [orderType, setOrderType] = useState('Breakfast')
    const [orderDates, setOrderDates] = useState([])
    const [finalOrder, setFinalOrder] = useState({})
    const [ShowMultiDateComponent, setShowMultiDateComponent] = useState(true)
    const value = {
        actions: { setShowMultiDateComponent, orderDates, setOrderDates }
    };
    useEffect(() => {

        // run state update only if bulkOrders present
        if (localStorage.getItem('bulkOrders')) {
            const orderDates = JSON.parse(localStorage.getItem('bulkOrders'))
            // console.log('useeffect :', orderDates)
            const dates = orderDates.map(date => {
                return Object.keys(date)[0]
            });
            console.log('dates :', dates)
            setValues(dates)


            // working here setting dates and rendering items 
            selectedDates(dates)

        } else {
            console.log('useeffect bulkOrders not found!')
        }
        console.log('debug for orderDates ==========>', orderDates)
    }, [])

    const selectedDates = (dateObjects) => {
        console.log('get all dates :', dateObjects.join().split(','))
        const allDates = dateObjects.join().split(',')
        console.log('check allDates :', allDates)
        setDates(allDates)

        const emptyDates = allDates.map(date =>
        ({
            [date]: {
                'Breakfast': { items: [] },
                'Lunch': { items: [] },
                'Dinner': { items: [] }
            }
        }))

        setOrderDates(emptyDates)
        // if localstorage bulkOrders found -> assign 
        if (localStorage.getItem('bulkOrders')) {
            console.log('bulkOrders present , assign to emptyDates')
            const orderDates = JSON.parse(localStorage.getItem('bulkOrders'))
            const combinedDates = _.merge(emptyDates, orderDates)
            console.log('combined orders check:', combinedDates)
            setOrderDates(combinedDates)

        }
    }


    const dayNavigation = (mealType, date, index) => {
        console.log(mealType, date, index)
        setOrderType(mealType)

    }
    const getUserMenu = (selectedItems) => {
        axios.get('/api/menu', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                const items = response.data
                let filteredItems = items.filter(item => item.display === true)
                filteredItems.forEach(item => {
                    item.isSelected = false
                    item.quantity = 1
                })

                const combinedSelections = _.unionBy(selectedItems, filteredItems, '_id');
                console.log('combinedSelection', combinedSelections)
                localStorage.setItem("cartItems", JSON.stringify(combinedSelections))

            })
            .catch(err => console.log(err))
    }


    const confirmDate = (mealType, date, i) => {
        // props.showMenuComponent(false)
        console.log('confirmDate:', mealType, date, i)

        // setup localstorage for settings
        const index = dates.indexOf(date)
        localStorage.setItem('bulkOrderSetting', JSON.stringify([date, mealType, index]))
        console.log('orderDates state:', orderDates)
        console.log('date present at:', index)
        console.log('date:', Object.keys(orderDates[index])[0])

        // bug fix here
        if (!orderDates[index][date][mealType].items.length == 0) {
            // get all the items 
            // set selected values to localstorage 
            getUserMenu(orderDates[index][date][mealType].items)
        }



        // after proceed is clicked setItem for selectedItems
        // orderDates[index][date][mealType] = { items: verifyItems } //correct way 
    }

    return (
        <VisibilityContext.Provider value={value}>
            <div>
                {ShowMultiDateComponent ? (
                    <div>
                        Select your dates < br />

                        name < br />
                        email < br />
                        phone number < br />
                        address < br />
                        Dates : <DatePicker
                            multiple
                            sort
                            value={values}
                            plugins={[
                                <DatePanel />]}
                            onChange={selectedDates}
                        />
                        {/* {orderDates[0]['2022/07/06'][orderType].items[0].name} */}
                        < div >
                            <Accordion
                                alwaysOpen
                            // open='1'
                            // toggle={function noRefCheck(target) { console.log('toggled target:', target) }}
                            >
                                {dates.map((date, i) =>
                                    <Accordion.Item key={i} eventKey={i} >
                                        <Accordion.Header onClick={() => { console.log('clicked:', date, i) }} targetid={i} style={{ textAlign: 'center' }}>
                                            {date}
                                        </Accordion.Header>
                                        <Accordion.Body accordianid={i} >
                                            <strong>
                                                <ul id="accordion-list">
                                                    <li className="accordion-li" onClick={() => dayNavigation('Breakfast', date, i)}>Breakfast</li>
                                                    <li className="accordion-li" onClick={() => dayNavigation('Lunch', date, i)}>Lunch</li>
                                                    <li className="accordion-li" onClick={() => dayNavigation('Dinner', date, i)}>Dinner</li>
                                                </ul>

                                            </strong >

                                            <h1>{orderType} for {date}</h1> < br />
                                            {!(orderDates[i][date][orderType].items.length != 0) ? (
                                                <h2>no items found<br /></h2>
                                            ) : (
                                                <h2>items found<br />
                                                    <table style={{ textAlign: 'center' }}>
                                                        <thead>
                                                            <tr>
                                                                <td>Sl no</td>
                                                                <td>Name</td>
                                                                <td>Price</td>
                                                                <td>Quantity</td>
                                                                <td>Amount</td>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {orderDates[i][date][orderType].items.map((item, i) =>
                                                                <tr key={item.name}>
                                                                    <td>{i + 1}</td>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.price}</td>
                                                                    <td>{item.quantity}</td>
                                                                    <td>{item.price * item.quantity}</td>
                                                                </tr>)}
                                                        </tbody>
                                                    </table>
                                                    <br />

                                                    <b>Total Amount - {
                                                        orderDates[i][date][orderType].items.reduce((sum, i) => (
                                                            sum += i.quantity * i.price
                                                        ), 0)}
                                                    </b>
                                                    <br />
                                                    <br />

                                                    <button onClick={() => {
                                                        setShowMultiDateComponent(false)
                                                        confirmDate(orderType, date, i)
                                                    }}>Add items</button>
                                                </h2>
                                            )}


                                        </Accordion.Body >
                                    </Accordion.Item >
                                )}
                            </Accordion >
                            <button onClick={() => {
                                console.log('final order:', orderDates)
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

                                // console.log(order)
                            }}>Get final order</button>

                            <button onClick={() => {
                                const defaultOrder = [
                                    {
                                        "2022/07/06": {
                                            "Breakfast": {
                                                "items": [
                                                    {
                                                        "category": [
                                                            "all",
                                                            "breakfast",
                                                            "snacks"
                                                        ],
                                                        "_id": "5f111c8db49da512d92abee5",
                                                        "name": "Dosa",
                                                        "price": 70,
                                                        "imgUrl": "Dosa.jpg",
                                                        "display": true,
                                                        "__v": 0,
                                                        "measured": "plate",
                                                        "isSelected": true,
                                                        "quantity": 3
                                                    }
                                                ]
                                            },
                                            "Lunch": {
                                                "items": []
                                            },
                                            "Dinner": {
                                                "items": []
                                            }
                                        }
                                    },
                                    {
                                        "2022/07/07": {
                                            "Breakfast": {
                                                "items": []
                                            },
                                            "Lunch": {
                                                "items": [
                                                    {
                                                        "category": [
                                                            "all",
                                                            "breakfast",
                                                            "snacks"
                                                        ],
                                                        "_id": "5f111c8db49da512d92abee5",
                                                        "name": "Dosa",
                                                        "price": 70,
                                                        "imgUrl": "Dosa.jpg",
                                                        "display": true,
                                                        "__v": 0,
                                                        "measured": "plate",
                                                        "isSelected": true,
                                                        "quantity": 3
                                                    }
                                                ]
                                            },
                                            "Dinner": {
                                                "items": []
                                            }
                                        }
                                    },
                                    {
                                        "2022/07/08": {
                                            "Breakfast": {
                                                "items": []
                                            },
                                            "Lunch": {
                                                "items": []
                                            },
                                            "Dinner": {
                                                "items": [
                                                    {
                                                        "category": [
                                                            "all",
                                                            "breakfast",
                                                            "snacks"
                                                        ],
                                                        "_id": "5f111c8db49da512d92abee5",
                                                        "name": "Dosa",
                                                        "price": 70,
                                                        "imgUrl": "Dosa.jpg",
                                                        "display": true,
                                                        "__v": 0,
                                                        "measured": "plate",
                                                        "isSelected": true,
                                                        "quantity": 3
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                ]
                                setOrderDates([...defaultOrder])
                                localStorage.setItem('bulkOrders', JSON.stringify(defaultOrder))
                            }}>set default order</button>
                            <button onClick={() => {
                                localStorage.removeItem('bulkOrders')
                            }}>Reset Multi orders</button>
                        </div >
                    </div >
                ) : (
                    <Menu />
                )}
            </div >
        </VisibilityContext.Provider>
    )
}