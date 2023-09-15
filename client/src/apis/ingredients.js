// api axios calls to perform crud operations for ingredients

import axios from "axios"

// getAllIngredients
export const getAllIngredients = () => {
    return axios.get('/ingredients', {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    })
}
// // getSingleCustomer
// export const getCustomerById = (id) => {
//     return axios.get(`/customers/${id}`, { "x-auth": localStorage.getItem('token') })
// }


// createIngredient
export const createIngredient = (ingredientBody) => {
    return axios.post('/ingredients', ingredientBody, {
        headers: {
            "x-auth": localStorage.getItem('token')
        }
    })
}

// // updateCustomer
// export const updateCustomer = (id, customerBody) => {
//     return axios.put(`/customers/${id}`, customerBody, { headers: { "x-auth": localStorage.getItem('token') } })
// }


// deleteIngredient
export const deleteIngredient = (id) => {
    return axios.delete(`/ingredients/${id}`, { headers: { "x-auth": localStorage.getItem('token') } })
}