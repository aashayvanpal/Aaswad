const express = require('express')
const router = express.Router()

const itemController = require('../controllers/itemController.js')
const approveController = require('../controllers/approveController.js')
const multiOrderController = require('../controllers/multiOrderController.js')
const { usersRouter } = require('../controllers/UsersController.js')
// const { default: ContactUs } = require('../../../../components/contact/Contact.js')
const ContactUsController = require('../controllers/contactUsController.js')
const emailController = require('../controllers/emailController.js')


// const customerController = require('../app/controllers/customerController.js')
// // for customers 
// router.get('/customers', customerController.list)
// router.get('/customers/:id', customerController.show)
// router.post('/customers', customerController.create)
// router.put('/customers/:id', customerController.update)
// router.delete('/customers/:id', customerController.destroy)

// for Items
router.post('/items/add', itemController.create)
router.get('/api/items', itemController.list)
// router.put('/api/items', itemController.update)

router.get('/api/items/show/:id', itemController.show)

router.put('/items/edit/:id', itemController.update)
router.get('/items/edit/:id', itemController.show)

router.delete('/items/:id', itemController.destroy)


router.get('/api/menu', itemController.list)
// router.post('/Menu', approveController.createApprove)

router.post('/request', approveController.createApprove)



router.get('/api/orders', approveController.list)
router.put('/orders/:id', approveController.update)
router.delete('/orders/:id', approveController.destroy)
router.get('/api/orders/:id', approveController.show)
router.get('/myOrders/:id', approveController.myOrdersList)
router.get('/myOrders/show/:id', approveController.show)

// For multiOrders
router.post('/multiOrders', multiOrderController.createMultiOrder)


// Registeration 
router.post('/register', usersRouter)
router.post('/login', usersRouter)
router.get('/account', usersRouter)
router.delete('/logout', usersRouter)


// For Querries
router.get('/contactus', ContactUsController.list)
router.post('/contactus', ContactUsController.create)


// for Email notifications
router.use('/sendEmail/welcome', emailController.welcome)
router.use('/sendEmail/orderPlaced', emailController.orderPlaced)
router.use('/sendEmail/orderApproved', emailController.orderApproved)
router.use('/sendEmail/orderCompleted', emailController.orderCompleted)
router.use('/sendEmail/orderRejected', emailController.orderRejected)
router.use('/sendEmail/bill', emailController.bill)
router.use('/sendEmail/accountDeletion', emailController.deleteAccount)
router.use('/sendEmail/forgotPassword', emailController.forgotPassword)
router.use('/sendEmail/newOrderNotify', emailController.newOrderNotify)


module.exports = router