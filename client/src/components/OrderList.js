import React, { useEffect, useState } from 'react';
import axios from '../config/axios'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setEditingOrder } from '../store/slices/cartSlice'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import '../css/app-css.css'
import '../css/OrderList.css'
import ConfirmDialog from './ConfirmDialog'
import deleteImg from '../images/delete-icon.png'
import approveImg from '../images/approve-icon.png'
import homeDeliveryMan from '../images/home-delivery-man.png'
import serviceGif from '../images/service.gif'
import upArrow from '../images/up-arrow.png'
import downArrow from '../images/down-arrow.png'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV2'
import ReportModal from './ReportModal';
import {
    useGetOrdersQuery,
    useDeleteOrderMutation,
    useUpdateOrderMutation,
} from '../store/services/ordersApi'

const ItemList = () => {
    const [approves, setApproves] = useState([])
    const [completed, setCompleted] = useState([])
    const [confirmed, setConfirmed] = useState([])
    const [startDateFrom, setStartDateFrom] = useState(new Date())
    const [startDateTo, setStartDateTo] = useState(new Date())
    const [orderCheckBox, setOrderCheckBox] = useState(false)
    const [reportingState, setReportingState] = useState([])
    const [confirmState, setConfirmState] = useState({ open: false })

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { data: orders = [], isLoading } = useGetOrdersQuery()
    const [deleteOrder] = useDeleteOrderMutation()
    const [updateOrder] = useUpdateOrderMutation()

    useEffect(() => {
        setApproves(orders.filter(o => o.status === 'approve').map(o => ({ ...o, isReportSelected: false })))
        setConfirmed(orders.filter(o => o.status === 'confirmed'))
        setCompleted(orders.filter(o => o.status === 'completed'))
        reporting()
    }, [orders])

    const reporting = () => {
        const report = JSON.parse(localStorage.getItem('report'))
        setReportingState(report)
    }

    const handleRemoveOrder = (id, name) => {
        setConfirmState({
            open: true,
            title: 'Delete Order Confirmation',
            message: `Are you sure you want to delete : ${name}??`,
            onConfirm: async () => {
                setConfirmState(s => ({ ...s, open: false }))
                try {
                    await deleteOrder(id).unwrap()
                } catch (err) {
                    console.log(err)
                }
            }
        })
    }

    const handleApproveOrder = async (id) => {
        const order = approves.find(item => item._id === id)
        if (!order) return
        try {
            await updateOrder({ id, ...order, status: 'confirmed' }).unwrap()
            axios.post('/sendEmail/orderApproved', {
                fullName: order.customer.fullName,
                email: order.customer.email,
                phonenumber: order.customer.phoneNumber,
            })
        } catch (err) {
            console.log(err)
            window.alert(err?.data?.message || 'Update failed')
        }
    }

    const handleCompleteOrder = async (id) => {
        const order = confirmed.find(item => item._id === id)
        if (!order) return
        try {
            await updateOrder({ id, ...order, status: 'completed' }).unwrap()
            axios.post('/sendEmail/orderCompleted', { email: order.customer.email })
        } catch (err) {
            console.log(err)
            window.alert(err?.data?.message || 'Update failed')
        }
    }

    const sortAscending = (setFn, list) => {
        const sorted = [...list].sort((a, b) =>
            a.customer.eventDate > b.customer.eventDate ? -1 : a.customer.eventDate < b.customer.eventDate ? 1 : 0
        )
        setFn(sorted)
    }

    const sortDescending = (setFn, list) => {
        const sorted = [...list].sort((a, b) =>
            a.customer.eventDate < b.customer.eventDate ? -1 : a.customer.eventDate > b.customer.eventDate ? 1 : 0
        )
        setFn(sorted)
    }

    const clearOrderSearch = (id, setFn, status) => {
        document.getElementById(id).value = ''
        setFn(orders.filter(o => o.status === status))
    }

    const handleDateChange = (date, setFn) => {
        setFn(date)
        const completedOrders = orders.filter(o => o.status === 'completed')
        const filtered = completedOrders.filter(o =>
            new Date(startDateFrom) <= new Date(o.customer.eventDate) &&
            new Date(startDateTo) >= new Date(o.customer.eventDate)
        )
        setCompleted(filtered)
    }

    const selectOrders = () => setOrderCheckBox(!orderCheckBox)

    const selectOrder = (order) => {
        const output = {
            id: order._id,
            name: order.customer.fullName,
            amount: 10,
            status: order.status,
            isReportSelected: !order.isReportSelected,
        }
        const report = JSON.parse(localStorage.getItem('report')) || []
        localStorage.setItem('report', JSON.stringify([...report, output]))
    }

    const formatDate = (dateStr) =>
        dateStr ? `${dateStr.substr(8, 2)}/${dateStr.substr(5, 2)}/${dateStr.substr(0, 4)}` : ''

    if (isLoading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>

    return (
        <div>
            <ConfirmDialog
                open={confirmState.open}
                title={confirmState.title}
                message={confirmState.message}
                confirmText="Delete"
                onConfirm={confirmState.onConfirm}
                onCancel={() => setConfirmState(s => ({ ...s, open: false }))}
            />
            <div style={{ margin: '10px', width: '100%' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>Single date orders list</h2>
                <button onClick={selectOrders}>Select Orders</button>
                <ReportModal report={reportingState} buttonLabel="Show Selected Report" />

                {/* Approve orders */}
                <div className='order-container' style={{ backgroundColor: '#e3c57e' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
                        Approve orders - {approves.length}
                    </h2>
                    <Table className='table-styling' style={{ fontWeight: 'bold' }}>
                        <Thead>
                            <Tr>
                                <Th className="listing-table">
                                    Sl no
                                    {orderCheckBox && <input type="checkbox" style={{ height: '25px', width: '25px' }} />}
                                </Th>
                                <Th style={{ padding: '10px', fontSize: '21px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    Date
                                    <button onClick={() => sortAscending(setApproves, approves)}><img src={upArrow} alt="up" height="15px" width="15px" /></button>
                                    <button onClick={() => sortDescending(setApproves, approves)}><img src={downArrow} alt="down" height="15px" width="15px" /></button>
                                </Th>
                                <Th className="listing-table">Name</Th>
                                <Th className="listing-table">Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {approves.map((item, i) => (
                                <Tr key={item._id}>
                                    <Td className="listing-table">
                                        {i + 1}
                                        {orderCheckBox && (
                                            <input type="checkbox" style={{ height: '25px', width: '25px' }}
                                                checked={item.isReportSelected} onChange={() => selectOrder(item)} />
                                        )}
                                    </Td>
                                    <Td className="listing-table">{formatDate(item.customer.eventDate)}</Td>
                                    <Td className="listing-table">
                                        <Link to={`/orders/${item._id}`}>
                                            <h3>
                                                {item.customer.fullName}
                                                {item.customer.homeDelivery && <img src={homeDeliveryMan} alt="home delivery" height='35px' width='35px' />}
                                                {item.customer.service && <img src={serviceGif} alt="service" height='35px' width='35px' />}
                                            </h3>
                                        </Link>
                                        {item.customer.queries && <>Notes - {item.customer.queries}</>}
                                    </Td>
                                    <Td className="listing-table">
                                        <button onClick={() => { dispatch(setEditingOrder(item)); navigate('/menu') }}>Update</button>
                                        <button className="button-color5" onClick={() => handleRemoveOrder(item._id, item.customer.fullName)}>
                                            <img src={deleteImg} alt="" style={{ filter: 'brightness(0) invert(1)', height: '30px', width: '30px' }} />
                                        </button>
                                        <button className="button-color6" onClick={() => handleApproveOrder(item._id)}>
                                            <img src={approveImg} alt="" height='25px' width='25px' />
                                        </button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>

                {/* Confirmed orders */}
                <div className='order-container' style={{ backgroundColor: '#98c8ab' }}>
                    <h2 style={{ textAlign: 'center', margin: '0px', fontWeight: 'bold' }}>Confirmed orders - {confirmed.length}</h2>
                    <div className='order-functions'>
                        <div>
                            <input placeholder="Search Order" id="searchConfirmed"
                                onChange={(e) => {
                                    const filtered = orders.filter(o => o.status === 'confirmed')
                                        .filter(o => o.customer.fullName.toLowerCase().includes(e.target.value.toLowerCase()))
                                    setConfirmed(filtered)
                                }}
                                className='order-search'
                            />
                            <button className='order-button-styling' onClick={() => clearOrderSearch('searchConfirmed', setConfirmed, 'confirmed')}>Clear</button>
                            <Link to='/menu'><button className='order-button-styling'>Add new Order</button></Link>
                        </div>
                    </div>
                    <Table className='table-styling'>
                        <Thead>
                            <Tr>
                                <Th className="listing-table">Sl no</Th>
                                <Th style={{ padding: '10px', fontSize: '21px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    Date
                                    <button onClick={() => sortAscending(setConfirmed, confirmed)}><img src={upArrow} alt="up" height="15px" width="15px" /></button>
                                    <button onClick={() => sortDescending(setConfirmed, confirmed)}><img src={downArrow} alt="down" height="15px" width="15px" /></button>
                                </Th>
                                <Th className="listing-table">Name</Th>
                                <Th className="listing-table">Delete</Th>
                                <Th className="listing-table">Completed</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {confirmed.map((item, i) => (
                                <Tr key={item._id}>
                                    <Td className="listing-table">
                                        {i + 1}
                                        {orderCheckBox && (
                                            <input type="checkbox" style={{ height: '25px', width: '25px' }}
                                                checked={item.isReportSelected} onChange={() => selectOrder(item)} />
                                        )}
                                    </Td>
                                    <Td className="listing-table">{formatDate(item.customer.eventDate)}</Td>
                                    <Td className="listing-table">
                                        <Link to={`/orders/${item._id}`}>
                                            <h3>
                                                {item.customer.fullName}
                                                {item.customer.homeDelivery && <img src={homeDeliveryMan} alt="home delivery" height='35px' width='35px' />}
                                                {item.customer.service && <img src={serviceGif} alt="service" height='35px' width='35px' />}
                                            </h3>
                                        </Link>
                                    </Td>
                                    <Td className="listing-table">
                                        <button className='button-color5' onClick={() => handleRemoveOrder(item._id, item.customer.fullName)}>
                                            <img src={deleteImg} alt="" height='20px' width='20px' />Delete
                                        </button>
                                    </Td>
                                    <Td className="listing-table">
                                        <button className='button-color6' onClick={() => handleCompleteOrder(item._id)}>
                                            <img src={approveImg} alt="" height='20px' width='20px' />Completed
                                        </button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>

                {/* Completed orders */}
                <div className='order-container' style={{ backgroundColor: '#d7c7aa' }}>
                    <h2 style={{ textAlign: 'center', margin: '0px', fontWeight: 'bold' }}>Completed orders - {completed.length}</h2>
                    <div className='order-functions'>
                        <div>
                            <input placeholder="Search Order" id='searchCompleted' className='order-search'
                                onChange={(e) => {
                                    const filtered = orders.filter(o => o.status === 'completed')
                                        .filter(o => o.customer.fullName.toLowerCase().includes(e.target.value.toLowerCase()))
                                    setCompleted(filtered)
                                }}
                            />
                            <button className='order-button-styling' onClick={() => clearOrderSearch('searchCompleted', setCompleted, 'completed')}>Clear</button>
                        </div>
                        <div style={{ display: 'flex', marginBottom: '20px', gap: '12px', alignItems: 'center' }}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="From"
                                    value={startDateFrom}
                                    onChange={(e) => handleDateChange(e, setStartDateFrom)}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                                <DatePicker
                                    label="To"
                                    value={startDateTo}
                                    onChange={(e) => handleDateChange(e, setStartDateTo)}
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <Table className='table-styling'>
                        <Thead>
                            <Tr>
                                <Th className="listing-table">Sl no</Th>
                                <Th className="listing-table">Name</Th>
                                <Th style={{ padding: '10px', fontSize: '21px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                    Date
                                    <button onClick={() => sortAscending(setCompleted, completed)}><img src={upArrow} alt="up" height="15px" width="15px" /></button>
                                    <button onClick={() => sortDescending(setCompleted, completed)}><img src={downArrow} alt="down" height="15px" width="15px" /></button>
                                </Th>
                                <Th className="listing-table">Delete</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {completed.map((item, i) => (
                                <Tr key={item._id}>
                                    <Td className="listing-table">
                                        {i + 1}
                                        {orderCheckBox && (
                                            <input type="checkbox" style={{ height: '25px', width: '25px' }}
                                                checked={true} onChange={() => selectOrder(item)} />
                                        )}
                                    </Td>
                                    <Td className="listing-table">
                                        <Link to={`/orders/${item._id}`}>
                                            <h3>
                                                {item.customer.fullName}
                                                {item.customer.homeDelivery && <img src={homeDeliveryMan} alt="home delivery" height='35px' width='35px' />}
                                                {item.customer.service && <img src={serviceGif} alt="service" height='35px' width='35px' />}
                                            </h3>
                                        </Link>
                                    </Td>
                                    <Td className="listing-table">{formatDate(item.customer.eventDate)}</Td>
                                    <Td className="listing-table">
                                        <button className='button-color5' onClick={() => handleRemoveOrder(item._id, item.customer.fullName)}>
                                            <img src={deleteImg} alt="" height='20px' width='20px' />Delete
                                        </button>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default ItemList
