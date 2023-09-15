import ShowBtn from "../../../assets/ShowBtn"
import { useEffect, useState } from "react"
import NavigationBar from "../../NavigationBar"
import { showEventOrders } from "../../../apis/eventOrders"
import { Link } from "react-router-dom/cjs/react-router-dom.min"
import generateObjectID from "../../../helperFunctions/generateObjectID"
import { Table, Thead, Tbody, Tr, Td } from 'react-super-responsive-table';
import backIcon from '../../../images/back-icon.png'
import homeDeliveryMan from '../../../images/home-delivery-man.png'

import CalculateTotalQuantity from "../modals/calculateTotalQuantityModal"
import calculateOrderTotal from '../../../helperFunctions/calculateOrderTotal'
import { updateEventOrder } from "../../../apis/eventOrders"

const EventOrdersList = () => {
    const [eventName, setEventName] = useState('')
    const [eventDate, setEventDate] = useState('')
    const [advanceAmount, setAdvanceAmount] = useState(null)
    const [eventId, setEventId] = useState('')
    const [searchOrder, setSearchOrder] = useState('')
    const [orders, setOrders] = useState([])
    const [selectedOrders, setSelectedOrders] = useState([]) // only passing the selected to modal
    const [totalItems, setTotalItems] = useState([]) // 


    const addEventOrder = () => {
        console.log("save this in localstorage", eventId)
        localStorage.setItem('eventId', eventId)
        window.location.href = '/menu'
    }
    const getEventDetails = async (id) => {
        // gets all event object to render orders
        const response = await showEventOrders(id)
        const eventDetails = response.data
        setEventName(eventDetails.eventName)
        setEventDate(eventDetails.eventDate)
        setEventId(eventDetails._id)
        const orders = eventDetails.orders.map(order => ({ ...order, isSelected: false }))
        setOrders([...orders])
    }

    const setDetailsToLS = (order) => {
        // alert("you have to set the details here")
        // generate an orderid here
        const orderId = generateObjectID()

        const orderDetails = {
            eventName,
            eventDate,
            order,
            orderId,
            AdvanceAmount: order.AdvanceAmount
        }
        console.log("order Details to show setDetailsToLS", orderDetails)
        localStorage.setItem('orderDetails', JSON.stringify(orderDetails))

    }


    const selectAllOrders = () => {
        let selectedOrders = orders.map(order => ({ ...order, isSelected: true }))
        console.log(" selectAllOrders:", selectedOrders)
        setOrders([...selectedOrders])
    }


    useEffect(() => {
        const id = window.location.href.split('/')[4]
        getEventDetails(id)
    }, [])
    const getSelectedOrders = () => {
        // when modal opens it sets the state
        // setSelectedOrders(orders.filter(order => order.isSelected))
        const selectedOrders = orders.filter(order => order.isSelected)
        if (selectedOrders.length != 0) {
            const calculatedTotal = calculateOrderTotal(selectedOrders)
            console.log("calculated Total :", calculatedTotal)
            setTotalItems(calculatedTotal)
        } else {
            alert("no order is selected !")
        }

    }
    const toggleSelect = (index) => {
        console.log("toggle select called ", index)
        let toggleOrder = orders
        toggleOrder[index]['isSelected'] = !toggleOrder[index]['isSelected']
        console.log("toggle select called ", index)
        setOrders([...toggleOrder])
    }
    const clearSearch = () => {
        setSearchOrder('')
    }
    const handleSearchOrder = (e) => {
        setSearchOrder(e.target.value)
        // setOrders(orders.filter(order => order.customer.fullName.includes(e.target.value)))
    }

    const handleStatusChange = (index, orderId, statusValue) => {
        alert("clicked on:" + index + " " + orderId + " " + statusValue)


        // api call here
        updateEventOrder(orderId, { status: statusValue })


        // ui state setting
        let statusUpdatedOrders = orders
        statusUpdatedOrders[index]['status'] = statusValue
        setOrders([...statusUpdatedOrders])
    }
    return <>
        <ShowBtn />
        <div >
            <div style={{ display: 'flex' }}>
                <NavigationBar />
                <div style={{ width: '100%', margin: '20px' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <Link to='/eventOrders' style={{
                            padding: '10px', borderRadius: '16px',
                            backgroundColor: 'rgb(255, 136, 26)', borderRadius: '10px', cursor: 'pointer', color: 'black'
                        }}>
                            <img src={backIcon} alt="backIcon" height="30px" width="30px" />
                            Back
                        </Link>

                        <button style={{ padding: '10px', borderRadius: '16px' }} onClick={addEventOrder}>Add New order </button>
                    </div>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Event Name - {eventName}</h3>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Event Date - {eventDate}</h3>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Listing Orders - {orders.length}</h3>

                    <div style={{ margin: '20px auto', display: 'flex', gap: '32px' }}>
                        <input placeholder="search name" style={{ padding: '10px', borderRadius: '16px' }} value={searchOrder} onChange={handleSearchOrder} />
                        <button onClick={clearSearch}>Clear Search</button>
                        {/* <button style={{ padding: '10px', borderRadius: '16px' }}>Get Item total for this event </button> */}
                        <CalculateTotalQuantity
                            // refresh={refresh}
                            // setRefresh={setRefresh}
                            eventName={eventName}
                            eventDate={eventDate}
                            totalItems={totalItems}
                            getSelectedOrders={getSelectedOrders}
                            buttonLabel="Get Item total for this event " />


                    </div>
                    <div>

                        <Table>
                            <Thead>
                                <Tr>
                                    <Td className='listing-table'>
                                        Select Orders
                                        <input type="checkbox" onChange={() => selectAllOrders()} />
                                    </Td>
                                    <Td className='listing-table'>
                                        Sl No
                                    </Td>
                                    <Td className='listing-table'>
                                        Name
                                    </Td>
                                    <Td className='listing-table'>
                                        Item
                                    </Td>
                                    <Td className='listing-table'>
                                        Quantity
                                    </Td>
                                    <Td className='listing-table'>
                                        Status
                                    </Td>
                                    <Td className='listing-table'>
                                        Actions
                                    </Td>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {orders.map((order, index) => <Tr key={index}>
                                    <Td className='listing-table'>
                                        <input type="checkbox" checked={order.isSelected} onClick={() => toggleSelect(index)} />
                                        {order.isSelected ? "yes" : "no"}
                                    </Td>
                                    <Td className='listing-table'>
                                        {index + 1}
                                    </Td>
                                    <Td className='listing-table'>
                                        <Link to={`/eventOrders/${eventId}/customer`}
                                            onClick={() => setDetailsToLS(order)}
                                        >
                                            {order.customer.fullName} {order.customer.homeDelivery ? (<img src={homeDeliveryMan} alt="homeDeliveryIcon" height='35px' width='35px' />) : null}
                                        </Link >
                                    </Td>
                                    <Td className='listing-table'>
                                        {order.items.map((item, index) => <div key={index}>
                                            <div>{item.name}  </div>

                                        </div>)}
                                    </Td>
                                    <Td className='listing-table'>
                                        {order.items.map((item, index) => <div key={index}>
                                            <div>{item.quantity} {item.measured}  </div>

                                        </div>)}
                                    </Td>
                                    <Td className='listing-table'>
                                        <select value={order.status} onChange={(e) => handleStatusChange(index, order.orderId, e.target.value)}>
                                            <option value={"approve"}>Approve</option>
                                            <option value={"confirmed"}>Confirmed/Paid</option>
                                            <option value={"completed"}>Completed</option>
                                        </select>
                                    </Td>
                                    <Td className='listing-table'>
                                        <button>Delete</button>
                                    </Td>
                                </Tr>)}
                            </Tbody>
                        </Table>
                    </div>
                </div>
            </div>
            <br />
            <hr />

        </div>

    </>
}

export default EventOrdersList