const mongoose = require('mongoose')

const Schema = mongoose.Schema
// Create a Order Schema - with fields 

const orderSchema = new Schema({
    items: {
        type: Array,
        required: true
    },
    transport: {
        medium: {
            type: String,
            reqiured: true,
        },
        rate: {
            type: Number,
            reqiured: true,
        }
    },
    AdvanceAmount: {
        type: Number,
    },
    customer: {
        customer_id: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: Number,
            required: true
        },
        email: {
            type: String
        },
        address: {
            type: String,
            required: true
        },
        queries: {
            type: String
        },
        eventName: {
            type: String
        },
        eventDate: {
            type: String,
            required: true
        },
        eventTime: {
            type: String,
            required: true
        },
        homeDelivery: {
            type: Boolean,
            required: true
        },
        numberOfPeople: {
            type: Number
        },
        service: {
            type: Boolean,
            required: true
        }
    },

    status: {
        type: String,
        required: true
    }
})


//Create a model called as Order
const Order = mongoose.model('Order', orderSchema)

module.exports = Order