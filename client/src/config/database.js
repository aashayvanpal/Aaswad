
const mongoose = require('mongoose')

// db configuration - establishing connection to db 

// For only Cloud
// mongoose.connect(process.env.MONGODB_URI,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/AaswadCaterers-app', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })


mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('successfully connected to db...')
    })
    .catch((err) => {
        console.log('Did not connect to db', err)
    })

module.exports = mongoose