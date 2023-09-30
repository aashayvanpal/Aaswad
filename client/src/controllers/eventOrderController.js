const EventOrder = require('../../../models/eventOrders.js')

// list
module.exports.list = (req, res) => {
    EventOrder.find()
        .then(order => {
            res.json(order)
        })
        .catch(err => {
            console.log(err)
        })
}

// create
module.exports.createEventOrder = (req, res) => {
    const body = req.body
    const order = new EventOrder(body)
    // const note = new Note(body)
    order.save()
        .then((eventOrder) => {
            res.json(eventOrder)
        })
        .catch((err) => {
            res.json(err)
        })
}

// show
module.exports.show = (req, res) => {
    id = req.params.id
    EventOrder.findById(id)
        .then(eventDetail => {
            if (eventDetail) {
                // note will be either object or null value 
                // checks to see if the note is present in the db
                res.json(eventDetail) //sends the note 

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
    EventOrder.findByIdAndDelete(id)
        .then(event => {
            if (event) {
                res.json(event)
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
    // working here
    // find id from orders[] update and put dynamically property update
    const id = req.params.id
    // const advanceAmount = req.body.advanceAmount
    const key = Object.keys(req.body)[0]
    const updateValue = req.body[key]
    console.log("event order update controller function : id : key : value", id, key, updateValue)

    // Create an object to dynamically specify the field to set
    const setField = {};
    setField[`orders.$.${key}`] = updateValue;

    EventOrder.findOneAndUpdate(
        { 'orders.orderId': id }, // Find the document containing the specified ID in the "items" array
        // { $set: { 'orders.$.AdvanceAmount': advanceAmount } }, // Update the "quantity" key of the matched item
        { $set: setField }, // Update the "quantity" key of the matched item
        { new: true }, // Return the updated document
        (error, updatedDocument) => {
            if (error) {
                console.error('Error updating document:', error);
                return;
            }
            if (updatedDocument) {
                console.log('Updated document:', updatedDocument);
            } else {
                console.error('Item with ID not found:', itemIdToUpdate);
            }
        }
    );
}




// adding order inside an existing event
module.exports.addOrder = (req, res) => {
    const id = req.params.id
    const newOrder = req.body
    console.log("im inside addOrder route you have to push inside orders array here only this body", id, newOrder)

    EventOrder.findOneAndUpdate(
        { _id: id }, // Filter to find the document by name
        { $push: { orders: newOrder } }, // Push the new item into the 'items' array
        { new: true } // Return the updated document
    )
        .then(updatedDocument => {
            if (updatedDocument) {
                console.log('Item added successfully:', updatedDocument);
            } else {
                console.log('Document not found.');
            }
        })
        .catch(error => {
            console.error('Error adding item:', error);
        });
}


// deleting field - fieldName from order inside an existing event
module.exports.deleteField = (req, res) => {
    const id = req.params.id
    const fieldName = req.body.fieldName
    console.log("im inside deleteField route you have to delete field inside orders array here only this body", id, fieldName)

    // Create an object to dynamically specify the field to unset
    const unsetField = {};
    unsetField[`orders.$.${fieldName}`] = 1;

    console.log("-------------------------------------",)
    console.log("MyString", unsetField)
    console.log("-------------------------------------",)

    EventOrder.findOneAndUpdate(
        { 'orders.orderId': id }, // Find the document containing the specified ID in the "items" array
        // { $unset: { 'orders.$.AdvanceAmount': 1 } }, // Unset (remove) the "quantity" key of the matched item
        { $unset: unsetField }, // Unset (remove) the "quantity" key of the matched item
        { new: true }, // Return the updated document
        (error, updatedDocument) => {
            if (error) {
                console.error('Error updating document:', error);
                return;
            }
            if (updatedDocument) {
                console.log('Updated document:', updatedDocument);
                res.json({ 'msg': 'successfully deleted field', fieldName })
            } else {
                console.error('Item with ID not found:', id);
            }
        }
    )
}


module.exports.deleteEventOrderByID = (req, res) => {
    const orderIdToDelete = req.params.id; // Specify the ID you want to delete from the "items" array
    const deleteOrder = { orders: { orderId: orderIdToDelete } }

    // Use findOneAndUpdate to delete the order with the matched "orderId"
    EventOrder.findOneAndUpdate(
        { 'orders.orderId': orderIdToDelete }, // Find the document containing the specified orderId in the "orders" array
        { $pull: deleteOrder }, // Pull (remove) the item with the matched "orderId"
        { new: true }, // Return the updated document
        (error, updatedDocument) => {
            if (error) {
                console.error('Error updating document:', error);
                return;
            }
            if (updatedDocument) {
                console.log('Updated document:', updatedDocument);
            } else {
                console.error('Item with ID not found:', orderIdToDelete);
            }
        }
    );


}