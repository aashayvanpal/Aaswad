import axios from "../config/axios"
export const getMultiOrders = () => {
    return (axios.get('/multiOrders', {
        headers: {
            'x-auth': localStorage.getItem('token')
        }
    }))
}

