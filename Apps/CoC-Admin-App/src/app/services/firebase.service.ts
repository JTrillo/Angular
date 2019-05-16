import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db:AngularFirestore, private auth:AngularFireAuth) {}

  getAdmin(email:string){
    return this.db.collection('admins').doc(email).valueChanges();
  }

  getRequests(){
    return this.db.collection('requests').valueChanges();
  }

  sendEmailLink(email:string){
    //Prepare things to send email
    let actionCodeSettings = {
      url: 'http://localhost:4200/login',
      handleCodeInApp: true
    };

    //Send mail
    return this.auth.auth.sendSignInLinkToEmail(email, actionCodeSettings);
  }

  confirmSignIn(url:string){
    if(this.auth.auth.isSignInWithEmailLink(url)){
      let email = window.localStorage.getItem('emailCoCAdmin');

      //If missing email, prompt user for it
      if (!email){
        email = window.prompt('Please provide your email for confirmation');
      }

      //Signin user and remove the email from local storage
      return this.auth.auth.signInWithEmailLink(email, url);
    }
  }

  logout(){
    return this.auth.auth.signOut();
  }

  userAuthenticated(){
    return this.auth.authState;
  }
}

export interface Request{
  email:string,
  github:string,
  firstname:string,
  lastname:string,
  birthdate:string,
  gender:string,
  job:string,
  studies:string,
  office:string
}