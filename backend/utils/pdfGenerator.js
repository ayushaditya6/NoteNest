const PDFDocument = require('pdfkit');
const fs = require('fs');

// Helper function to draw table
function drawTable(doc, startX, startY, headers, rows) {
  const columnWidth = 200;
  const rowHeight = 30;
  let y = startY;

  // Draw header
  doc.fontSize(12).fillColor('black');
  headers.forEach((header, i) => {
    doc.rect(startX + i * columnWidth, y, columnWidth, rowHeight).stroke();
    doc.text(header, startX + i * columnWidth + 5, y + 5);
  });
  y += rowHeight;

  // Draw rows
  rows.forEach(row => {
    row.forEach((cell, i) => {
      doc.rect(startX + i * columnWidth, y, columnWidth, rowHeight).stroke();
      doc.text(cell, startX + i * columnWidth + 5, y + 5);
    });
    y += rowHeight;
  });
}

// Function to generate PDF
exports.generatePDF = (orderData) => {
  const { firstName, lastName, phone, email, address, address2, country, state, zip, cartItems, subtotal, shipping } = orderData;

  const doc = new PDFDocument();
  const pdfPath = 'order_details.pdf';
  doc.pipe(fs.createWriteStream(pdfPath));

  doc.fontSize(20).text('New Order Details', { align: 'center' });
  doc.fontSize(18).text('Aditya Enterprises', { align: 'center' });
  doc.fontSize(10).text('Patna, Bihar - 800007', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Name: ${firstName} ${lastName}`);
  doc.text(`Contact no: ${phone}`);
  doc.text(`Email: ${email}`);
  doc.text(`Address: ${address} ${address2 ? ', ' + address2 : ''}`);
  doc.text(`Country: ${country}`);
  doc.text(`State: ${state}`);
  doc.text(`Zip: ${zip}`);
  doc.moveDown();

  // Table headers and rows
  const headers = ['Product', 'Price', 'Quantity'];
  const rows = cartItems.map(item => [item.name, `$${item.price}`, item.qty]);

  // Draw table
  drawTable(doc, 50, doc.y, headers, rows);

  // Draw summary and message in a box
  const boxTop = doc.y + 20;
  const boxHeight = 100;
  const boxWidth = 400;

  doc.moveDown();
  doc.rect(50, boxTop, boxWidth, boxHeight).stroke();
  doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 60, boxTop + 10);
  doc.text(`Shipping: $${shipping.toFixed(2)}`, 60, boxTop + 30);
  doc.text(`Total: $${(subtotal + shipping).toFixed(2)} (incl. all tax)`, 60, boxTop + 50);
  doc.text(`Thanks for shopping with us!`, 60, boxTop + 70);
  doc.text(`Your item will be delivered within 3-4 working days.`, 60, boxTop + 90);
  doc.end();

  return pdfPath;
};
