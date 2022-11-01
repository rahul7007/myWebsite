import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { NotificationService } from 'shared/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private notifyService : NotificationService) { }
  
  title = 'myWebsite';
  // email : any = '';
  popup = false;
  isVaildOtp = false;
  isLoading = false;

  OtpVerifyForm = new FormGroup({
    otp: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4)
    ])
  })

  contactForm = new FormGroup({
    name: new FormControl(''),
    phone: new FormControl(''),
    email: new FormControl(''),
    message: new FormControl('')
  })

  api = axios.create({
    baseURL: 'http://localhost:5000/api',
  });

  verifyEmailAndSendMessage() {
    this.isLoading = true;
    const { email } = this.contactForm.value;
    const payload = { email };
    this.api.post(`/generateAndSendOtp`, payload)
      .then((response) => {
        console.log('Response from 1st API', response);
        this.isLoading = false
        if (response.data.statusCode === 200) {
          this.notifyService.showInfo("OTP has been sent to your email id !!")
          this.popup = true
          // this.email = email;
        } else {
          this.notifyService.showError("Couldn't sent OTP, Please try again later")
        }
      })
  }

  sendMessage() {
    this.isLoading = true;

    const { name, phone, email, message } = this.contactForm.value;

    const payload = { name, phone, email, message };
    this.api.post(`/sendMessage`, payload)
    .then((response) => {
      console.log('Response from 3rd API', response);
      this.isLoading = false
      if (response.data.statusCode === 200) {
        this.popup = false
        this.notifyService.showSuccess("Message Sent!")
      } else {
        this.notifyService.showError("Couldn't sent message, please try again later")
      }
    })
  }

  onSubmitOtp() {
    this.isLoading = true;
    const payload = this.OtpVerifyForm.value;

    this.api.post(`/verifyOtp`, payload)
      .then((response) => {
        console.log('Response from 2nd API', response);
        this.isLoading = false
        if (response.data.statusCode === 200) {
          console.log("OTP verification successful, Implement Message Content API")
          this.isVaildOtp = true;
          // send the message
          this.sendMessage();
        } else {
          this.isVaildOtp = false;
          this.notifyService.showError("Wrong OTP, try again!")
          console.log("OTP verification failed");
        }
      })
  }
}
