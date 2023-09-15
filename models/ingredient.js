const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
})


//Create a model called as Category
const Ingredient = mongoose.model('Ingredient', ingredientSchema)

module.exports = Ingredient