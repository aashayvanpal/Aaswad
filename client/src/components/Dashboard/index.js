import React, { useState, useEffect } from 'react'
import ShowBtn from '../../assets/ShowBtn'
import NavigationBar from '../NavigationBar'
import axios from 'axios'
import LoadingSpinner from '../LoadingSpinner'
import { getMultiOrders } from '../../apis/multiOrders'
import { Link } from 'react-router-dom'
import { getEventOrders } from '../../apis/eventOrders'
import Doughnut from "./doughnutGraph";
import Pie from "./pieGraph";


const Dashboard = () => {
    const [orders, setOrders] = useState([])
    const [approves, setApproves] = useState([])
    const [confirms, setConfirms] = useState([])
    const [completed, setCompleted] = useState([])
    const [itemsData, setItemsData] = useState([])


    const generateItemsData = () => [
        { name: 'Displaying', value: Math.round(itemsDisplay.length * 100 / items.length) },
        { name: 'non-displaying', value: Math.round((items.length - itemsDisplay.length) * 100 / items.length) },
    ]

    const generateData = () => [
        { name: 'approves', value: Number(Math.round((approves.length * 100) / orders.length)) },
        { name: 'confirmed', value: Number(Math.round((confirms.length * 100) / orders.length)) },
        { name: 'completed', value: Number(Math.round((completed.length * 100) / orders.length)) }
    ]


    // const generateMultiDateData = () => [
    //     { name: 'approves', value: (totalApprovedOrders * 100) / totalMultiOrders },
    //     { name: 'confirmed', value: Math.round((totalConfirmedOrders * 100) / totalMultiOrders) },
    //     { name: 'completed', value: Math.round((totalCompletedOrders * 100) / totalMultiOrders) }
    // ]
    const generateMultiDateData = () => [
        { name: 'approves', value: (totalApprovedOrders * 100) / totalMultiOrders },
        { name: 'confirmed', value: (totalConfirmedOrders * 100) / totalMultiOrders },
        { name: 'completed', value: (totalCompletedOrders * 100) / totalMultiOrders }
    ]



    const [items, setItems] = useState([])
    const [itemsDisplay, setItemsDisplay] = useState([])
    const [loading, setLoading] = useState(true)

    const [totalMultiOrders, setTotalMultiOrders] = useState([])
    const [totalCompletedOrders, setTotalCompletedOrders] = useState(0)
    const [totalApprovedOrders, setTotalApprovedOrders] = useState(0)
    const [totalConfirmedOrders, setTotalConfirmedOrders] = useState(0)
    const [ordersData, setOrdersData] = useState([]);
    const [multiDateData, setMultiDateData] = useState([]);
    const [eventOrdersData, setEventOrdersData] = useState([]);
    const [eventOrdersDropdownValues, setEventOrdersDropDownValues] = useState([])


    const getMultiOrdersData = async () => {
        const multiorders = await getMultiOrders()
        const completedOrders = multiorders.data.filter(order => order.status === 'completed')
        const approveOrders = multiorders.data.filter(order => order.status === 'approve')
        const confirmedOrders = multiorders.data.filter(order => order.status === 'confirmed')
        setTotalCompletedOrders(completedOrders.length)
        setTotalApprovedOrders(approveOrders.length)
        setTotalConfirmedOrders(confirmedOrders.length)
        setTotalMultiOrders(multiorders.data.length) //number


    }

    // const getTotalApprove = async () => {
    //     const multiorders = await getMultiOrders()
    //     setTotalMultiOrders(multiorders.data.length)
    // }

    const getEventOrdersData = async () => {
        // eventOrders api call here
        const response = await getEventOrders()
        const eventOrders = response.data
        setEventOrdersDropDownValues(eventOrders)

        console.log("Event Orders i need ", eventOrders)
    }

    const getFilter = (eventOrdersData, status) => {
        return eventOrdersData.filter(order => order.status === status)
    }

    const changeEventOrder = (value) => {
        const eventOrdersData = eventOrdersDropdownValues.filter(dropvalue => dropvalue._id === value)[0].orders
        console.log("eventOrdersData", eventOrdersData)
        const approves = getFilter(eventOrdersData, 'approve')
        const confirmes = getFilter(eventOrdersData, 'confirmed')
        const completed = getFilter(eventOrdersData, 'completed')
        console.log('approves', approves)
        console.log('confirmes', confirmes)
        console.log('completed', completed)

        const eventOrderUIData = {
            totalEventOrders: eventOrdersData.length,
            approved: approves.length,
            confirmed: confirmes.length,
            completed: completed.length,
        }
        setEventOrdersData(eventOrderUIData)
    }


    useEffect(() => {
        console.log('inside use effect')

        setTimeout(() => setLoading(true), 3000)

        axios.get('/api/orders', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                // console.log('Data : ', response.data)
                const orders = response.data
                console.log('orders after request :', orders)
                setOrders(orders)
                // filter for approve 
                const approves = orders.filter(order => order.status === 'approve')
                console.log('approves filtered:', approves)
                setApproves(approves)
                // filter for confirmed 
                const confirms = orders.filter(order => order.status === 'confirmed')
                console.log('confirms filtered:', confirms)
                setConfirms(confirms)


                // filter for completed 
                const completed = orders.filter(order => order.status === 'completed')
                console.log('completed filtered:', completed)
                setCompleted(completed)

                setOrdersData(...generateData())
                setLoading(false)
            })

            .catch(err => {
                console.log(err)
            })

        axios.get('/api/items', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                // console.log('Data : ', response.data)
                const items = response.data
                console.log('items after request :', items)
                setItems(items)
                const DisplayingCount = items.filter(item => item.display === true)
                setItemsDisplay(DisplayingCount)
                // console.log("generated Data for pie items", generateItemsData());

                setItemsData(generateItemsData())
            })
            .catch(err => {
                console.log(err)
            })

        getMultiOrdersData()


        getEventOrdersData()

    }, [])

    useEffect(() => {
        setOrdersData(generateData())
    }, [completed])

    useEffect(() => {
        setItemsData(generateItemsData())
    }, [itemsDisplay])

    useEffect(() => {
        setMultiDateData(generateMultiDateData())

    }, [totalMultiOrders])

    return (
        <div>

            <ShowBtn />
            <button style={{ backgroundColor: "purple", color: "white" }}>Backup = opens modal to backup all database into json </button>
            <br />
            Chart
            <br />
            most ordered item statistics
            <br />
            customer with most order statistics
            <br />
            each customers favourite item ordered
            <br />
            Item wise monthly sales
            <br />
            Maps, circling all frequent orders,with location
            <br />
            <hr />

            Upcoming orders on Calendar , render same calendar from /calendar component
            <br />
            from and to date inpuyt , grab all orders(normal,event,multidate) and render in a div
            <br />
            orders,eventorders,multidate orders line graph with respect to date/month
            <br />
            I need a new pending payments section where only 
            <br />
            <div style={{ display: 'flex', gap: '20px' }}>

                <NavigationBar />
                {loading ? (<div style={{ border: '1px solid black ', borderRadius: '16px', padding: '20px', margin: '20px', width: '100%' }}>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <div style={{ border: '2px solid black', borderRadius: '16px', padding: '20px', width: '650px' }}>
                            <h4 style={{ textAlign: 'center' }}>
                                <Link to='/orders'>
                                    Orders
                                </Link>
                            </h4>
                            <div style={{ display: 'flex' }}>
                                <Pie
                                    data={ordersData}
                                    width={250}
                                    height={250}
                                    innerRadius={120}
                                    outerRadius={100}
                                />
                                <div style={{ display: "" }}>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Total orders : {orders.length}</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Approve orders :{approves.length} ({Math.round((approves.length * 100) / orders.length)}%)</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Confirmed orders :{confirms.length} ({Math.round((confirms.length * 100) / orders.length)}%)</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Completed orders :{completed.length} ({Math.round((completed.length * 100) / orders.length)}%)</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ border: '2px solid black', borderRadius: '16px', padding: '20px', width: '650px' }}>

                            <h4 style={{ textAlign: 'center' }}>
                                <Link to='/items'>
                                    Items
                                </Link>
                            </h4>
                            <div style={{ display: 'flex' }}>
                                <Doughnut
                                    data={itemsData}
                                    width={250}
                                    height={250}
                                    innerRadius={60}
                                    outerRadius={100}

                                />

                                <div style={{}}>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Total items : {items.length}</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Displaying items : {itemsDisplay.length}  {Math.round((itemsDisplay.length * 100) / items.length)} % </h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Non-Displaying items : {items.length - itemsDisplay.length} {Math.round(((items.length - itemsDisplay.length) * 100) / items.length)} % </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ border: '2px solid black', borderRadius: '16px', padding: '20px', width: '650px' }}>

                            <h4 style={{ textAlign: 'center' }}>
                                <Link to='/multiOrders'>
                                    Multi Date Orders
                                </Link>
                            </h4>
                            <div style={{ display: 'flex' }}>
                                <Pie
                                    data={multiDateData}
                                    width={250}
                                    height={250}
                                    innerRadius={120}
                                    outerRadius={100}
                                />
                                <div style={{}}>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Total orders : {totalMultiOrders}</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Approve orders :{totalApprovedOrders} ({Math.round((totalApprovedOrders * 100) / totalMultiOrders)}%)</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Confirmed orders :{totalConfirmedOrders} ({Math.round((totalConfirmedOrders * 100) / totalMultiOrders)}%)</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Completed orders :{totalCompletedOrders} ({Math.round((totalCompletedOrders * 100) / totalMultiOrders)}%)</h4>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div style={{ border: '2px solid black', borderRadius: '16px', padding: '20px', width: '650px' }}>
                            <div style={{ display: 'flex' }}>
                                <h4 style={{ textAlign: 'center' }}>
                                    <Link to='/eventOrders'>
                                        Event Orders
                                    </Link>
                                </h4>
                                This section should have another stats for completed payments with the total earnings and yet to be paid section in same pie chart
                                <select onChange={(e) => changeEventOrder(e.target.value)}>
                                    <option>default</option>
                                    {eventOrdersDropdownValues.map(event => <option value={event._id}>{event.eventName} - {event.eventDate}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex' }}>
                                <Doughnut
                                    data={[{ name: '1', value: Math.round((eventOrdersData.approved * 100) / eventOrdersData.totalEventOrders) },
                                    { name: '1', value: Math.round((eventOrdersData.confirmed * 100) / eventOrdersData.totalEventOrders) },
                                    { name: '1', value: Math.round((eventOrdersData.completed * 100) / eventOrdersData.totalEventOrders) }]}
                                    width={250}
                                    height={250}
                                    innerRadius={60}
                                    outerRadius={100}
                                />
                                <div style={{}}>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Total event orders : { } {eventOrdersData.totalEventOrders}</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Approve orders :{eventOrdersData.approved} ({Math.round((eventOrdersData.approved * 100) / eventOrdersData.totalEventOrders)}%)</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Confirmed orders :{eventOrdersData.confirmed} ({Math.round((eventOrdersData.confirmed * 100) / eventOrdersData.totalEventOrders)}%)</h4>
                                    </div>
                                    <div style={{ border: "2px solid black", borderRadius: "32px", padding: '5px', margin: '10px', textAlign: "center" }}>
                                        <h4>Completed orders :{eventOrdersData.completed} ({Math.round((eventOrdersData.completed * 100) / eventOrdersData.totalEventOrders)}%)</h4>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div style={{ border: '2px solid black', borderRadius: '16px', padding: '20px', width: '650px' }}>

                            <h4 style={{ textAlign: 'center' }}>
                                <Link to='/customers'>
                                    Customers
                                </Link>
                            </h4>
                            <div style={{}}>
                                <Pie
                                    data={[{ name: 'person1', value: 20 },
                                    { name: 'person2', value: 20 },
                                    { name: 'person3', value: 20 },
                                    { name: 'person4', value: 20 },
                                    { name: 'person5', value: 20 }]}
                                    width={250}
                                    height={250}
                                    innerRadius={120}
                                    outerRadius={100}
                                />
                                targeting customers by sales

                            </div>
                        </div>
                    </div>


                </div>) : (<LoadingSpinner />)}
            </div>

        </div >
    )

}
export default Dashboard
