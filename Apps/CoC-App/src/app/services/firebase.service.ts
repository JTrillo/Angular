import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private db:AngularFirestore,
              private storage:AngularFireStorage) { }
  
  addRequest(email:string, github:string, firstname:string, lastname:string, birthdate:string, gender:string, job:string, studies:string, office:string){
    return this.db.collection("requests").doc(email).set({
      email: email,
      github: github,
      firstname: firstname,
      lastname: lastname,
      birthdate: birthdate,
      gender: gender,
      job: job,
      studies: studies,
      office: office
    });
  }

  checkRequest(email:string){
    return this.db.collection("requests").doc(email).valueChanges();
  }
  
  getCases(){
    return this.db.collection('cases').valueChanges();
  }

  getEvidences(){
    return this.db.collection('evidences').valueChanges();
  }

  getEvidenceCopy(path:string){
    return this.storage.ref(path).getDownloadURL();
  }
}
