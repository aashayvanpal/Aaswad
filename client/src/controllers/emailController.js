var nodemailer = require('nodemailer')
var { NODEMAILER_SERVICE, NODEMAILER_USER, NODEMAILER_PASS } = require('../config/main.js')

var transporter = nodemailer.createTransport({
    service: NODEMAILER_SERVICE,
    auth: {
        user: NODEMAILER_USER,
        pass: NODEMAILER_PASS
    }
})

const BRAND = {
    gold: '#C9A227',
    goldLight: '#F5E6B0',
    goldDark: '#9a7a1a',
    bg: '#ffffff',
    text: '#2d2d2d',
    muted: '#666666',
    email: 'varsha.vanpal@gmail.com',
    phone: '+91 97428 14239',
    name: 'Aaswad Caterers',
}

function emailWrapper(content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${BRAND.name}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:#1a1400;padding:28px 40px;text-align:center;border-bottom:3px solid ${BRAND.gold};">
              <img src="cid:logo" alt="${BRAND.name}" style="max-height:60px;display:block;margin:0 auto 10px;" />
              <p style="margin:0;color:${BRAND.gold};font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Premium Catering Services</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eeeeee;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#1a1400;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;color:${BRAND.gold};font-size:15px;font-weight:600;">${BRAND.name}</p>
              <p style="margin:0 0 4px;color:#aaa;font-size:12px;">${BRAND.email} &nbsp;|&nbsp; ${BRAND.phone}</p>
              <p style="margin:8px 0 0;color:#555;font-size:11px;">© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function statusBadge(label, color) {
    return `<span style="display:inline-block;background-color:${color};color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${label}</span>`
}

function infoRow(label, value) {
    return `
    <tr>
      <td style="padding:8px 0;color:${BRAND.muted};font-size:14px;width:140px;">${label}</td>
      <td style="padding:8px 0;color:${BRAND.text};font-size:14px;font-weight:600;">${value || '—'}</td>
    </tr>`
}

function logoAttachment() {
    return [{
        filename: 'aaswad-logo-email.png',
        path: `${__dirname}/../images/aaswad-logo-email.png`,
        cid: 'logo'
    }]
}

function sendMail(options) {
    transporter.sendMail(options, (error, info) => {
        if (error) console.error('[Email error]', error)
        else console.log('[Email sent]', info.response)
    })
}

// 1. Welcome / account created
module.exports.welcome = (req, res) => {
    const { fullName, email, phonenumber } = req.body

    const content = `
      <p style="margin:0 0 6px;font-size:13px;color:${BRAND.gold};font-weight:600;letter-spacing:1px;text-transform:uppercase;">Welcome to the Family</p>
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">Hello, ${fullName}!</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        Thank you for creating an account with <strong>${BRAND.name}</strong>. We're delighted to have you on board.
        Your account is ready — you can now browse our menu and place orders with ease.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background-color:#fafafa;border:1px solid #eeeeee;border-radius:6px;padding:4px 16px;margin-bottom:28px;">
        <tbody>
          ${infoRow('Full Name', fullName)}
          ${infoRow('Email', email)}
          ${infoRow('Phone', phonenumber)}
        </tbody>
      </table>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;line-height:1.6;">
        If you have any questions, feel free to reach out to us at <a href="mailto:${BRAND.email}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.email}</a>.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: `Welcome to ${BRAND.name}!`,
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 2. Order placed
module.exports.orderPlaced = (req, res) => {
    const { email, fullName } = req.body

    const content = `
      <div style="margin-bottom:20px;">${statusBadge('Order Placed', '#2e7d32')}</div>
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">Your order is confirmed!</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        ${fullName ? `Hi <strong>${fullName}</strong>, your` : 'Your'} order has been successfully placed with <strong>${BRAND.name}</strong>.
        Our team will review it shortly and get back to you with a confirmation.
      </p>
      <div style="background-color:#f9f6ec;border-left:4px solid ${BRAND.gold};padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:28px;">
        <p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.6;">
          <strong>What happens next?</strong><br/>
          Our team will review your order and send you an approval confirmation.
          You can also track your order status by visiting <em>My Orders</em> in the app.
        </p>
      </div>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        Questions? Contact us at <a href="mailto:${BRAND.email}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.email}</a> or call <strong>${BRAND.phone}</strong>.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: 'Your order has been placed — Aaswad Caterers',
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 3. Order approved
module.exports.orderApproved = (req, res) => {
    const { fullName, email, phonenumber } = req.body

    const content = `
      <div style="margin-bottom:20px;">${statusBadge('Approved', '#1565c0')}</div>
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">Great news, ${fullName ? fullName : 'there'}!</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        Your order has been <strong>approved</strong> by our team. We are now preparing everything to ensure
        a seamless catering experience for you.
      </p>
      ${phonenumber ? `
      <table cellpadding="0" cellspacing="0" style="width:100%;background-color:#fafafa;border:1px solid #eeeeee;border-radius:6px;padding:4px 16px;margin-bottom:28px;">
        <tbody>
          ${infoRow('Name', fullName)}
          ${infoRow('Contact', phonenumber)}
        </tbody>
      </table>` : ''}
      <div style="background-color:#f9f6ec;border-left:4px solid ${BRAND.gold};padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:28px;">
        <p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.6;">
          Our team will be in touch with you regarding the final arrangements.
          Please keep an eye on your email and phone for further updates.
        </p>
      </div>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        Reach us anytime at <a href="mailto:${BRAND.email}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.email}</a> or <strong>${BRAND.phone}</strong>.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: 'Your order has been approved — Aaswad Caterers',
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 4. Order rejected
module.exports.orderRejected = (req, res) => {
    const { email, fullName } = req.body

    const content = `
      <div style="margin-bottom:20px;">${statusBadge('Order Rejected', '#c62828')}</div>
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">We're sorry${fullName ? ', ' + fullName : ''}</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        Unfortunately, we were unable to fulfil your order at this time.
        This could be due to unavailability of dates, capacity constraints, or other operational reasons.
      </p>
      <div style="background-color:#fff5f5;border-left:4px solid #c62828;padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:28px;">
        <p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.6;">
          We apologise for the inconvenience. Please feel free to place a new order for a different date,
          or contact us directly so we can explore alternatives for you.
        </p>
      </div>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        We value your business and hope to serve you soon. Contact us at
        <a href="mailto:${BRAND.email}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.email}</a> or <strong>${BRAND.phone}</strong>.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: 'Update on your order — Aaswad Caterers',
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 5. Order completed
module.exports.orderCompleted = (req, res) => {
    const { email, fullName } = req.body

    const content = `
      <div style="margin-bottom:20px;">${statusBadge('Completed', '#2e7d32')}</div>
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">Order completed successfully!</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        ${fullName ? `Hi <strong>${fullName}</strong>, we` : 'We'} hope you enjoyed the catering experience with <strong>${BRAND.name}</strong>.
        Your order has been marked as completed. It was a pleasure serving you!
      </p>
      <div style="background-color:#f9f6ec;border-left:4px solid ${BRAND.gold};padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:28px;">
        <p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.6;">
          <strong>Share your feedback</strong><br/>
          Your opinion matters to us. You can leave a review by visiting <em>My Orders</em> in the app,
          selecting this order, and submitting your feedback.
        </p>
      </div>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        Thank you for choosing ${BRAND.name}. We look forward to serving you again!
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: 'Your order is complete — Thank you! | Aaswad Caterers',
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 6. Bill
module.exports.bill = (req, res) => {
    const { email, fullName } = req.body

    const content = `
      <p style="margin:0 0 6px;font-size:13px;color:${BRAND.gold};font-weight:600;letter-spacing:1px;text-transform:uppercase;">Invoice</p>
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">Your Bill from ${BRAND.name}</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        ${fullName ? `Hi <strong>${fullName}</strong>, p` : 'P'}lease find your bill details for your recent order attached or available in the app under <em>My Orders</em>.
      </p>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        For any billing queries, contact us at <a href="mailto:${BRAND.email}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.email}</a> or <strong>${BRAND.phone}</strong>.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: 'Your bill from Aaswad Caterers',
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 7. Account deletion
module.exports.deleteAccount = (req, res) => {
    const { email, fullName } = req.body

    const content = `
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">Account Deleted</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        ${fullName ? `Hi <strong>${fullName}</strong>, your` : 'Your'} account with <strong>${BRAND.name}</strong> has been successfully deleted.
        All your personal data has been removed from our system.
      </p>
      <div style="background-color:#fafafa;border:1px solid #eeeeee;border-radius:6px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.6;">
          If this was a mistake or you'd like to rejoin in the future, you're always welcome to create a new account.
        </p>
      </div>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        We're sorry to see you go. If you have feedback, reach us at <a href="mailto:${BRAND.email}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.email}</a>.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: 'Your account has been deleted — Aaswad Caterers',
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 8. Forgot password
module.exports.forgotPassword = (req, res) => {
    const { email, resetLink, fullName } = req.body

    const content = `
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">Password Reset Request</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        ${fullName ? `Hi <strong>${fullName}</strong>, we` : 'We'} received a request to reset the password for your <strong>${BRAND.name}</strong> account.
      </p>
      ${resetLink ? `
      <div style="text-align:center;margin-bottom:28px;">
        <a href="${resetLink}" style="display:inline-block;background-color:${BRAND.gold};color:#1a1400;padding:14px 32px;border-radius:6px;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">Reset My Password</a>
      </div>
      <p style="margin:0 0 16px;color:${BRAND.muted};font-size:13px;text-align:center;">
        Or copy and paste this link into your browser:<br/>
        <a href="${resetLink}" style="color:${BRAND.gold};font-size:12px;word-break:break-all;">${resetLink}</a>
      </p>` : ''}
      <div style="background-color:#fafafa;border:1px solid #eeeeee;border-radius:6px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;color:${BRAND.muted};font-size:13px;line-height:1.6;">
          If you did not request a password reset, please ignore this email or contact us immediately — your account remains secure.
        </p>
      </div>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        Need help? Reach us at <a href="mailto:${BRAND.email}" style="color:${BRAND.gold};text-decoration:none;">${BRAND.email}</a>.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [email],
        subject: 'Password reset request — Aaswad Caterers',
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}

// 9. Admin: new order notification
module.exports.newOrderNotify = (req, res) => {
    const { username, eventName, eventDate } = req.body

    const content = `
      <div style="margin-bottom:20px;">${statusBadge('New Order', '#6a1b9a')}</div>
      <h1 style="margin:0 0 16px;font-size:24px;color:${BRAND.text};font-weight:700;">New order received</h1>
      <p style="margin:0 0 28px;color:${BRAND.muted};font-size:15px;line-height:1.7;">
        A new order has been placed on <strong>${BRAND.name}</strong>. Please review it promptly and take action.
      </p>
      <table cellpadding="0" cellspacing="0" style="width:100%;background-color:#fafafa;border:1px solid #eeeeee;border-radius:6px;padding:4px 16px;margin-bottom:28px;">
        <tbody>
          ${infoRow('Placed by', username)}
          ${eventName ? infoRow('Event', eventName) : ''}
          ${eventDate ? infoRow('Event Date', eventDate) : ''}
        </tbody>
      </table>
      <p style="margin:0;color:${BRAND.muted};font-size:13px;">
        Log in to the admin panel to approve or manage this order.
      </p>`

    sendMail({
        from: `${BRAND.name} <${NODEMAILER_USER}>`,
        to: [NODEMAILER_USER],
        subject: `New order from ${username} — Action required`,
        attachments: logoAttachment(),
        html: emailWrapper(content)
    })
}
