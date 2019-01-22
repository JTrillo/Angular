import { Injectable } from '@angular/core';

import { HyperledgerService, Profile, Case, Evidence } from './hyperledger.service';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private expirationTime:number;

  constructor(private hyperledger:HyperledgerService,
              private userdata:UserDataService) {
    this.expirationTime = 0;
  }

  public login(id:string): boolean{
    //Looking for the user
    let profile:Profile = this.hyperledger.getProfile(id);
    if(profile!=undefined){ //If the user exists
      this.expirationTime = Date.now() + 1800000; //30 min token
      this.userdata.setUserProfile(profile); //Set user profile
      this.hyperledger.getCases();
      this.hyperledger.getEvidences();
      return true;
    }else{
      return false;
    }
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
