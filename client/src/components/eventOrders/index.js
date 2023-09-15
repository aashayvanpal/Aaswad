import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ShowBtn from '../../assets/ShowBtn'
import NavigationBar from '../NavigationBar'
import EventModal from './modals/createEventModal'
import { getEventOrders, deleteEventOrder } from '../../apis/eventOrders'
import { Table, Thead, Tbody, Tr, Td } from 'react-super-responsive-table';

function EventOrders() {
    const [eventOrders, setEventOrders] = useState([])
    const [refresh, setRefresh] = useState(true)
    const getAllEventOrders = async () => {
        const response = await getEventOrders()
        console.log("All Event Orders:", response.data)
        setEventOrders(response.data)
    }

    const deleteEvent = async (id) => {
        await deleteEventOrder(id)
        setRefresh(!refresh)
    }


    useEffect(() => {
        getAllEventOrders()
    }, [])
    useEffect(() => {
        getAllEventOrders()
    }, [refresh])
    return (
        <>
            <ShowBtn />
            <div >
                <div style={{ display: 'flex' }}>
                    <NavigationBar />
                    <div style={{ margin: '10px', padding: '20px', borderRadius: '16px', border: '2px solid black', width: "100%", backgroundColor: 'rgb(215, 199, 170)' }}>
                        <h3 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Event orders - {eventOrders.length}</h3>
                        <div style={{ display: 'flex', marginBottom: '20px' }}>
                            <EventModal
                                refresh={refresh}
                                setRefresh={setRefresh}
                                buttonLabel="Create Event" />
                        </div>
                        <div>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Td className='listing-table'>
                                            Sl No
                                        </Td>
                                        <Td className='listing-table'>
                                            Event Name
                                        </Td>
                                        <Td className='listing-table'>
                                            Date
                                        </Td>
                                        <Td className='listing-table'>
                                            Total number of orders
                                        </Td>
                                        <Td className='listing-table'>
                                            Actions
                                        </Td>
                                    </Tr>
                                </Thead>
                                <tbody>
                                    {eventOrders.map((event, index) => (<Tr key={index}>
                                        <Td className='listing-table'>{index + 1}</Td>
                                        <Td className='listing-table'><Link to={`/eventOrders/${event._id}`}>{event.eventName}</Link></Td>
                                        <Td className='listing-table'>{event.eventDate}</Td>
                                        <Td className='listing-table'>{event.orders.length}</Td>
                                        <Td className='listing-table'>
                                            <button onClick={(e) => deleteEvent(event._id)}>Delete</button>
                                        </Td>
                                    </Tr>))

                                    }

                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
                <br />
                <hr />

            </div>

        </>
    )
}

export default EventOrders