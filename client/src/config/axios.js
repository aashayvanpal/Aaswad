import Axios from 'axios'

const axios = Axios.create({
    baseURL: 'https://aaswad.herokuapp.com'
    // baseURL: 'http://localhost:3000'
    // baseURL: 'http://localhost:5001'

})
export default axios