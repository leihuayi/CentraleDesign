var nodemailer = require('nodemailer');
var config = require('./config');

module.exports = nodemailer.createTransport('SMTP', {
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
        user: config.email.auth.user,
        pass: config.email.auth.pass
    }
});