import axios from '../config/axios.js'

function getUserDetails() {
    return new Promise((resolve, reject) => {
        axios.get('/account', {
            headers: { 'x-auth': localStorage.getItem('token') }
        })
            .then(dataRequest => {
                resolve(dataRequest.data)
            })
            .catch(err => reject(err))
    })
}

export { getUserDetails }