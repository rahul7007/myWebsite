import express from 'express';
const bodyParser = require('body-parser')
import cors from 'cors';
const { sendEmail } = require('../helpers/mailer')

const nodemailer = require('nodemailer');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
  credentials: true,
  origin: ["http://localhost:4200"]
}))

app.use(bodyParser.json())

// send OTP
let otp: any;
app.post('/api/generateOtp', async (req, res) => {
  
  // generate OTP
  otp = Math.floor(1000 + Math.random() * 9000);
  console.log('OTP to be send', otp);

  const emailTo = req.body.email;
  const subject = 'OTP-Verification';
  const customMessage = `Dear user, OTP to verify your email is: ${otp}. Please use it verify your email id`;

  // send OTP
  sendEmail(emailTo, customMessage, subject, function (error: any) {
    if (error) {
      console.log('Error while sending OTP', error);
      res.json({ success: false, statusCode: 500, message: "Couldn't sent OTP, Please try again later" });
    } else {
      console.log('OTP has been sent')
      res.json({ success: true, statusCode: 200, message: 'OTP has been sent to your email id' });
    }
  })
})

// validate OTP
app.post('/api/verifyOtp', async (req, res) => {
  if (otp === parseInt(req.body.otp)) {
    console.log('OTP verified');
    res.json({ success: true, statusCode: 200 })
  } else {
    console.log('Wrong OTP');
    res.json({ success: false, statusCode: 500, message: 'Wrong OTP, try again' })
  }
});

// send message
app.post('/api/sendMessage/', async (req, res) => {
  const { name, phone, email, message } = req.body;

  const emailTo = req.body.email;
  const subject = "Message From Rahul's Portfolio";
  const customMessage = `
    Sender: ${name}
    Phone Number: ${phone}
    Email: ${email}
    Message: ${message}
  `;

  sendEmail(emailTo, customMessage, subject, function (error: any) {
    if (error) {
      console.log('Error while sending message', error);
      res.json({ success: false, statusCode: 500, message: "Couldn't sent message, please try again later" });
    } else {
      console.log('Message has been sent')
      res.json({ success: true, statusCode: 200, message: 'Message sent' });
    }
  })
})

const port = 5000;

app.listen(port, () => {
  console.log('Server is running on port', port);
});