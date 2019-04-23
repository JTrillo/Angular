import { Injectable } from '@angular/core';

import { HyperledgerService, Profile} from './hyperledger.service';
import { UserDataService } from './user-data.service';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private profile:Profile;
  private expirationTime:number;

  constructor(private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private firestore:AngularFirestore) {
    this.profile = undefined;
    this.expirationTime = 0;
  }

  public login(id:string, pass:string): boolean{
    //SEGUIR AQUI. METER LA VERIFICACION DE FIREBASE.
    //Looking for the user
    this.profile = this.hyperledger.getProfile(id);
    if(this.profile!=undefined){ //If the user exists
      this.expirationTime = Date.now() + 1800000; //30 min token
      this.userdata.setUserProfile(this.profile); //Set user profile
      this.hyperledger.getCases();
      this.hyperledger.getEvidences();
      return true;
    }else{
      return false;
    }
  }

  public login2(id:string, pass:string){
    this.firestore.collection('users').doc(id).get().subscribe(user=>{
      console.log(user.data()['pass']);
    });

  }

  public logout(): void{
    this.expirationTime = 0;
  }

  public isAuthenticated(): boolean{
    return Date.now() < this.expirationTime;
  }

  //Returns true if current user participates in case with id 'case_id'
  public participatesInCase(case_id:string): boolean{
    for(let caso of this.userdata.getUserCases()){
      if(caso.identifier==case_id){
        return true;
      }
    }
    return false;
  }

  //Returns true if current user is the owner of the evidence
  public ownerOfEvidence(evidence_id:string): boolean{
    for(let evidence of this.userdata.getUserEvidences()){
      if(evidence.identifier==evidence_id){
        return true;
      }
    }
    return false;
  }
}
