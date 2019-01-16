import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HyperledgerService {

  //THOSE VARIABLES MUST NOT BE INITIALIZED HERE
  private userProfile:Profile = {
    identifier: "12345",
    firstName: "Joaquín",
    lastName: "Trillo",
    birthdate: new Date(1994,10,23),
    gender: "Male",
    job: "Detective",
    studies: "Software Engineer",
    office: "Málaga"
  };

  private userCases:Case[] = [
    { identifier:"CASE001",
      description:"Grand Theft Auto",
      openingDate: new Date(),
      status:"OPENED",
      openingBy:this.userProfile,
      participants:[this.userProfile]
    }
  ];
  
  private userEvidences:Evidence[] = [
    { identifier:"EVD001",
      hash:"A156456156D4351545F6",
      hashType:"SHA-1",
      description:"Video recording",
      additionDate:new Date(),
      owner:this.userProfile,
      olderOwners:[],
      case:this.userCases[0]
    }
  ];

  constructor() {
    console.log("HyperledgerService loaded");
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

  //When logging, to set user evidences
  setUserEvidences(userEvidences: Evidence[]){
    this.userEvidences = userEvidences;
  }

  //Retrieves the evidences of current user
  getUserEvidences(): Evidence[]{
    return this.userEvidences;
  }


  //Retrieve any user profile
  getProfile(identifier:string): Profile{
    let profile: Profile = {
      identifier: identifier,
      firstName: "Joaquín",
      lastName: "Trillo",
      birthdate: new Date(1994,10,23),
      gender: "Male",
      job: "Detective",
      studies: "Software Engineer",
      office: "Málaga"
    }
    return profile;
  }

  //Get current user cases
  getCases(): Case[]{
    return undefined;
  }

  //Get current user evidences
  getEvidences(): Evidence[]{
    return undefined;
  }
}

export interface Profile {
  identifier:string,
  firstName:string,
  lastName:string,
  birthdate:Date,
  gender:string,
  job:string,
  studies:string,
  office:string
}

export interface Case {
  identifier:string,
  description:string,
  openingDate:Date,
  resolution?:string,
  closureDate?:Date,
  status:string,
  openingBy:Profile,
  participants:Profile[]
}

export interface Evidence {
  identifier:string,
  hash:string,
  hashType:string,
  description:string,
  additionDate:Date,
  owner:Profile,
  olderOwners:Owner[],
  case:Case
}

interface Owner {
  owner:string,
  till:Date
}