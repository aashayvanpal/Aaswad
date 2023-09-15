const Ingredient = require('../../../models/ingredient.js')

// list
module.exports.list = (req, res) => {
    Ingredient.find()
        .then(ingredient => {
            res.json(ingredient)
        })
        .catch(err => {
            console.log(err)
        })
}

// create
module.exports.create = (req, res) => {
    const body = req.body
    const ingredient = new Ingredient(body)
    // const note = new Note(body)
    ingredient.save()
        .then((ingredient) => {
            res.json(ingredient)
        })
        .catch((err) => {
            res.json(err)
        })
}

// show
module.exports.show = (req, res) => {
    id = req.params.id
    Ingredient.findById(id)
        .then(ingredient => {
            if (ingredient) {
                // note will be either object or null value 
                // checks to see if the note is present in the db
                res.json(ingredient) //sends the note 

            } else { //send an empty object 
                res.json({})
            }
        })
        .catch(err => {
            res.json(err)
        })
}

// destroy
module.exports.destroy = (req, res) => {
    const id = req.params.id
    Ingredient.findByIdAndDelete(id)
        .then(ingredient => {
            if (ingredient) {
                res.json(ingredient)
            } else {
                res.json({})
            }
        })
        .catch(err => {
            res.json(err)
        })
}

// update 
module.exports.update = (req, res) => {
    const id = req.params.id
    const body = req.body
    Ingredient.findByIdAndUpdate(id, body, { new: true,runValidators:true })
        .then( ingredient =>{
            if (ingredient){
                res.json(ingredient)
            }else{
                res.json({})
            }
        })
        .catch(err => {
            res.json(err)
        })
}

