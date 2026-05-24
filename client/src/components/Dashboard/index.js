import React, { useState, useEffect } from 'react'
import axios from 'axios'
import LoadingSpinner from '../LoadingSpinner'
import { getMultiOrders } from '../../apis/multiOrders'
import { Link } from 'react-router-dom'
import { getEventOrders } from '../../apis/eventOrders'
import Doughnut from "./doughnutGraph";
import Pie from "./pieGraph";
import {
    Box, Grid, Card, CardContent, Typography,
    Select, MenuItem, FormControl
} from '@mui/material'


const StatBox = ({ children }) => (
    <Box sx={{
        border: '2px solid',
        borderColor: 'grey.700',
        borderRadius: 4,
        p: '5px',
        m: 1,
        textAlign: 'center'
    }}>
        <Typography variant="subtitle1" component="h4" fontWeight="bold">
            {children}
        </Typography>
    </Box>
)


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

            {loading ? (
                <Grid container spacing={3} sx={{ p: 2 }}>

                    {/* Orders */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                                    <Link to='/orders'>
                                        Orders
                                    </Link>
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Pie
                                        data={ordersData}
                                        width={250}
                                        height={250}
                                        innerRadius={120}
                                        outerRadius={100}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <StatBox>Total orders : {orders.length}</StatBox>
                                        <StatBox>Approve orders :{approves.length} ({Math.round((approves.length * 100) / orders.length)}%)</StatBox>
                                        <StatBox>Confirmed orders :{confirms.length} ({Math.round((confirms.length * 100) / orders.length)}%)</StatBox>
                                        <StatBox>Completed orders :{completed.length} ({Math.round((completed.length * 100) / orders.length)}%)</StatBox>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Items */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                                    <Link to='/items'>
                                        Items
                                    </Link>
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Doughnut
                                        data={itemsData}
                                        width={250}
                                        height={250}
                                        innerRadius={60}
                                        outerRadius={100}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <StatBox>Total items : {items.length}</StatBox>
                                        <StatBox>Displaying items : {itemsDisplay.length}  {Math.round((itemsDisplay.length * 100) / items.length)} % </StatBox>
                                        <StatBox>Non-Displaying items : {items.length - itemsDisplay.length} {Math.round(((items.length - itemsDisplay.length) * 100) / items.length)} % </StatBox>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Multi Date Orders */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                                    <Link to='/multiOrders'>
                                        Multi Date Orders
                                    </Link>
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Pie
                                        data={multiDateData}
                                        width={250}
                                        height={250}
                                        innerRadius={120}
                                        outerRadius={100}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <StatBox>Total orders : {totalMultiOrders}</StatBox>
                                        <StatBox>Approve orders :{totalApprovedOrders} ({Math.round((totalApprovedOrders * 100) / totalMultiOrders)}%)</StatBox>
                                        <StatBox>Confirmed orders :{totalConfirmedOrders} ({Math.round((totalConfirmedOrders * 100) / totalMultiOrders)}%)</StatBox>
                                        <StatBox>Completed orders :{totalCompletedOrders} ({Math.round((totalCompletedOrders * 100) / totalMultiOrders)}%)</StatBox>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Event Orders */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                    <Typography variant="h6">
                                        <Link to='/eventOrders'>
                                            Event Orders
                                        </Link>
                                    </Typography>
                                    This section should have another stats for completed payments with the total earnings and yet to be paid section in same pie chart
                                    <FormControl size="small">
                                        <Select
                                            defaultValue=""
                                            onChange={(e) => changeEventOrder(e.target.value)}
                                            displayEmpty
                                            sx={{ minWidth: 150 }}
                                        >
                                            <MenuItem value="">default</MenuItem>
                                            {eventOrdersDropdownValues.map(event => (
                                                <MenuItem key={event._id} value={event._id}>
                                                    {event.eventName} - {event.eventDate}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Doughnut
                                        data={[{ name: '1', value: Math.round((eventOrdersData.approved * 100) / eventOrdersData.totalEventOrders) },
                                        { name: '1', value: Math.round((eventOrdersData.confirmed * 100) / eventOrdersData.totalEventOrders) },
                                        { name: '1', value: Math.round((eventOrdersData.completed * 100) / eventOrdersData.totalEventOrders) }]}
                                        width={250}
                                        height={250}
                                        innerRadius={60}
                                        outerRadius={100}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                        <StatBox>Total event orders : { } {eventOrdersData.totalEventOrders}</StatBox>
                                        <StatBox>Approve orders :{eventOrdersData.approved} ({Math.round((eventOrdersData.approved * 100) / eventOrdersData.totalEventOrders)}%)</StatBox>
                                        <StatBox>Confirmed orders :{eventOrdersData.confirmed} ({Math.round((eventOrdersData.confirmed * 100) / eventOrdersData.totalEventOrders)}%)</StatBox>
                                        <StatBox>Completed orders :{eventOrdersData.completed} ({Math.round((eventOrdersData.completed * 100) / eventOrdersData.totalEventOrders)}%)</StatBox>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Customers */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={3} sx={{ borderRadius: 3, height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                                    <Link to='/customers'>
                                        Customers
                                    </Link>
                                </Typography>
                                <Box>
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
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            ) : (<LoadingSpinner />)}
        </div>
    )

}
export default Dashboard
