import React, { useState, useEffect } from 'react'
import ShowBtn from '../assets/ShowBtn'
import NavigationBar from './NavigationBar'
import axios from 'axios'
import LoadingSpinner from './LoadingSpinner'
import { getMultiOrders } from '../apis/multiOrders'


const Dashboard = () => {
    const [orders, setOrders] = useState([])
    const [approves, setApproves] = useState([])
    const [confirms, setConfirms] = useState([])
    const [completed, setCompleted] = useState([])

    const [items, setItems] = useState([])
    const [itemsDisplay, setItemsDisplay] = useState([])
    const [loading, setLoading] = useState(true)

    const [totalMultiOrders, setTotalMultiOrders] = useState([])
    const [totalCompletedOrders, setTotalCompletedOrders] = useState(0)
    const [totalApprovedOrders, setTotalApprovedOrders] = useState(0)
    const [totalConfirmedOrders, setTotalConfirmedOrders] = useState(0)



    const getMultiOrdersData = async () => {
        const multiorders = await getMultiOrders()
        setTotalMultiOrders(multiorders.data.length)
        const completedOrders = multiorders.data.filter(order => order.status === 'completed')
        const approveOrders = multiorders.data.filter(order => order.status === 'approve')
        const confirmedOrders = multiorders.data.filter(order => order.status === 'confirmed')
        setTotalCompletedOrders(completedOrders.length)
        setTotalApprovedOrders(approveOrders.length)
        setTotalConfirmedOrders(confirmedOrders.length)

    }

    // const getTotalApprove = async () => {
    //     const multiorders = await getMultiOrders()
    //     setTotalMultiOrders(multiorders.data.length)
    // }

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

            })
            .catch(err => {
                console.log(err)
            })

        getMultiOrdersData()
        // getTotalApprove()
        // getTotalConfirmed()
        // getTotalCompleted()
    }, [])


    return (
        <div>

            <ShowBtn />
            <button style={{ backgroundColor: "purple", color: "white" }}>Backup = opens modal to backup all database into json </button>

            <div style={{ display: 'flex', gap: '20px' }}>

                <NavigationBar />
                {loading ? (<div style={{ border: '1px solid black ', borderRadius: '16px', padding: '20px', margin: '20px', width: '100%' }}>
                    <h1>Orders</h1>
                    <div style={{ display: "inline-flex" }}>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Total orders : {orders.length}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Approve orders :{approves.length}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Confirmed orders :{confirms.length}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Completed orders :{completed.length}</h2>
                        </div>
                    </div>
                    <h1>Items</h1>
                    <div style={{ display: "inline-flex" }}>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Total items : {items.length}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Displaying items : {itemsDisplay.length}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Non-Displaying items : {items.length - itemsDisplay.length}</h2>
                        </div>
                    </div>
                    <h1>Multi Date Orders</h1>
                    <div style={{ display: "inline-flex" }}>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Total orders : {totalMultiOrders}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Approve orders :{totalApprovedOrders}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Confirmed orders :{totalConfirmedOrders}</h2>
                        </div>
                        <div style={{ border: "2px solid black", borderRadius: "32px", padding: '20px', margin: '10px', textAlign: "center" }}>
                            <h2>Completed orders :{totalCompletedOrders}</h2>
                        </div>
                    </div>
                    <h1>Event Orders</h1>


                </div>) : (<LoadingSpinner />)}
            </div>

        </div>
    )

}
export default Dashboard
