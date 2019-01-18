import { Injectable } from '@angular/core';
import { Profile, Case, Evidence } from '../services/hyperledger.service';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userProfile:Profile;
  private userCases:Case[];
  private userEvidences:Evidence[];

  constructor() { }

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

  //When logging, to set user evidences
  setUserEvidences(userEvidences: Evidence[]){
    this.userEvidences = userEvidences;
  }

  //Retrieves the evidences of current user
  getUserEvidences(): Evidence[]{
    return this.userEvidences;
  }
}
