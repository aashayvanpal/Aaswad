const mongoose = require('mongoose')
const { mongodburl } = require('./main.js')

mongoose.connect(mongodburl)
    .then(() => {
        console.log('successfully connected to db...')
    })
    .catch((err) => {
        console.log('Did not connect to db', err)
    })

module.exports = mongoose
