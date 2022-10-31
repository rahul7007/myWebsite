import express from 'express';
const bodyParser = require('body-parser')
import cors from 'cors';

const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
  credentials: true,
  origin: ["http://localhost:4200"]
}))

app.use(bodyParser.json())

let otp: any;
app.post('/api/generateAndSendOtp', async (req, res) => {
  // generate OTP
  otp = Math.floor(1000 + Math.random() * 9000);
  console.log('otp', otp);

  const customMessage = `Dear user, OTP to verify your email is: ${otp}. Please use it verify your email id`;

  // create reusable transporter object using the default SMTP transport
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

  const mailOptions = {
    from: 'noreply@portfolio.com',
    to: req.body.email,
    subject: 'OTP-Verification',
    text: customMessage
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (err: any, data: any) {
    if (err) {
      console.log('Something wrong (Send Email)', err);
      res.json({ success: false, statusCode: 500, message: 'Error while sending email' });
    } else {
      console.log('Email sent !!!');
      res.json({ success: true, statusCode: 200, message: 'Email sent !' });
    }
  });
})

app.post('/api/verifyOtp', async (req, res) => {
  if (otp === parseInt(req.body.otp)) {
    res.json({ success: true, statusCode: 200, message: 'OTP Verified !' })
  } else {
    res.json({ success: false, statusCode: 500, message: 'Incorrect OTP' })
  }
});

const port = 5000;

app.listen(port, () => {
  console.log('Server is running on port', port);
});