// import npm packages
const express = require('express')
const mongoose = require('./client/src/config/database.js')

const morgan = require('morgan')
const path = require('path')
// const cors = require('cors')

// const routes = require('./routes/api.js')
const router = require('./client/src/config/routes.js')


const app = express()
const PORT = process.env.PORT || 5001 // Deployment Step 1

// Step1 connection

// MONGODB_URI (string from heroku) comes here

// mongoose.connect(MONGODB_URI || 'mongodb://localhost/mern_youtube', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

// for local database
// mongoose.connect('mongodb://localhost/mern_youtube', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })


// Deployment Step2
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/AaswadCaterers-app', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })


// mongoose.connection.on('connected', () => {
//     console.log('mongoose is connected !')
// })

// // Dummy data
// // Saving data to our mongo database
// data = {
//     title: 'Welcome to my youtube channel',
//     body: 'i want to be a fullstack developer'
// }

// // Step4 Use the model to save to database
// const newBlogPost = new BlogPost(data) // instance of the model
// // newBlogPost.save((error) => {
// //     if (error) {
// //         console.log('Oops something happened')
// //     } else {
// //         console.log('The data has been saved!')
// //     }
// // })

// app.use(cors())

// Data parsing
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// HTTP request logger
app.use(morgan('tiny'))

app.get('/', (req, res) => {
    res.send('Welcome to the Aaswad Caterers App !')
})


// app.use('/api', routes)
// app.use('/', (req, res) => {
//     res.send('welcome to app')
// })

app.use('/', router)
app.use(router)

// Deployment Step3
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
}

app.listen(PORT, console.log(`server is running at port:${PORT}`))
