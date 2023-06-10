import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import deleteImg from '../../images/delete-icon.png'
import confirm from 'reactstrap-confirm'
import ShowBtn from "../../assets/ShowBtn"
import NavigationBar from "../NavigationBar"
import axios from "axios"
import updateIcon from '../../images/update-icon.jpg'


const DisplayCustomers = () => {
    const [customers, setCustomers] = useState([])
    const [searchedCustomer, setSearchedCustomer] = useState('')
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

    const handleRemoveCustomer = async (id, name) => {
        console.log('remove this id:', id)
        console.log('remove this name:', name)
        // add confirmation here
        let result = await confirm({
            title: (
                <div style={{ "color": "black", "fontWeight": "bold" }}>
                    Delete Customer Confirmation
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
            axios.delete(`/customers/${id}`, {
                headers: {
                    'x-auth': localStorage.getItem('token')
                }
            })
                .then((response) => {
                    console.log('response data', response.data)
                    setCustomers(customers.filter(item => item._id !== response.data._id))

                })
                .catch((err) => {
                    console.log(err)
                })

        } else { console.log('dont delete the Customer!!') }

    }
    const filterCustomers = () => {
        return customers.filter(customer => customer.fullName.toLowerCase().includes(searchedCustomer.toLowerCase()))
    }
    return <div >
        <ShowBtn />
        <div style={{ display: 'flex' }}>

            <NavigationBar />

            <div style={{ border: ' 2px solid black', margin: '20px', padding: '20px', borderRadius: '8px', width: '100%' }}>

                <Link
                    to="/customers/add"
                >
                    Add Customers
                </Link><br />
                Listing Customers : {filterCustomers().length}<br />
                Search Customer <input value={searchedCustomer} onChange={(e) => setSearchedCustomer(e.target.value)} />
                Sort customer by membership , alphabetical order, number of orders given
                <table>
                    <thead>
                        <td>Sl No</td>
                        <td>Name</td>
                        <td>Actions</td>
                    </thead>
                    <tbody>

                        {
                            filterCustomers().map((customer, index) => <tr key={index}>
                                <td>{index + 1}</td>
                                <td><Link to={`/customers/${customer._id}`}>{customer.fullName}</Link ></td>
                                <td>
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