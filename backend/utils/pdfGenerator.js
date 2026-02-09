const PDFDocument = require('pdfkit');

const generateLabReport = (res, data) => {
    const doc = new PDFDocument({ margin: 50 });

    // Set headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report_${data.name}.pdf`);

    doc.pipe(res);

    // Header: Lab Branding
    doc.fontSize(20).text('PURVA CLINICAL LABORATORY', { align: 'center' });
    doc.fontSize(10).text('Pune, Maharashtra | WhatsApp: ' + data.phone_number, { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, 100).lineTo(550, 100).stroke();

    // Patient Info
    doc.moveDown(2);
    doc.fontSize(12).text(`Patient Name: ${data.name.toUpperCase()}`, { continued: true });
    doc.text(` | Age/Sex: ${data.age}/${data.gender}`, { align: 'right' });
    doc.text(`Date: ${new Date(data.recorded_at).toLocaleDateString()}`);
    doc.text(`Referred By: Self / Internal Doctor`);
    doc.moveDown();
    doc.moveTo(50, 170).lineTo(550, 170).stroke();

    // Test Results Table
    doc.moveDown(2);
    doc.fontSize(14).text('LABORATORY REPORT', { underline: true });
    doc.moveDown();

    doc.fontSize(12).text('TEST NAME', 50, 220);
    doc.text('RESULT', 250, 220);
    doc.text('NORMAL RANGE', 400, 220);
    
    doc.moveDown();
    doc.fontSize(12).text(`${data.test_name}`, 50, 250);
    doc.fillColor(data.result_value === 'Pending' ? 'red' : 'blue').text(`${data.result_value}`, 250, 250);
    doc.fillColor('black').text(`${data.normal_range}`, 400, 250);

    // Footer
    doc.fontSize(10).text('This is a computer-generated report.', 50, 700, { align: 'center' });
    doc.text('Technician Signature', 400, 680);

    doc.end();
};

module.exports = { generateLabReport };