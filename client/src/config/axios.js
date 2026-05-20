import Axios from 'axios'

// No baseURL — requests are relative, proxied to the backend by Vite in dev
// and served from the same Express server in production
const axios = Axios.create()

export default axios
