const mongoose = require('mongoose')

const Schema = mongoose.Schema
// Create a categories Schema - with fields like name of type string and required true

const customerSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Array,
        required: true
    },
    email: { type: String },
    membership: {
        status: {
            type: String
        },
        level: {
            type: String
        },
        points: {
            type: Number
        },
    },
    address: {
        type: Array
    },
    birthday: { type: String },
    gender: { type: String },
    language: {
        type: Array
    },
    profilePicture: { type: String },
})

//Create a model called as Category
const Customer = mongoose.model('Customer', customerSchema)

module.exports = Customer