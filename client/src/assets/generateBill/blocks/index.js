const fillData = (items) => {
    // items.get row
    console.log('items to fill data:', items)
    const output = items.map((item, index) => {
        console.log("item :", item)
        return [{
            content: index + 1,
            colSpan: 1,
            styles: {
                halign: 'center',
                valign: 'middle',
                with: '200'

            }
        },
        {
            content: item.name,
            styles: {
                halign: 'left',
                valign: 'middle',

            }
        }, {
            content: `${item.quantity} ${item.measured}`,
            styles: {
                halign: 'center',
                valign: 'middle',

            }
        }, {
            content: ` ${item.price}/-`,
            styles: {
                halign: 'center',
                valign: 'middle',

            }
        }, {
            content: `${item.price * item.quantity}/-`,
            styles: {
                halign: 'center',
                valign: 'middle',
            }
        }]
    })
    return output
}


const backgroundGenerate = (doc) => {
    // creates 2 pages fist
    for (let i = 1; i <= 1; i++) {
        if (i !== 1) {

            doc.addPage();
        }

        doc.setFillColor('#ffe175');
        // doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F'); // draw rectangle
        // doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');


        doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F'); // draw rectangle and fill color

        doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S'); // border1
        doc.rect(25, 25, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 50, 'S'); // border2
    }
}



const showAdvancePayment = (advancePayment) => advancePayment ? ([{
    content: `Advance Payment(-)`,
    colSpan: 4,
    styles: {
        halign: 'right'
    }
}, {
    content: `${advancePayment}/-`,
    colSpan: 1,
    styles: {
        halign: 'center'
    }
}]) : ([{
    content: 'Advance Payment',
    colSpan: 4,
    styles: {
        halign: 'right'
    }
}, {
    content: `0/-`,
    colSpan: 1,
    styles: {
        halign: 'center'
    }
}])



const getRow = (slNo, particulars, quantity, rate, amount) => {
    // return row

    // return ['1', 'Test', 'Quantity1', 'Rate1', 'Amount321231']
    return [slNo, particulars, quantity, rate, amount]
}


export { fillData, backgroundGenerate, showAdvancePayment, getRow }