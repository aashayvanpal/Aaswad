const mongoose = require('mongoose')

const Schema = mongoose.Schema
// Create a Order Schema - with fields 

const eventOrderSchema = new Schema({
    eventName: {
        type: String,
        reqiured: true,
    },
    eventDate: {
        type: String,
        reqiured: true
    },
    orders: {
        type: Array
    }
})


//Create a model called as Order
const EventOrder = mongoose.model('eventOrder', eventOrderSchema)

module.exports = EventOrder