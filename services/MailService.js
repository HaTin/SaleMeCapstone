const nodemailer = require('nodemailer');
// const util = require('util');
const smtpTransport = require('nodemailer-smtp-transport');
const sendMail = ({ receiver, customerEmail }) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'hatin068@gmail.com',
            pass: 'abc12345$'
        },
        tls: { rejectUnauthorized: false }
    }));
    var mainOptions = {
        from: 'Buyer Assistant',
        to: receiver,
        subject: 'Customer Question',
        text: 'You recieved message from Buyer Assistant ',
        html: `<p> Question from ${customerEmail}</p>`
    }
    // const sendMailObj = util.promisify(transporter.sendMail)
    // const sendMailObj(mainOptions)
    return new Promise((resolve, reject) => {
        transporter.sendMail(mainOptions, function (err, info) {
            if (err) reject(err)
            resolve(info)
            transporter.close()
        })
    })
}
module.exports = {
    sendMail
}