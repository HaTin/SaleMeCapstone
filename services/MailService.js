require('dotenv').config();
const nodemailer = require('nodemailer');
const path = require('path')
const fs = require('fs')

// const util = require('util');
const smtpTransport = require('nodemailer-smtp-transport');
const sendMail = ({ receiver, customerEmail, redirectURL, question }) => {
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'hatin068@gmail.com',
            pass: 'abc12345$'
        },
        tls: { rejectUnauthorized: false }
    }));
    const filePath = path.join(__dirname, '../template/email.html')
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
            if (err) reject(err)
            const content = `<br><center><h2>Bạn nhận được câu hỏi của khách hàng ${customerEmail} từ hệ thống SaleMe</h2>            
            <div><span style="font-weight: bold">Câu hỏi của khách hàng:</span><span> ${question}</span></div>
            <div><a class="button-mobile" href="${redirectURL}">Nhấn vào đây để xem chi tiết cuộc trò chuyện</a></div>
            <div>Hệ thống hiện tại không thể trả lời câu hỏi này </div>
            <br><br><br><br>`
            data = data.replace(/CONTENT_HTML/g, content)
            var mainOptions = {
                from: 'SaleMe <noreply1242@gmail.com>',
                to: receiver,
                subject: 'Câu hỏi của khách hàng',
                text: '',
                html: data
            }
            transporter.sendMail(mainOptions, function (err, info) {
                if (err) reject(err)
                resolve(info)
                transporter.close()
            })
        })
    })
}
module.exports = {
    sendMail
}