const Query = require('../../../models/query.js')

// list
module.exports.list = (req, res) => {
    Query.find()
        .then(item => {
            res.json(item)
        })
        .catch(err => {
            console.log(err)
        })
}

// create
module.exports.create = (req, res) => {
    const body = req.body
    const query = new Query(body)
    // const note = new Note(body)
    query.save()
        .then((query) => {
            res.json(query)
        })
        .catch((err) => {
            res.json(err)
        })
}

// // show
// module.exports.show = (req, res) => {
//     id = req.params.id
//     Item.findById(id)
//         .then(item => {
//             if (item) {
//                 // note will be either object or null value 
//                 // checks to see if the note is present in the db
//                 res.json(item) //sends the note 

//             } else { //send an empty object 
//                 res.json({})
//             }
//         })
//         .catch(err => {
//             res.json(err)
//         })
// }

// // destroy
// module.exports.destroy = (req, res) => {
//     const id = req.params.id
//     Item.findByIdAndDelete(id)
//         .then(item => {
//             if (item) {

//                 res.json(item)
//             } else {
//                 res.json({})
//             }
//         })
//         .catch(err => {
//             res.json(err)
//         })
// }

// // update 
// module.exports.update = (req, res) => {
//     const id = req.params.id
//     const body = req.body
//     Item.findByIdAndUpdate(id, body, { new: true, runValidators: true })
//         .then(item => {
//             if (item) {
//                 res.json(item)
//             } else {
//                 res.json({})
//             }
//         })
//         .catch(err => {
//             res.json(err)
//         })
// }

