import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  user: Observable<Admin | null>;
  
  constructor(private db:AngularFirestore, private auth:AngularFireAuth) {
    this.user = this.auth.authState.pipe(
      switchMap(user => {
        if(user){
          return this.db.doc<Admin>(`admins/${user.email}`).valueChanges();
        }else{
          return of(null);
        }
      })
    )
  }

  getAdmin(email:string){
    return this.db.collection('admins').doc(email).valueChanges();
  }

  getRequests(){
    return this.db.collection('requests').valueChanges();
  }

  deleteRequest(email:string){
    return this.db.collection('requests').doc(email).delete();
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

interface Admin {
  email: string,
  firstname: string,
  lastname:string
}