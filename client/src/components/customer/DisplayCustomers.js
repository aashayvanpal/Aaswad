import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import deleteImg from '../../images/delete-icon.png'
import ConfirmDialog from '../ConfirmDialog'
import ShowBtn from "../../assets/ShowBtn"
import NavigationBar from "../NavigationBar"
import axios from "axios"
import updateIcon from '../../images/update-icon.jpg'


const DisplayCustomers = () => {
    const [customers, setCustomers] = useState([])
    const [searchedCustomer, setSearchedCustomer] = useState('')
    const [confirmState, setConfirmState] = useState({ open: false })
    useEffect(() => {
        // make api call here
        axios.get('/customers', {
            headers: {
                'x-auth': localStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Customer Data : ', response.data)
                setCustomers(response.data)
            })

            .catch(err => {
                console.log(err)
            })
    }, [])

    const handleRemoveCustomer = (id, name) => {
        console.log('remove this id:', id)
        console.log('remove this name:', name)

        setConfirmState({
            open: true,
            title: 'Delete Customer Confirmation',
            message: `Are you sure you want to delete : ${name}??`,
            onConfirm: () => {
                setConfirmState(s => ({ ...s, open: false }))
                axios.delete(`/customers/${id}`, {
                    headers: { 'x-auth': localStorage.getItem('token') }
                })
                    .then((response) => {
                        console.log('response data', response.data)
                        setCustomers(c => c.filter(item => item._id !== response.data._id))
                    })
                    .catch((err) => console.log(err))
            }
        })
    }
    const filterCustomers = () => {
        return customers.filter(customer => customer.fullName.toLowerCase().includes(searchedCustomer.toLowerCase()))
    }
    return <div>
        <ConfirmDialog
            open={confirmState.open}
            title={confirmState.title}
            message={confirmState.message}
            confirmText="Delete"
            onConfirm={confirmState.onConfirm}
            onCancel={() => setConfirmState(s => ({ ...s, open: false }))}
        />
        <ShowBtn />
        <div style={{ display: 'flex' }}>

            <NavigationBar />

            <div style={{ border: ' 2px solid black', margin: '20px', padding: '20px', borderRadius: '8px', width: '100%' }}>

                <div style={{ display: 'flex', gap: '20px' }}>

                    <div>
                        <h3>Listing Customers : {filterCustomers().length}</h3>
                        <input value={searchedCustomer} placeholder="Search Customer" onChange={(e) => setSearchedCustomer(e.target.value)} />
                    </div>
                    <Link
                        to="/customers/add"
                    >
                        <button style={{ border: "1px solid black", padding: '10px', borderRadius: '8px', }}>
                            Add Customer
                        </button>
                    </Link>
                </div>
                Sort customer by membership , alphabetical order, number of orders given
                <table style={{ width: "100%",border: "1px solid black", }}>
                    <thead style={{ textAlign: 'center' }}>
                        <td>Sl No</td>
                        <td>Name</td>
                        <td>Actions</td>
                    </thead>
                    <tbody>

                        {
                            filterCustomers().map((customer, index) => <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                <td><Link to={`/customers/${customer._id}`}>{customer.fullName}</Link ></td>
                                <td style={{ display: 'flex', gap: '8px' }}>
                                    <Link to={`/customers/edit/${customer._id}`}>
                                        <button className="button-color4"
                                            style={{ width: "100%", fontWeight: "bold" }}
                                        >
                                            <img src={updateIcon} alt="" height="30px" width="30px" />
                                            Update
                                        </button>
                                    </Link >

                                    <button className='button-color5' onClick={() => {
                                        handleRemoveCustomer(customer._id, customer.fullName)
                                    }}>
                                        <img src={deleteImg} alt="" height='20px' width='20px' />
                                        Delete</button>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default DisplayCustomers