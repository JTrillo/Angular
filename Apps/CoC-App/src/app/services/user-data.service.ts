import { Injectable } from '@angular/core';
import { Profile, Case, Evidence } from '../services/hyperledger.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userProfile:Profile;
  private userCases:Case[];
  private userEvidences:Evidence[];

  constructor() {
    this.reset();
  }

  //When logging, to set user profile
  setUserProfile(profile:Profile){
    this.userProfile = profile;
  }

  //Retrieve current user profile
  getUserProfile(): Profile{
    return this.userProfile;
  }

  //When logging, to set user cases
  setUserCases(userCases: Case[]){
    this.userCases = userCases;
  }

  //Retrieves cases in which current user is involved
  getUserCases(): Case[]{
    return this.userCases;
  }

  //Retrieves one case
  getCase(id:string): Case{
    for(let aux of this.userCases){
      if(aux.identifier == id){
        return aux;
      }
    }
    return undefined;
  }

  //When logging, to set user evidences
  setUserEvidences(userEvidences: Evidence[]){
    this.userEvidences = userEvidences;
  }

  //Retrieves the evidences of current user
  getUserEvidences(): Evidence[]{
    return this.userEvidences;
  }

  //Retrieves one evidence
  getEvidence(id:string): Evidence{
    for(let aux of this.userEvidences){
      if(aux.identifier == id){
        return aux;
      }
    }
    return undefined;
  }

  //Add participant to case
  addParticipantToCase(participant_id:string, case_id:string){
    for(let aux of this.userCases){
      if(aux.identifier === case_id){
        aux.participants.push(participant_id);
        return;
      }
    }
  }

  //Reset service
  reset(){
    this.userProfile = undefined;
    this.userCases = [];
    this.userEvidences = [];
  }
}
