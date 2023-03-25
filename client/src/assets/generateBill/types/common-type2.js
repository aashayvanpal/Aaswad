
// PDF Generator imports
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { fillData, backgroundGenerate, showAdvancePayment } from '../blocks'

// Image import SVG
import imgData from '../images/image-exports'


const pdfGenerate = ({ name = 'default name',
    date = 'default date',
    mobile = 'default mobile',
    items = 'default items',
    transportation = 'default transportation',
    total = 'default total',
    advancePayment = 'default advancepayment',
    balanceAmount = 'default balanceAmount',
    particulars = "default particulars",
    numberOfPeople = "default no of people",
    plateCost = "default plate cost"
}) => {

    var doc = new jsPDF('protrait', 'px', 'a4', 'false')

    // addImage(imageData, format, x, y, width, height, alias, compression, rotation)


    backgroundGenerate(doc)

    doc.setPage(1)


    doc.addImage(imgData, 'JPEG', 120, 30, 200, 80)


    // User details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(45, 150, `Name  :  ${name}`,)
    doc.text(45, 165, `Date    :  ${date}`)
    doc.text(45, 180, `Mobile :  ${mobile}`)



    // Order table
    doc.autoTable({
        head: [['Sl No', 'Particulars', 'Quantity', 'Rate(Rs.)', 'Amount(Rs.)']],
        theme: 'grid',
        headStyles: {
            fillColor: [226, 189, 56],
            lineWidth: 0.5, // 1 is too thick for me
            lineColor: [220, 220, 220], // Or gray level single value from 0-255 
            halign: 'center',
            valign: 'middle',
        },
        columnStyles: {
            0: { cellWidth: 40 },
            1: { cellWidth: 110 },
            2: { cellWidth: 65 },
            3: { cellWidth: 65 },
            4: { cellWidth: 100 },
        },
        styles: {
            fontSize: 17
        },
        startY: 220,
        body: [
            [{
                content: 1,
                colSpan: 1,
                styles: {
                    halign: 'center',
                    valign: 'middle',
                    with: '200'

                }
            },
            {
                content: particulars,
                styles: {
                    halign: 'center',
                    valign: 'middle',

                }
            }, {
                content: `${numberOfPeople} plates`,
                styles: {
                    halign: 'center',
                    valign: 'middle',

                }
            }, {
                content: `${plateCost}/-`,
                styles: {
                    halign: 'center',
                    valign: 'middle',

                }
            }, {
                content: `${numberOfPeople * plateCost}/- `,
                styles: {
                    halign: 'center',
                    valign: 'middle',
                }
            }],
            [{
                content: 'Transportation',
                colSpan: 4,
                styles: {
                    halign: 'right',
                }
            }, {
                content: `${transportation}/-`,
                colSpan: 1,
                styles: {
                    halign: 'center',
                }
            }],
            [{
                content: 'Total',
                colSpan: 4,
                styles: {
                    halign: 'right',
                    fontStyle: 'bold'
                }
            }, {
                content: `${total + transportation}/-`,
                colSpan: 1,
                styles: {
                    halign: 'center',
                    fontStyle: 'bold'
                }
            }],
        ],
        didDrawPage: function (data) {
            // check if the current page is full
            // if (doc.autoTable.previous.finalY >= doc.internal.pageSize.getHeight()) {
            //     // render the background color to all pages in the document
            //     backgroundGenerate()
            //     //   doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
            // }
            if (doc.autoTable.previous.finalY >= doc.internal.pageSize.height - 10) {
                // add a new page to the document
                doc.addPage();

                // set the background color for the new page
                doc.setFillColor('#ffe175');
                doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
            }
        }

    }
    )

    let finalY = doc.lastAutoTable.finalY; // The y position on the page
    // Caterer details
    doc.text(45, finalY + 50, 'From : Varsha Vanpal')
    doc.text(45, finalY + 50 + 15, 'Mobile : 9742814239')



    // Sets name of the file
    doc.save(`${name}-${date}.pdf`)
}

export default pdfGenerate