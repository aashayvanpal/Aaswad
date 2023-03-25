import React, { useState, useEffect } from 'react'
import ShowBtn from '../assets/ShowBtn'
import NavigationBar from './NavigationBar'
import axios from 'axios'
import LoadingSpinner from './LoadingSpinner'


const Dashboard = () => {
    const [orders, setOrders] = useState([])
    const [approves, setApproves] = useState([])
    const [confirms, setConfirms] = useState([])
    const [completed, setCompleted] = useState([])

    const [items, setItems] = useState([])
    const [itemsDisplay, setItemsDisplay] = useState([])
    const [loading, setLoading] = useState(true)


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
    }, [1])

    return (
        <div>
            <h1>This is dashboard</h1>
            <NavigationBar />

            <ShowBtn />
            {loading ? (<div>
                <h1>Orders</h1>
                <div style={{ display: "inline-flex" }}>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Total orders : {orders.length}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Approve orders :{approves.length}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Confirmed orders :{confirms.length}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Completed orders :{completed.length}</h2>
                    </div>
                </div>
                <h1>Items</h1>
                <div style={{ display: "inline-flex" }}>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Total items : {items.length}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Displaying items : {itemsDisplay.length}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Non-Displaying items : {items.length - itemsDisplay.length}</h2>
                    </div>
                </div>
                <h1>Multi Date Orders</h1>
                <div style={{ display: "inline-flex" }}>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Total orders : {}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Approve orders :{}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Confirmed orders :{}</h2>
                    </div>
                    <div style={{ border: "2px solid black", borderRadius: "5px", margin: "10px", textAlign: "center" }}>
                        <h2>Completed orders :{}</h2>
                    </div>
                </div>

            </div>) : (<LoadingSpinner />)}
        </div>
    )

}
export default Dashboard
