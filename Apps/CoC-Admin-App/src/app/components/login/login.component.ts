import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit{
  email:FormControl;
  emailSent:boolean;
  emailError:boolean;

  constructor(private fireAuth:AngularFireAuth, private router:Router) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.emailSent = false;
    this.emailError = false;
  }

  ngOnInit() {
    const url = this.router.url;
    if(url.includes('signIn')){
      this.confirmSignIn(url);
    }
  }

  sendEmailLink(){
    if(this.email.valid){
      this.emailError = false;

      //Prepare things to send email
      let actionCodeSettings = {
        url: 'http://localhost:4200/login',
        handleCodeInApp: true
      };
      //Send mail
      this.fireAuth.auth.sendSignInLinkToEmail(this.email.value, actionCodeSettings).then(response=>{
        console.log(response);
        //Store email in local storage
        window.localStorage.setItem('emailCoCAdmin', this.email.value);
        this.emailSent = true;
      }).catch(err=>{
        console.log(err);
      });
      
    }else{
      this.emailError = true;
    }
    
  }

  confirmSignIn(url:string){
    if(this.fireAuth.auth.isSignInWithEmailLink(url)){
      let email = window.localStorage.getItem('emailCoCAdmin');

      //If missing email, prompt user for it
      if (!email){
        email = window.prompt('Please provide your email for confirmation');
      }

      //Signin user and remove the email from local storage
      this.fireAuth.auth.signInWithEmailLink(email, url).then(response=>{
        console.log(response);
        window.localStorage.removeItem('emailCoCAdmin');
      }).catch(err=>{
        console.log(err);
      });
    }
  }

  logout(){
    return this.fireAuth.auth.signOut();
  }

}
