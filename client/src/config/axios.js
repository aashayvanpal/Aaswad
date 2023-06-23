import Axios from 'axios'
import { axiosURL } from './main.js'

const axios = Axios.create({
    baseURL: axiosURL
})
export default axios