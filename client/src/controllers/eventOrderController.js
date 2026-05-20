const EventOrder = require('../../../models/eventOrders.js')

// list
module.exports.list = (req, res) => {
    EventOrder.find()
        .then(order => res.json(order))
        .catch(err => res.json(err))
}

// create
module.exports.createEventOrder = (req, res) => {
    const order = new EventOrder(req.body)
    order.save()
        .then(eventOrder => res.json(eventOrder))
        .catch(err => res.json(err))
}

// show
module.exports.show = (req, res) => {
    const id = req.params.id
    EventOrder.findById(id)
        .then(eventDetail => res.json(eventDetail || {}))
        .catch(err => res.json(err))
}

// destroy
module.exports.destroy = (req, res) => {
    const id = req.params.id
    EventOrder.findByIdAndDelete(id)
        .then(event => res.json(event || {}))
        .catch(err => res.json(err))
}

// update a field inside an order within an event
module.exports.update = (req, res) => {
    const id = req.params.id
    const key = Object.keys(req.body)[0]
    const updateValue = req.body[key]
    console.log('eventOrder update:', id, key, updateValue)

    const setField = {}
    setField[`orders.$.${key}`] = updateValue

    EventOrder.findOneAndUpdate(
        { 'orders.orderId': id },
        { $set: setField },
        { new: true }
    )
        .then(updatedDocument => res.json(updatedDocument || {}))
        .catch(err => res.json(err))
}

// add an order into an existing event
module.exports.addOrder = (req, res) => {
    const id = req.params.id
    const newOrder = req.body
    console.log('addOrder:', id, newOrder)

    EventOrder.findOneAndUpdate(
        { _id: id },
        { $push: { orders: newOrder } },
        { new: true }
    )
        .then(updatedDocument => res.json(updatedDocument || {}))
        .catch(err => res.json(err))
}

// delete a field from an order inside an event
module.exports.deleteField = (req, res) => {
    const id = req.params.id
    const fieldName = req.body.fieldName
    console.log('deleteField:', id, fieldName)

    const unsetField = {}
    unsetField[`orders.$.${fieldName}`] = 1

    EventOrder.findOneAndUpdate(
        { 'orders.orderId': id },
        { $unset: unsetField },
        { new: true }
    )
        .then(updatedDocument => {
            if (updatedDocument) {
                res.json({ msg: 'successfully deleted field', fieldName })
            } else {
                res.json({ msg: 'document not found', id })
            }
        })
        .catch(err => res.json(err))
}

// pull an order out of an event by orderId
module.exports.deleteEventOrderByID = (req, res) => {
    const orderIdToDelete = req.params.id

    EventOrder.findOneAndUpdate(
        { 'orders.orderId': orderIdToDelete },
        { $pull: { orders: { orderId: orderIdToDelete } } },
        { new: true }
    )
        .then(updatedDocument => res.json(updatedDocument || {}))
        .catch(err => res.json(err))
}
