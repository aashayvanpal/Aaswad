var nodemailer = require('nodemailer')
var { NODEMAILER_SERVICE, NODEMAILER_USER, NODEMAILER_PASS } = require('../config/main.js')

var transporter = nodemailer.createTransport({
    service: NODEMAILER_SERVICE,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS
    }
})


// Welcome email
module.exports.welcome = (req, res) => {
    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'Account created at Aaswad Caterers!',
        attachments: [{
            filename: 'aaswad-logo-email.png',
            path: `${__dirname}/../images/aaswad-logo-email.png`,
            cid: 'logo' //same cid value as in the html img src
        }],
        html: `
        <div style="background-color:#E8CC69;">
            <img src="cid:logo" alt="logo" style="display:block;margin-left:auto;margin-right:auto;"/>
            <div style="background-color:#FFF5D0;border:3px solid #E2BD38;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);border-radius: 50px 10px;margin: 10px">
                <h3 style="margin-left:5px">Thank you for signing up at Aaswad Caterers.</h3>
                <h3 style="margin-left:5px">We welcome you to the team, your registration details are :-</h3><br/>
                <h3 style="margin-left:5px">Full Name:${req.body.fullName}</h3>
                <h3 style="margin-left:5px">Email :${req.body.email}</h3>
                <h3 style="margin-left:5px">Phone number :${req.body.phonenumber}</h3>
            </div>
            <div style="background-color:#000;color:#E8CC69;">
                <h3 style="text-align:center;">Email :varsha.vanpal@gmail.com </h3>
                <h3 style="text-align:center;">Phone number :9742814239</h3>
            </div>
        </div>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('you have error')
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}

// Order has been placed
module.exports.orderPlaced = (req, res) => {
    console.log('request body email check', req.body.email)

    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'Order has been placed successfully',
        attachments: [{
            filename: 'aaswad-logo-email.png',
            path: `${__dirname}/../images/aaswad-logo-email.png`,
            cid: 'logo' //same cid value as in the html img src
        }],
        html: `
        <div style="background-color:#E8CC69;">
            <img src="cid:logo" alt="logo" style="display:block;margin-left:auto;margin-right:auto;"/>
            <div style="background-color:#FFF5D0;border:3px solid #E2BD38;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);border-radius: 50px 10px;margin: 10px">
                <h3 style="margin-left:5px">Your order has been placed successfully at Aaswad Caterers!</h3>
                <br />
                <br />
            </div>
            <div style="background-color:#000;color:#E8CC69;">
                <h3 style="text-align:center;">Email :varsha.vanpal@gmail.com </h3>
                <h3 style="text-align:center;">Phone number :9742814239</h3>
            </div>
        </div>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}

// 3.Order has been approved and billing estimation
module.exports.orderApproved = (req, res) => {

    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'Order has been Approved',
        attachments: [{
            filename: 'aaswad-logo-email.png',
            path: `${__dirname}/../images/aaswad-logo-email.png`,
            cid: 'logo' //same cid value as in the html img src
        }],
        html: `
        <div style="background-color:#E8CC69;">
            <img src="cid:logo" alt="logo" style="display:block;margin-left:auto;margin-right:auto;"/>
            <div style="background-color:#FFF5D0;border:3px solid #E2BD38;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);border-radius: 50px 10px;margin: 10px">
                <h3 style="margin-left:5px">Your order has been Approved!</h3>
                <br />
                <br />
            </div>
            <div style="background-color:#000;color:#E8CC69;">
                <h3 style="text-align:center;">Email :varsha.vanpal@gmail.com </h3>
                <h3 style="text-align:center;">Phone number :9742814239</h3>
            </div>
        </div>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}

// 4.Order has been rejected
module.exports.orderRejected = (req, res) => {

    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'Order has been rejected',
        html: `<h1>Sorry, your order has been Rejected </h1>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}

// 5.Order has been Completed 
module.exports.orderCompleted = (req, res) => {

    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'Order completed successfully',
        html: `<h1>Your order has been Completed .</h1>
        <h1>You can now provide your feedback by clicking on user icon and going to My Orders and selecting your order</h1>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}

// 6.Bill 
module.exports.bill = (req, res) => {

    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'Order bill',
        html: `<h1>Your Bill </h1>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}

// 7.Account deletion
module.exports.deleteAccount = (req, res) => {

    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'Account deletion',
        html: `<h1>Your Account has been deleted </h1>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}
// 8.Forgot password
module.exports.forgotPassword = (req, res) => {

    var mailOptions = {
        from: NODEMAILER_USER,
        to: [req.body.email,],
        subject: 'password recovery',
        html: `<h1>Forgot password : reset link </h1>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}

// admin notification for new order
module.exports.newOrderNotify = (req, res) => {
    const username = req.body.username
    var mailOptions = {
        from: NODEMAILER_USER,
        to: [NODEMAILER_USER,],
        subject: 'You have a new order',
        html: `<h1>There is a new order placed by :${username}</h1>
        <h1>Make sure to respond asap</h1>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('you have error')
            console.log(error)
        } else {
            console.log('Email sent', info.response)
        }
    })
}