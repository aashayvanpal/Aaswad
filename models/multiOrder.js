const mongoose = require('mongoose')

const Schema = mongoose.Schema
// Create a Order Schema - with fields 

const orderSchema = new Schema({
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
    overallRating: {
        type: Number
    },
    feedback: {
        type: Boolean
    },
    feedbackNote: {
        type: String
    },
    orderDates: {
        type: Array,
        required: true
    },
    total: {
        type: Number,
        required: true
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
        eventName: {
            type: String
        },
    },

    status: {
        type: String,
        required: true
    }
})


//Create a model called as Order
const MultiOrder = mongoose.model('MultiOrder', orderSchema)

module.exports = MultiOrder