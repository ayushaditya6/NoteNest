const transporter = require('../config/nodemailerConfig');
const { generatePDF } = require('../utils/pdfGenerator');
const fs = require('fs');

exports.sendEmail = (req, res) => {
  const { firstName, lastName, phone, email, address, address2, country, state, zip, cartItems, subtotal, shipping } = req.body;

  // Generate PDF
  const pdfPath = generatePDF({ firstName, lastName, phone, email, address, address2, country, state, zip, cartItems, subtotal, shipping });

  // After PDF generation is completed
  const mailOptions = {
    from: process.env.EMAIL,
    to: `${email}, ${process.env.EMAIL}`,
    subject: 'New Order',
    text: 'Please find attached the details of the new order.',
    attachments: [
      {
        filename: 'order_details.pdf',
        path: pdfPath,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    fs.unlinkSync(pdfPath); // Delete the PDF file after sending the email
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email: ' + error.toString());
    }
    res.status(200).send('Order Successful: Email has been sent');
  });
};
