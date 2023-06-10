import Axios from 'axios'
import { axiosURL } from './main.js'

const axios = Axios.create({
    baseURL: 'https://aaswad.herokuapp.com'
    // baseURL: axiosURL
})
export default axios