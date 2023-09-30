import axios from "../config/axios"
export const createEventOrder = (body) => {
    return (axios.post('/eventOrders', body, {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    }))
}

export const getEventOrders = () => {
    return (axios.get('/eventOrders', {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    }))
}


export const deleteEventOrder = (id) => {
    return (axios.delete(`/eventOrders/${id}`, {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    }))
}

export const showEventOrders = (id) => {
    return (axios.get(`/eventOrders/${id}`, {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    }))
}

export const addEventOrder = (id, order) => {
    return axios.put(`/eventOrders/${id}`, order, {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    })
}

export const updateEventOrder = (id, updateObject) => {
    return axios.put(`/eventOrders/edit/${id}`, updateObject, {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    })
}

export const deleteFieldFromEventOrder = (id, fieldName) => {
    return (axios.put(`/eventOrders/deleteField/${id}`, { fieldName }, {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    }))
}

export const deleteOrderFromEventOrders = (id) => {
    return (axios.put(`/eventOrders/delete/${id}`, {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    }))
}