import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'

// ─── Brand palette (RGB) ─────────────────────────────────────────
const GOLD      = [201, 162,  39]
const GOLD_LITE = [255, 248, 215]
const DARK      = [ 26,  20,   0]
const WHITE     = [255, 255, 255]
const CREAM     = [253, 250, 244]
const GRAY      = [140, 130, 110]
const GRAY_LT   = [238, 235, 228]
const GRAY_DK   = [ 70,  62,  42]
const RED       = [170,  45,  45]

const PW = 210  // A4 width  (mm)
const PH = 297  // A4 height (mm)
const M  = 14   // margin    (mm)
const CW = PW - M * 2  // content width

// ─── Helpers ─────────────────────────────────────────────────────
const fmt = (n) => `Rs. ${Number(n).toLocaleString('en-IN')}`

// ─── Page 1 hero header ───────────────────────────────────────────
const drawHeroHeader = (doc) => {
  // Dark background
  doc.setFillColor(...DARK)
  doc.rect(0, 0, PW, 46, 'F')

  // Gold accent bar at base of header
  doc.setFillColor(...GOLD)
  doc.rect(0, 43, PW, 3, 'F')

  // Left side — company name
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(21)
  doc.setTextColor(...GOLD)
  doc.text('AASWAD CATERERS', M, 19)

  // Tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...GOLD_LITE)
  doc.text('Homely  ·  Tasty  ·  Healthy  ·  Pure Veg', M, 28)

  // Contact
  doc.setFontSize(7.5)
  doc.setTextColor(...GOLD_LITE)
  doc.text('Varsha Vanpal   |   +91 97428 14239', M, 36)

  // Right side — INVOICE
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(26)
  doc.setTextColor(...WHITE)
  doc.text('INVOICE', PW - M, 24, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...GOLD_LITE)
  doc.text('Aaswad Caterers', PW - M, 33, { align: 'right' })
}

// ─── Page 2+ compact header ───────────────────────────────────────
const drawCompactHeader = (doc) => {
  doc.setFillColor(...DARK)
  doc.rect(0, 0, PW, 18, 'F')
  doc.setFillColor(...GOLD)
  doc.rect(0, 16, PW, 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...GOLD)
  doc.text('AASWAD CATERERS', M, 11)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...GOLD_LITE)
  doc.text('INVOICE — continued', PW - M, 11, { align: 'right' })
}

// ─── Bill-To / Date cards ─────────────────────────────────────────
const drawBillInfo = (doc, { name, mobile, date }) => {
  const y    = 52
  const h    = 28
  const lw   = 88   // left card width
  const rw   = 65   // right card width
  const rx   = PW - M - rw

  // Left — Bill To
  doc.setFillColor(...GRAY_LT)
  doc.roundedRect(M, y, lw, h, 2, 2, 'F')
  // Gold left accent
  doc.setFillColor(...GOLD)
  doc.rect(M, y, 1.5, h, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...GRAY)
  doc.text('BILL TO', M + 5, y + 7)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...DARK)
  doc.text(name, M + 5, y + 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...GRAY_DK)
  doc.text(`+91 ${mobile}`, M + 5, y + 23)

  // Right — Date
  doc.setFillColor(...GRAY_LT)
  doc.roundedRect(rx, y, rw, h, 2, 2, 'F')
  doc.setFillColor(...GOLD)
  doc.rect(rx, y, 1.5, h, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(...GRAY)
  doc.text('EVENT DATE', rx + 5, y + 7)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...DARK)
  doc.text(moment(date).format('DD MMM YYYY'), rx + 5, y + 17)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...GRAY)
  doc.text(moment(date).format('dddd'), rx + 5, y + 24)
}

// ─── "ITEMS ORDERED" section label ───────────────────────────────
const drawSectionLabel = (doc, y, label) => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(...GRAY)
  doc.text(label, M, y)
  doc.setDrawColor(...GOLD)
  doc.setLineWidth(0.25)
  doc.line(M, y + 1.5, PW - M, y + 1.5)
}

// ─── Summary block (right-aligned) ───────────────────────────────
const drawSummary = (doc, { items, miscItems, transportation, advancePayment, balanceAmount }) => {
  const itemsTotal  = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const hasTransport = transportation?.rate && Number(transportation.rate) > 0
  const hasMisc      = miscItems?.length > 0
  const hasAdvance   = advancePayment && Number(advancePayment) > 0

  const rows = []
  rows.push({ label: 'Items Total', value: itemsTotal })
  if (hasMisc) {
    miscItems.forEach(m => rows.push({ label: `  · ${m.particular}`, value: Number(m.rate), misc: true }))
  }
  if (hasTransport) {
    rows.push({ label: `Transport (${transportation.medium})`, value: Number(transportation.rate) })
  }
  if (hasAdvance) {
    rows.push({ label: 'Advance Paid', value: Number(advancePayment), deduct: true })
  }
  rows.push({ label: 'Balance Due', value: Number(balanceAmount), final: true })

  const ROW_H  = 8
  const BOX_W  = 95
  const BOX_X  = PW - M - BOX_W
  const BOX_H  = rows.length * ROW_H + 6
  let   sy     = doc.lastAutoTable.finalY + 10

  // Push to new page if not enough room
  if (sy + BOX_H + 30 > PH - M) {
    doc.addPage()
    drawCompactHeader(doc)
    sy = 26
  }

  // Container
  doc.setFillColor(...GRAY_LT)
  doc.roundedRect(BOX_X - 2, sy, BOX_W + 4, BOX_H, 2, 2, 'F')

  rows.forEach((row, i) => {
    const ry = sy + 6 + i * ROW_H

    if (row.final) {
      // Gold highlight row
      doc.setFillColor(...GOLD)
      doc.roundedRect(BOX_X - 2, ry - 5.5, BOX_W + 4, ROW_H + 0.5, 0, 0, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...DARK)
    } else if (row.deduct) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...RED)
    } else if (row.misc) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(...GRAY)
    } else {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...GRAY_DK)
    }

    doc.text(row.label, BOX_X + 2, ry)

    const val = row.deduct
      ? `- ${fmt(row.value)}`
      : fmt(row.value)
    doc.text(val, BOX_X + BOX_W - 2, ry, { align: 'right' })
  })

  // Separator above final row
  const sepY = sy + 6 + (rows.length - 1) * ROW_H - 6.5
  doc.setDrawColor(...GRAY)
  doc.setLineWidth(0.2)
  doc.line(BOX_X - 2, sepY, BOX_X + BOX_W + 2, sepY)

  return sy + BOX_H + 4
}

// ─── Footer ───────────────────────────────────────────────────────
const drawFooter = (doc, afterSummaryY) => {
  const totalPages = doc.internal.getNumberOfPages()

  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)

    const footerY = PH - 16

    doc.setDrawColor(...GOLD)
    doc.setLineWidth(0.3)
    doc.line(M, footerY, PW - M, footerY)

    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8.5)
    doc.setTextColor(...GRAY)
    doc.text('Thank you for choosing Aaswad Caterers!', PW / 2, footerY + 6, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(...GRAY)
    doc.text('Varsha Vanpal  ·  +91 97428 14239', PW / 2, footerY + 11, { align: 'center' })

    // Page number
    if (totalPages > 1) {
      doc.setFontSize(7)
      doc.setTextColor(...GRAY)
      doc.text(`Page ${p} of ${totalPages}`, PW - M, footerY + 6, { align: 'right' })
    }
  }
}

// ─── Main export ──────────────────────────────────────────────────
const pdfGenerate = ({
  name          = '',
  date          = new Date(),
  mobile        = '',
  items         = [],
  transportation = {},
  total         = 0,
  advancePayment = 0,
  balanceAmount  = 0,
  miscItems      = [],
}) => {
  const doc = new jsPDF('portrait', 'mm', 'a4')

  // Draw page-1 header and bill info before the table
  drawHeroHeader(doc)
  drawBillInfo(doc, { name, mobile, date })
  drawSectionLabel(doc, 86, 'ITEMS ORDERED')

  let pageCount = 0

  const tableBody = items.map((item, idx) => [
    idx + 1,
    item.name,
    `${item.quantity}${item.measured ? ' ' + item.measured : ''}`,
    fmt(item.price),
    fmt(item.price * item.quantity),
  ])

  doc.autoTable({
    head: [['#', 'Item / Particular', 'Qty', 'Rate', 'Amount']],
    body: tableBody,
    startY: 90,
    margin: { left: M, right: M, top: 22, bottom: 20 },
    theme: 'plain',
    headStyles: {
      fillColor: DARK,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: { top: 3.5, bottom: 3.5, left: 3, right: 3 },
    },
    columnStyles: {
      0: { cellWidth: 10,   halign: 'center'  },
      1: { cellWidth: 'auto', halign: 'left'  },
      2: { cellWidth: 25,   halign: 'center'  },
      3: { cellWidth: 28,   halign: 'right'   },
      4: { cellWidth: 32,   halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [252, 248, 237],
    },
    styles: {
      fontSize: 9,
      cellPadding: { top: 3, bottom: 3, left: 3, right: 3 },
      textColor: DARK,
      lineColor: [220, 215, 200],
      lineWidth: 0.2,
      overflow: 'linebreak',
    },
    // Gold accent on the Amount column header
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 4) {
        data.cell.styles.fillColor  = GOLD
        data.cell.styles.textColor  = DARK
        data.cell.styles.fontStyle  = 'bold'
      }
    },
    didDrawPage: () => {
      pageCount++
      if (pageCount > 1) {
        drawCompactHeader(doc)
      }
    },
  })

  const afterSummaryY = drawSummary(doc, {
    items,
    miscItems,
    transportation,
    advancePayment,
    balanceAmount,
  })

  drawFooter(doc, afterSummaryY)

  doc.save(`${name}-${moment(date).format('DD-MM-YYYY')}.pdf`)
}

export default pdfGenerate
