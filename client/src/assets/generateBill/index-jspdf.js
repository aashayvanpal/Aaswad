import jsPDF from 'jspdf'
import 'jspdf-autotable'
import imgData from './images/image-exports'
import NotoSansDevanagari from './NotoSansDevanagari-Regular.ttf';
const font = new Uint8Array(NotoSansDevanagari);

const getRow = (slNo, particulars, quantity, rate, amount) => {
    // return row

    // return ['1', 'Test', 'Quantity1', 'Rate1', 'Amount321231']
    return [slNo, particulars, quantity, rate, amount]
}
const fillData = (items) => {
    // items.get row
    console.log('items to fill data:', items)
    const output = items.map((item, index) => [{
        content: index + 1,
        styles: {
            halign: 'center'
        }
    },
    {
        content: item.name,
        styles: {
            halign: 'left'
        }
    }, {
        content: item.quantity,
        styles: {
            halign: 'center'
        }
    }, {
        content: '&#8377;' + `  ${item.price}/-`,
        styles: {
            halign: 'center'
        }
    }, {
        content: `${item.price * item.quantity}/-`,
        styles: {
            halign: 'center'
        }
    }])
    return output
}

const pdfGenerate = ({ name = 'default name', date = 'default date', mobile = 'default mobile', items = 'default items',
    transportation = 'default transportation', total = 'default total', advancePayment = 'default advancepayment', balanceAmount = 'default balanceAmount' }) => {
    var doc = new jsPDF('protrait', 'px', 'a4', 'false')
    doc.addFileToVFS('NotoSansDevanagari-Regular.ttf', font);
    doc.addFont('NotoSansDevanagari-Regular.ttf', 'NotoSansDevanagari', 'normal');
    doc.setFont('NotoSansDevanagari');
    doc.setFillColor('#ffe175');
    doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

    doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');
    doc.rect(25, 25, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 50, 'S');
    // doc.addPage()

    // doc.setFontSize(25);
    // doc.setTextColor(255, 0, 0);
    // doc.text(40, 60, 'Hello')


    // User details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(45, 150, `Name : ${name}`,)
    doc.text(45, 165, `Date :${date}`)
    doc.text(45, 180, `Mobile :${mobile}`)

    // Order table
    // doc.table(45, 195, { 'name': "name1", 'email': 'email1' }, ['h1', 'h2'], [2, 2])
    doc.autoTable({
        head: [['Sl No', 'Particulars', 'Quantity', 'Rate', 'Amount']],
        theme: 'grid',
        headStyles: { fillColor: [226, 189, 56] },
        styles: {
            fontSize: 20
        },
        startY: 220,
        body: [
            ...fillData(items),
            [{
                // content: 'Transportation ₹',
                content: '₹',
                colSpan: 4,
                styles: {
                    halign: 'right'
                }
            }],
            [{
                content: 'Total',
                colSpan: 4,
                styles: {
                    halign: 'right'
                }
            }],
            [{
                content: 'Advance Payment',
                colSpan: 4,
                styles: {
                    halign: 'right'
                }
            }],
            [{
                content: 'Balance',
                colSpan: 4,
                styles: {
                    halign: 'right'
                }
            }]
        ],
    })
    // Caterer details
    doc.text(45, 500, 'From : Varsha Vanpal')
    doc.text(45, 550, 'From : ₹')
    doc.text(45, 515, 'Mobile : 9742814239')


    // addImage(imageData, format, x, y, width, height, alias, compression, rotation)
    // doc.addImage(imgData, 'JPEG', 120, 30, 200, 80)
    doc.save('bill.pdf')
}

export default pdfGenerate