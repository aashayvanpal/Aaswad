// making 2 files for easy deployment and management for configurations 
// Use this file for configuring the changes
module.exports.axiosURL = 'https://aaswad.herokuapp.com'
module.exports.mongodburl = process.env.MONGODB_URI
module.exports.appVersion = 'v1.0.5.9 T1'
module.exports.NODEMAILER_USER = process.env.NODEMAILER_USER
module.exports.NODEMAILER_PASS = process.env.NODEMAILER_PASS
module.exports.NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE