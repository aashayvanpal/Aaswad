import Axios from 'axios'

const axios = Axios.create({
    baseURL: 'https://aaswad.herokuapp.com'
    // baseURL: 'http://localhost:3000'
})
export default axios