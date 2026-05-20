// Backend config — sensitive values loaded from .env (see .env.example)
module.exports.mongodburl = process.env.MONGODB_URL || 'mongodb+srv://aashay:qEddpOQCjJYVAqly@cluster-main.u9ycr.mongodb.net/AaswadCaterers-app?retryWrites=true&w=majority'
module.exports.NODEMAILER_USER = process.env.NODEMAILER_USER || 'aashay.vanpal@gmail.com'
module.exports.NODEMAILER_PASS = process.env.NODEMAILER_PASS || 'uecejfkwzqkkpfes'
module.exports.NODEMAILER_SERVICE = process.env.NODEMAILER_SERVICE || 'gmail'