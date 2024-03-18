// import fs from "fs";
// import PDFDocument from "pdfkit";

// export function createInvoice(invoice, path) {
//     let doc = new PDFDocument({ size: "A4", margin: 50 });

//     generateHeader(doc);
//     generateCustomerInformation(doc, invoice);
//     generateInvoiceTable(doc, invoice);
//     generateFooter(doc);

//     doc.end();
//     doc.pipe(fs.createWriteStream(path));
// }
// function generateHeader(doc) {
//     doc
//         .fillColor("#444444")
//         .fontSize(20)
//         .text("MOTORENT Inc.", 110, 57)
//         .fontSize(10)
//         .text("MOTORENT Inc.", 200, 50, { align: "right" })
//         .text("123 Main Street", 200, 65, { align: "right" })
//         .text("Cairo, EG, 10025", 200, 80, { align: "right" })
//         .moveDown();
// }

// function generateCustomerInformation(doc, invoice) {
//     doc
//         .fillColor("#444444")
//         .fontSize(20)
//         .text("Invoice", 50, 160);

//     generateHr(doc, 185);

//     const customerInformationTop = 200;

//     doc
//         .fontSize(10)
//         .text("Invoice Number:", 50, customerInformationTop)
//         .font("Helvetica-Bold")
//         .text(invoice.invoice_nr, 150, customerInformationTop)
//         .font("Helvetica")
//         .text("Invoice Date:", 50, customerInformationTop + 15)
//         .text(formatDate(new Date()), 150, customerInformationTop + 15)
//         .text("Order Price:", 50, customerInformationTop + 30)
//         .text(
//             formatCurrency(invoice.paid),
//             150,
//             customerInformationTop + 30
//         )

//         .font("Helvetica-Bold")
//         .text(invoice.name, 300, customerInformationTop)
//         .font("Helvetica")
//         .text(invoice.address, 300, customerInformationTop + 15)
//         .text(
//             // invoice.shipping.city +
//             // ", " +
//             // invoice.shipping.state +
//             // ", " +
//             "Egypt",
//             300,
//             customerInformationTop + 30
//         )
//         .moveDown();

//     generateHr(doc, 252);
// }

// function generateInvoiceTable(doc, invoice) {
//     let i;
//     const invoiceTableTop = 330;

//     doc.font("Helvetica-Bold");
//     generateTableRow(
//         doc,
//         invoiceTableTop,
//         invoice.model,
//         // "Description",
//         "Item Price",
//         "Quantity",
//         "Item Total Price",
//     );
//     generateHr(doc, invoiceTableTop + 20);
//     doc.font("Helvetica");
//     // 
//     const position = invoiceTableTop + (i + 1) * 30;
//     generateTableRow(
//         doc,
//         position,
//         invoice.model,
//         // item.description,
//         // formatCurrency(item.amount / item.quantity),
//         formatCurrency(invoice.dailyRate),
//         1,
//         formatCurrency(invoice.paid)
//     );

//     generateHr(doc, position + 20);
//     // 

//     const dailyRatePosition = invoiceTableTop + (i + 1) * 30;
//     generateTableRow(
//         doc,
//         dailyRatePosition,
//         // "",
//         "",
//         "dailyRate",
//         "",
//         formatCurrency(invoice.dailyRate)
//     );

//     const paidToDatePosition = dailyRatePosition + 20;
//     generateTableRow(
//         doc,
//         paidToDatePosition,
//         // "",
//         "",
//         "Discount",
//         "",
//         formatCurrency(invoice.paid - invoice.dailyRate)
//     );

//     const duePosition = paidToDatePosition + 25;
//     doc.font("Helvetica-Bold");
//     generateTableRow(
//         doc,
//         duePosition,
//         // "",
//         "",
//         "Final Price",
//         "",
//         formatCurrency(invoice.paid)
//     );
//     doc.font("Helvetica");
// }

// function generateFooter(doc) {
//     doc
//         .fontSize(10)
//         .text(
//             "Payment is due within 15 days. Thank you for your business.",
//             50,
//             780,
//             { align: "center", width: 500 }
//         );
// }

// function generateTableRow(doc, y, item = invoice.model, unitCost, quantity, lineTotal) {
//     doc
//         .fontSize(10)
//         .text(item, 50, y)
//         // .text(description, 150, y)
//         .text(unitCost, 280, y, { width: 90, align: "right" })
//         .text(quantity, 370, y, { width: 90, align: "right" })
//         .text(lineTotal, 0, y, { align: "right" });
// }

// function generateHr(doc, y) {
//     doc
//         .strokeColor("#aaaaaa")
//         .lineWidth(1)
//         .moveTo(50, y)
//         .lineTo(550, y)
//         .stroke();
// }

// function formatCurrency(pounds) {
//     // return "EGP " + (pounds / 100).toFixed(2);
//     return "EGP " + pounds;
// }

// function formatDate(date) {
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();

//     return day + "/" + month + "/" + year;
// }




import fs from "fs";
import PDFDocument from "pdfkit";

export function createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}

function generateHeader(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("MOTORENT Inc.", 110, 57)
        .fontSize(10)
        .text("MOTORENT Inc.", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("Cairo, EG, 10025", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Order Price:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.paid),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.address, 300, customerInformationTop + 15)
        .text(
            "Egypt",
            300,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(doc, invoiceTableTop, invoice.model, formatCurrency(invoice.dailyRate), invoice.rentalDays, formatCurrency(invoice.paid));
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    const dailyRatePosition = invoiceTableTop + 50;
    generateTableRow(doc, dailyRatePosition, "", "Daily Rate", "", formatCurrency(invoice.dailyRate));

    const rentalDaysPosition = dailyRatePosition + 20;
    generateTableRow(doc, rentalDaysPosition, "", "Rental Days", "", invoice.rentalDays);

    const duePosition = rentalDaysPosition + 20;
    doc.font("Helvetica-Bold");
    generateTableRow(doc, duePosition, "", "Final Price", "", formatCurrency(invoice.paid));
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Motorent Inc. is always at your service. \n Thank you for your business.",
            50,
            700,
            { align: "center", width: 500 }
        );
}

function generateTableRow(doc, y, item, unitCost, quantity, lineTotal) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatCurrency(pounds) {
    return "EGP " + pounds;
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return day + "/" + month + "/" + year;
}
