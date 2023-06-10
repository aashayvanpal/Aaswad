// api axios calls to perform crud operations for customers

import axios from "axios"

// getAllCustomers
// getSingleCustomer
export const getCustomerById = (id) => {
    return axios.get(`/customers/${id}`, { "x-auth": localStorage.getItem('token') })
}


// createCustomer
export const createCustomer = (customerBody) => {
    return axios.post('/customers', customerBody, {
        headers: {
            "x-auth": localStorage.getItem('token')
        }
    })
}

// updateCustomer
export const updateCustomer = (id, customerBody) => {
    return axios.put(`/customers/${id}`, customerBody, { headers: { "x-auth": localStorage.getItem('token') } })
}
// deleteCustomer