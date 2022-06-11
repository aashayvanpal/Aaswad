import React, { useState, useEffect } from "react"
import { Accordion } from 'react-bootstrap';
import DatePicker from "react-multi-date-picker"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import _ from 'lodash'
import { Link } from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

export default function MultiDateOrders() {
    const today = new Date()
    const tomorrow = new Date()

    tomorrow.setDate(tomorrow.getDate() + 1)

    const [values, setValues] = useState([today, tomorrow])
    const [dates, setDates] = useState([])
    const [orderType, setOrderType] = useState('Breakfast')
    const [orderDates, setOrderDates] = useState([])
    const [finalOrder, setFinalOrder] = useState({})

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
        console.log('confirmDate:', mealType, date, i)
        const verifyItems = ['item1', 'item2', 'item3', 'new item4']

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
        <div>
            Select your dates<br />

            name<br />
            email<br />
            phone number<br />
            address<br />
            Dates :<DatePicker
                multiple
                sort
                value={values}
                plugins={[
                    <DatePanel />]}
                onChange={selectedDates}
            />


            {/* {dates.map(date => <li>{date} - {order3.customer.fullName}</li>)} */}


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
                                        <li onClick={() => dayNavigation('Breakfast', date, i)}>Breakfast</li>
                                        <li onClick={() => dayNavigation('Lunch', date, i)}>Lunch</li>
                                        <li onClick={() => dayNavigation('Dinner', date, i)}>Dinner</li>
                                    </ul>
                                    {/* {order3.customer.fullName} */}

                                </strong>

                                {orderType} for {date} <br />

                                {!(orderDates[i][date][orderType].items.length != 0) ? ("no items found") : ("items found")}
                                {orderDates[i][date][orderType].items.map(item => <div key={item}>{item}<br /></div>)}

                                {/* Working here , must change to functional components for easier use */}
                                <Link to="/menu">
                                    <button onClick={() => confirmDate(orderType, date, i)}>Add items</button>
                                </Link>
                                <button onClick={() => confirmDate(orderType, date, i)}>Sample</button>
                                <button onClick={() => console.log('confirm clicked')}>Confirm</button>
                            </Accordion.Body>
                        </Accordion.Item>
                    )}
                </Accordion>
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
            </div >
        </div >
    )
}