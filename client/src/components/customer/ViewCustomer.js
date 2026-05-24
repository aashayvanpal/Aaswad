import React, { useEffect, useState } from 'react'
import { getCustomerById } from '../../apis/customers'
import { Link } from 'react-router-dom'
import backIcon from '../../images/back-icon.png'
import './ViewCustomer.scss'
const ViewCustomer = () => {
    const [customer, setCustomer] = useState(null)

    const getCustomerDetails = async (id) => {

        const customers = await getCustomerById(id)
        console.log(customers.data)
        setCustomer(customers.data)
    }


    useEffect(() => {
        // Api call for viewing single customer
        const id = window.location.pathname.split('/').slice(-1)[0]
        console.log("Api call useEffect", id)
        getCustomerDetails(id)
    }, [])
    return <div>
        <Link to="/customers">

            <button className="view-customer-back-btn"
                onClick={() => { localStorage.removeItem('order') }}
            >
                <img src={backIcon} alt="backIcon" height="30px" width="30px" />
                Back</button>
        </Link>
        <Link to={`/customers/edit/${customer?._id}`}>Edit</Link>
        {
            customer ? <div className="view-customer-card">
                <h3>FullName : {customer.fullName}</h3>
                <h3>Phone number : {customer.phoneNumber.map(phone => <>{Object.keys(phone)[0]}:- {phone[`${Object.keys(phone)[0]}`]}</>)}</h3>
                <h3>email : {customer.email}</h3>
                <h3>Address : {customer.address.map(addressObj => <>{Object.keys(addressObj)[0]}:- {addressObj[`${Object.keys(addressObj)[0]}`]}</>)}</h3>
                <h3>birthday : {customer.birthday}</h3>
                <h3>Gender : {customer.gender}</h3>
                <h3>language : {customer.language.map(lang => lang)}</h3>
                <h3>Membership :level:{customer.membership.level}</h3>
                <h3>Points:{customer.membership.points}</h3>
                <h3>Status:{customer.membership.status}</h3>
                <h3>Profile Picture : {customer.profilePicture}</h3>
                <h3>ID : {customer._id}</h3>
            </div> : "customer not found"
        }
    </div>
}

export default ViewCustomer