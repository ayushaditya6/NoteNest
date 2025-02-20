const nodemailer = require('nodemailer');


// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "process.env.EMAIL",
    pass: "process.env.PASSWORD",
  },
});

module.exports = transporter;
