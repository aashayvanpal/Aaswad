const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema
// Create a categories Schema - with fields like name of type string and required true

const querySchema = new Schema({
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return validator.isEmail(value)
            },
            message: function () {
                return 'Invalid email format'
            }
        }
    },
    subject: {
        type: String,
        required: true
    },
    reply: {
        type: String,
    },
    mobile: {
        type: Number,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})


//Create a model called as Category
const Query = mongoose.model('Query', querySchema)

module.exports = Query