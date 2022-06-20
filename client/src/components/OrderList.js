import React, { useEffect, useState } from 'react';
import axios from '../config/axios'
import { Link } from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/app-css.css'
import '../css/OrderList.css'
import NavigationBar from './NavigationBar';
import confirm from 'reactstrap-confirm'
import ShowBtn from '../assets/ShowBtn';
import deleteImg from '../images/delete-icon.png'
import approveImg from '../images/approve-icon.png'
import homeDeliveryMan from '../images/home-delivery-man.png'
import serviceGif from '../images/service.gif'
import upArrow from '../images/up-arrow.png'
import downArrow from '../images/down-arrow.png'
import DatePicker from "react-datepicker";

const ItemList = () => {

    const [orders, setOrders] = useState([])
    const [approves, setApproves] = useState([])
    const [completed, setCompleted] = useState([])
    const [confirmed, setConfirmed] = useState([])
    const [startDateFrom, setStartDateFrom] = useState(new Date())
    const [startDateTo, setStartDateTo] = useState(new Date())

    useEffect(() => {
        // get request for all items , filter approves,confirmed and completed
        axios.get('/api/orders', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Data : ', response.data)
                const orders = response.data
                console.log('items after request :', orders)
                setOrders(orders)

                // filter for approve 
                const approves = orders.filter(order => order.status === 'approve')
                console.log('approves filtered:', approves)
                setApproves(approves)

                // filter for confirmed 
                const confirmed = orders.filter(order => order.status === 'confirmed')
                console.log('confirmed filtered:', confirmed)
                setConfirmed(confirmed)

                // filter for completed 
                const completed = orders.filter(order => order.status === 'completed')
                console.log('completed filtered:', completed)
                setCompleted(completed)

                console.log('approves state:', approves)
            })
            .catch(err => {
                console.log(err)
            })
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


            // DELETE Request
            axios.delete(`/orders/${id}`, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    console.log('response data', response.data)

                    setApproves(approves.filter(item => item._id !== response.data._id))

                    setConfirmed(confirmed.filter(item => item._id !== response.data._id))

                    setCompleted(completed.filter(item => item._id !== response.data._id))

                    setOrders(orders.filter(item => item._id !== response.data._id))

                })
                .catch((err) => {
                    console.log(err)
                })

        } else { console.log('dont delete the order') }

    }

    const handleApproveOrder = (id) => {
        console.log('clicked on Approve Button ')
        console.log('Approve this order id: ', id)
        // change status from approve to confirmed
        // you have found the id, you have to get the whole item 
        const foundItem = approves.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s status before:', foundItem.status)

        // console.log('current state id',this.state.items.id[itemToToggle])
        console.log('Edit item : ', foundItem)

        const index = approves.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of approves :', approves)
        console.log('spread :', ...approves)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = approves
        changedItems[index].status = 'confirmed'

        setConfirmed([changedItems[index], ...confirmed])

        setApproves(changedItems.filter(item => item.status === 'approve'))


        console.log('put request for /orders')
        console.log('changedItems[index]:', changedItems[index])
        // put request
        axios.put(`/orders/${changedItems[index]._id}`, changedItems[index], {
            headers: {
                "x-auth": localStorage.getItem('token')
            }
        })
            .then(response => {
                if (response.data.errors) {
                    console.log('Validation Error : ', response.data.errors)
                    window.alert(response.data.message)
                }
                else {
                    console.log('success', response.data)
                    // this.props.history.push(`/items/show/${response.data._id}`)
                    // window.location.href = '/items'

                    // order approved email notification
                    console.log('changed items ', changedItems)
                    axios.post('/sendEmail/orderApproved', {
                        'fullName': changedItems[index].customer.fullName,
                        'email': changedItems[index].customer.email,
                        'phonenumber': changedItems[index].customer.phoneNumber
                    })
                }
            })
    }

    const handleCompleteOrder = (id) => {
        console.log('clicked on Completed Button ')
        console.log('Approve this order id: ', id)
        // change status from approve to confirmed
        // you have found the id, you have to get the whole item 
        const foundItem = confirmed.find(item => item._id === id)
        console.log('Item found :', foundItem)
        console.log('Item found\'s status before:', foundItem.status)

        console.log('Edit item : ', foundItem)


        const index = confirmed.findIndex(item => item._id === id)
        console.log('the index is :', index)

        console.log('state of confirmed :', confirmed)
        console.log('spread :', ...confirmed)
        // console.log('spread index 2:', this.state.items[2])
        // console.log('spread index 2 display before:', this.state.items[2].display)
        // console.log('spread index 2 display after:', !this.state.items[2].display)

        var changedItems = confirmed
        changedItems[index].status = 'completed'

        setCompleted([changedItems[index], ...completed])

        setConfirmed(changedItems.filter(item => item.status === 'confirmed'))


        console.log('put request for /orders')
        console.log('changedItems[index]:', changedItems[index])
        // put request
        axios.put(`/orders/${changedItems[index]._id}`, changedItems[index], {
            headers: {
                "x-auth": localStorage.getItem('token')
            }
        })
            .then(response => {
                if (response.data.errors) {
                    console.log('Validation Error : ', response.data.errors)
                    window.alert(response.data.message)
                }
                else {
                    console.log('success', response.data)
                    // this.props.history.push(`/items/show/${response.data._id}`)
                    // window.location.href = '/items'

                    // order completed email
                    axios.post('/sendEmail/orderCompleted', { 'email': response.data.customer.email })

                }
            })
    }

    // doubt
    const sortAscending = (settingFunction, value) => {
        console.log('settingFunction', settingFunction)
        console.log('value', value)
        const sorted = value.sort(function (a, b) {
            return (a.customer.eventDate > b.customer.eventDate) ? -1 : ((a.customer.eventDate < b.customer.eventDate) ? 1 : 0);
        })
        console.log('sorted', sorted)
        settingFunction([...sorted])
    }

    // doubt
    const sortDescending = (settingFunction, value) => {
        console.log('settingFunction', settingFunction)
        console.log('value', value)
        const sorted = value.sort(function (a, b) {
            return (a.customer.eventDate < b.customer.eventDate) ? -1 : ((a.customer.eventDate > b.customer.eventDate) ? 1 : 0);
        })
        console.log('sorted', sorted)
        settingFunction([...sorted])
    }
    const clearOrderSearch = (id, setFunction, status) => {
        console.log('inside clearOrderSearch')
        // console.log('id', id)
        // console.log(document.getElementById(id))
        document.getElementById(id).value = ''
        const reset = orders.filter(order => order.status === status)
        console.log('resset', reset)
        setFunction(reset)


    }


    const handleDateChange = (date, dateString) => {
        // console.log("Date Changed :", String(date))
        console.log("Date Changed :", date)

        dateString(date)

        console.log('======finding the orders between the dates=====')
        console.log(startDateFrom, startDateFrom.toISOString())
        console.log(startDateTo, startDateTo.toISOString())
        console.log('check completed state here:', completed)


        const completedOrders = orders.filter(order => order.status === 'completed')
        const filteredDateOrders = completedOrders.filter(order => {
            return ((new Date(startDateFrom.toISOString()) <= new Date(order.customer.eventDate)) && (new Date(startDateTo.toISOString()) >= new Date(order.customer.eventDate)))
        })
        console.log('filteredDateOrders:', filteredDateOrders)
        setCompleted(filteredDateOrders)
    };

    return (
        <div>
            <ShowBtn />
            <div style={{ 'display': 'flex' }}>
                <NavigationBar />
                <div style={{ "margin": "10px", "width": "100%" }}>
                    <div className='order-container' style={{ "backgroundColor": "#e3c57e" }}>
                        <h2 style={{ 'textAlign': 'center', marginBottom: '20px', fontWeight: 'bold' }}>Approve orders - {approves.length}</h2>

                        <Table className='table-styling' style={{ "fontWeight": "bold" }}>
                            <caption>
                                {/* <h1>Approve orders - {this.state.approves.length}</h1> */}

                            </caption>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table" >Sl no</Th>
                                    <Th className="listing-table" >Date <button onClick={() => sortAscending(setApproves, approves)}><img src={upArrow} alt="upArrow" height="15px" width="15px" /></button>
                                        <button onClick={() => sortDescending(setApproves, approves)}><img src={downArrow} alt="downArrow" height="15px" width="15px" /></button>
                                    </Th>
                                    <Th className="listing-table" >Name</Th>
                                    <Th className="listing-table" >Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    approves.map((item, i) => {
                                        return (
                                            <Tr key={item._id}>
                                                <Td className="listing-table" >{i + 1}</Td>

                                                <Td className="listing-table" >{
                                                    item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                }</Td>
                                                <Td className="listing-table" ><Link to={`/orders/${item._id}`}><h3>{item.customer.fullName} {item.customer.homeDelivery ? (<img src={homeDeliveryMan} alt="homeDeliveryIcon" height='35px' width='35px' />) : null}
                                                    {item.customer.service ? (<img src={serviceGif} alt="serviceGif" height='35px' width='35px' />) : null}
                                                </h3></Link>
                                                    {item.customer.queries && <>Notes - {item.customer.queries}</>}

                                                </Td>

                                                <Td className="listing-table">
                                                    {/* Responsiveness lost if displayed as flex */}
                                                    {/* <div style={{
                                                        "display": "flex",
                                                        "justifyContent": "space-evenly",
                                                    }}> */}
                                                    {/* mobile CSS:
                                                        display: flex;
                                                        flex-direction: column;
                                                    */}
                                                    <button>Update</button>

                                                    <button className="button-color5" onClick={() => {
                                                        handleRemoveOrder(item._id, item.customer.fullName)
                                                    }}>
                                                        <img src={deleteImg} alt="" style={{
                                                            "filter": "brightness(0) invert(1)", height: '30px', width: '30px'
                                                        }} />
                                                    </button>
                                                    <button className="button-color6" onClick={() => {
                                                        handleApproveOrder(item._id)
                                                    }}>
                                                        <img src={approveImg} alt="" height='25px' width='25px' />
                                                    </button>
                                                    {/* </div> */}
                                                </Td>

                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </div>

                    <div className='order-container' style={{ "backgroundColor": "#98c8ab" }}>
                        <h2 style={{ textAlign: 'center', margin: '0px', fontWeight: 'bold' }}>Confirmed orders - {confirmed.length}</h2>
                        <div className='order-functions'>
                            <input placeholder="Search Order" id="searchConfirmed" onChange={(e) => {
                                console.log('inside search handleChange')
                                console.log(e.target.value)
                                const statusFilter = orders.filter(order => order.status === 'confirmed')
                                console.log('filtered:', statusFilter)
                                const nameFilter = statusFilter.filter(order => order.customer.fullName.toLowerCase().includes(e.target.value.toLowerCase()))
                                setConfirmed(nameFilter)
                            }} className='order-search' />
                            <button className='order-button-styling' onClick={(e) => clearOrderSearch('searchConfirmed', setConfirmed, 'confirmed')}> Clear</button>
                            <Link to='/menu'><button className='order-button-styling'>Add new Order</button></Link>
                        </div>
                        <Table className='table-styling'>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table" >Sl no</Th>
                                    <Th className="listing-table" >Date
                                        <button onClick={() => sortAscending(setConfirmed, confirmed)}><img src={upArrow} alt="upArrow" height="15px" width="15px" /></button>
                                        <button onClick={() => sortDescending(setConfirmed, confirmed)}><img src={downArrow} alt="downArrow" height="15px" width="15px" /></button>
                                    </Th>
                                    {/* <Th className="listing-table" >Update</Th> */}
                                    <Th className="listing-table" >Name</Th>
                                    <Th className="listing-table" >Delete</Th>
                                    <Th className="listing-table" >Completed</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {
                                    confirmed.map((item, i) => {
                                        return (
                                            <Tr key={item._id}>
                                                <Td className="listing-table" >{i + 1}</Td>
                                                <Td className="listing-table" >{
                                                    item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                }</Td>
                                                <Td className="listing-table" ><Link to={`/orders/${item._id}`}><h3>{item.customer.fullName} {item.customer.homeDelivery ? (<img src={homeDeliveryMan} alt="homeDeliveryIcon" height='35px' width='35px' />) : null}
                                                    {item.customer.service ? (<img src={serviceGif} alt="serviceGif" height='35px' width='35px' />) : null}
                                                </h3></Link></Td>
                                                {/* <Td className="listing-table" ><button>update</button></Td> */}

                                                <Td className="listing-table" ><button className='button-color5' onClick={() => {
                                                    handleRemoveOrder(item._id, item.customer.fullName)
                                                }}>
                                                    <img src={deleteImg} alt="" height='20px' width='20px' />
                                                    Delete</button></Td>
                                                <Td className="listing-table" ><button className='button-color6' onClick={() => {
                                                    handleCompleteOrder(item._id)
                                                }}>
                                                    <img src={approveImg} alt="" height='20px' width='20px' />
                                                    Completed</button></Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </div>

                    <div className='order-container' style={{ "backgroundColor": "#d7c7aa" }}>
                        <h2 style={{ 'textAlign': 'center', margin: '0px', fontWeight: 'bold' }}>Completed orders -{completed.length}</h2>
                        <div className='order-functions'>
                            <input placeholder="Search Order" id='searchCompleted' className='order-search' onChange={(e) => {
                                console.log('inside search handleChange')
                                console.log(e.target.value)
                                const statusFilter = orders.filter(order => order.status === 'completed')
                                console.log('filtered:', statusFilter)
                                const nameFilter = statusFilter.filter(order => order.customer.fullName.toLowerCase().includes(e.target.value.toLowerCase()))
                                setCompleted(nameFilter)
                            }} />
                            <button className='order-button-styling' onClick={(e) => clearOrderSearch('searchCompleted', setCompleted, 'completed')}>Clear</button>
                            From
                            <DatePicker className=""
                                wrapperClassName="datePickerStyle"
                                selected={startDateFrom}
                                onChange={(e) => {
                                    handleDateChange(e, setStartDateFrom)
                                }}
                                dateFormat="dd/MM/yyyy"

                            />
                            To
                            <DatePicker className=""
                                wrapperClassName="datePickerStyle"
                                selected={startDateTo}
                                onChange={(e) => {
                                    handleDateChange(e, setStartDateTo)
                                }}
                                dateFormat="dd/MM/yyyy"

                            />
                        </div>
                        <Table className='table-styling'>
                            <Thead>
                                <Tr>
                                    <Th className="listing-table">Sl no</Th>
                                    <Th className="listing-table">Name</Th>
                                    <Th className="listing-table">Date
                                        <button onClick={() => sortAscending(setCompleted, completed)}><img src={upArrow} alt="upArrow" height="15px" width="15px" /></button>
                                        <button onClick={() => sortDescending(setCompleted, completed)}><img src={downArrow} alt="downArrow" height="15px" width="15px" /></button>
                                    </Th>
                                    <Th className="listing-table">Delete</Th>
                                </Tr>
                            </Thead>

                            <Tbody>
                                {
                                    completed.map((item, i) => {
                                        return (
                                            <Tr key={item._id}>
                                                <Td className="listing-table" >{i + 1}</Td>
                                                <Td className="listing-table" ><Link to={`/orders/${item._id}`}><h3>{item.customer.fullName} {item.customer.homeDelivery ? (<img src={homeDeliveryMan} alt="homeDeliveryIcon" height='35px' width='35px' />) : null}
                                                    {item.customer.service ? (<img src={serviceGif} alt="serviceGif" height='35px' width='35px' />) : null}
                                                </h3></Link></Td>
                                                <Td className="listing-table" >{
                                                    item.customer.eventDate.substr(8, 2) + "/" + item.customer.eventDate.substr(5, 2) + "/" + item.customer.eventDate.substr(0, 4)
                                                }</Td>
                                                <Td className="listing-table" ><button className='button-color5' onClick={() => {
                                                    handleRemoveOrder(item._id, item.customer.fullName)
                                                }}>
                                                    <img src={deleteImg} alt="" height='20px' width='20px' />
                                                    Delete</button></Td>
                                            </Tr>
                                        )
                                    })
                                }
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default ItemList