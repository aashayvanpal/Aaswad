import React, { useState, useEffect, createContext } from "react"
import { Accordion } from 'react-bootstrap';
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import Menu from './Menu.js'
import _ from 'lodash'
import '../css/MultiDateOrders.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import VisibilityContext from './Context'

export default function MultiDateOrders() {
    const today = new Date()
    const tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)

    const [values, setValues] = useState([today, tomorrow])
    const [dates, setDates] = useState([])
    const [orderType, setOrderType] = useState('Breakfast')
    const [orderDates, setOrderDates] = useState([
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
        }])
    const [finalOrder, setFinalOrder] = useState({})
    const [textvalue, setTextvalue] = useState('no text value')
    const [ShowMultiDateComponent, setShowMultiDateComponent] = useState(true)
    const value = {
        actions: { setShowMultiDateComponent, orderDates, setOrderDates, setTextvalue }
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

    const confirmDate = (mealType, date, i) => {
        // props.showMenuComponent(false)
        console.log('confirmDate:', mealType, date, i)
        // const verifyItems = ['item1', 'item2', 'item3', 'new item4']

        // setup localstorage for settings
        const index = dates.indexOf(date)
        localStorage.setItem('bulkOrderSetting', JSON.stringify([date, mealType, index]))
        console.log('orderDates state:', orderDates)
        console.log('date present at:', index)
        console.log('date:', Object.keys(orderDates[index])[0])

        // after proceed is clicked setItem for selectedItems
        // orderDates[index][date][mealType] = { items: verifyItems } //correct way 
        // orderDates[index][date][mealType] = { items: verifyItems }
        // const newOrder = [...orderDates]
        // setOrderDates(newOrder)

    }

    const confirmDate2 = (mealType, date, i) => {
        console.log('confirmDate:', mealType, date, i)
        // const verifyItems = ['item1', 'item2', 'item3', 'new item4']
        const verifyItems = JSON.parse(localStorage.getItem('cartItems'))

        const index = dates.indexOf(date)
        console.log('orderDates state:', orderDates)
        console.log('date present at:', index)
        console.log('date:', Object.keys(orderDates[index])[0])

        // orderDates[index][date][mealType] = { items: verifyItems } //correct way 
        orderDates[index][date][mealType] = { items: verifyItems }
        const newOrder = [...orderDates]
        setOrderDates(newOrder)

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
                                                {/* {order3.customer.fullName} */}

                                            </strong >

                                            {orderType} for {date} < br />
                                            {textvalue} - {}
                                            {!(orderDates[i][date][orderType].items.length != 0) ? ("no items found") : ("items found")}
                                            {/* {orderDates[i][date][orderType].items.map(item => <div key={item}>{item}<br /></div>)} */}
                                            {orderDates[i][date][orderType].items.map(item => <div key={item.name}>{item.name}<br /></div>)}

                                            {/* Working here , must change to functional components for easier use */}
                                            <button onClick={() => {
                                                setShowMultiDateComponent(false)
                                                confirmDate(orderType, date, i)
                                            }}>Add items</button>
                                            <button onClick={() => confirmDate2(orderType, date, i)}>Sample</button>
                                            <button onClick={() => console.log('confirm clicked')}>Confirm</button>
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
                        </div >
                    </div >
                ) : (
                    <Menu />
                )}
            </div >
        </VisibilityContext.Provider>
    )
}