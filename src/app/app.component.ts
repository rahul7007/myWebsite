import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myWebsite';
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
    const email = this.contactForm.value.email;
    const payload = { email };
    this.api.post(`/generateAndSendOtp`, payload)
      .then((response) => {
        console.log('Response from 1st API', response);
        this.isLoading = false
        if (response.data.statusCode === 200) {
          this.popup = true
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
        } else {
          this.isVaildOtp = false;
          console.log("OTP verification failed");
        }
      })
  }
}
