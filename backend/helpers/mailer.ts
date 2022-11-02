const nodemailer = require('nodemailer');

const sendEmail = (emailTo: any, message: any, subject: any, callback: any) => {
  const mailOptions = {
    from: 'noreply@portfolio.com',
    to: emailTo,
    subject: subject,
    text: message
  };

  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    host: process.env.HOST,
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  transporter.sendMail(mailOptions, function (err: any, info: any) {
    if (err) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

exports.sendEmail = sendEmail;