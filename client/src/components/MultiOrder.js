import axios from '../config/axios.js'
import React, { useState, useEffect } from 'react'
import confirm from 'reactstrap-confirm'
import { Link } from 'react-router-dom'

const MultiOrder = () => {

    const [orders, setOrders] = useState([])

    useEffect(() => {
        //  get request to display all multi orders
        axios.get('/multiOrders', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                // console.log('Data : ', response.data)
                const orders = response.data

                console.log('fetching all multiOrders :', orders)
                setOrders(orders)

                // // filter for approve 
                // const approves = orders.filter(order => order.status === 'approve')
                // console.log('approves filtered:', approves)
                // setApproves(approves)

                // // filter for confirmed 
                // const confirmed = orders.filter(order => order.status === 'confirmed')
                // console.log('confirmed filtered:', confirmed)
                // setConfirmed(confirmed)

                // // filter for completed 
                // const completed = orders.filter(order => order.status === 'completed')
                // console.log('completed filtered:', completed)
                // setCompleted(completed)

                // console.log('approves state:', approves)
            })
            .catch(err => {
                console.log(err)
            })
        // setting state for multiorders

    }, [])


    const handleRemoveOrder = async (id, name) => {
        console.log('remove this id:', id)
        console.log('remove this name:', name)

        // add confirmation here
        let result = await confirm({
            title: (
                <div style={{ "color": "black", "fontWeight": "bold" }}>
                    Delete Order Confirmation
                </div>
            ),
            message: (
                <div style={{ "color": "green" }}>
                    Are you sure you want to delete : {name}??
                </div>
            ),
            confirmText: "Delete",
            confirmColor: "warning",
            cancelColor: "link text-danger",
            classNames: 'confirmModal'
        })
        console.log("result is :", result)

        if (result) {
            console.log('delete here')


            // // DELETE Request
            axios.delete(`/multiOrders/${id}`, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    console.log('response data', response.data)

                    // setApproves(approves.filter(item => item._id !== response.data._id))

                    // setConfirmed(confirmed.filter(item => item._id !== response.data._id))

                    // setCompleted(completed.filter(item => item._id !== response.data._id))

                    setOrders(orders.filter(item => item._id !== response.data._id))

                })
                .catch((err) => {
                    console.log('there is an error!', err)
                })

        } else { console.log('dont delete the order') }

    }
    return (
        <div>

            Approve orders - {orders.length}
            <table>
                <thead>
                    <tr>
                        <td>Sl no</td>
                        <td>Name</td>
                        <td>options</td>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, i) => {
                        const { fullName } = order.customer
                        // console.log(order.orderDates)
                        var keys = Object.keys(order.orderDates);
                        return (<tr key={order._id}>
                            <td>{i + 1}.</td>
                            <td>
                                <Link to={`/multiorders/${order._id}`}>{fullName}</Link><br />
                                <div>
                                    {order.orderDates.map(o => {
                                        return (
                                            <div key={Object.keys(o)}>{Object.keys(o)}</div>
                                        )
                                    })}<br />
                                </div>
                            </td>
                            <td>
                                <button>approve</button>
                                <button onClick={() => handleRemoveOrder(order._id, fullName)}>delete</button>
                            </td>
                        </tr>)
                    })}


                </tbody>
            </table>


            Confirmed orders - {orders.length}
            Completed orders - {orders.length}

        </div>
    )
}

export default MultiOrder