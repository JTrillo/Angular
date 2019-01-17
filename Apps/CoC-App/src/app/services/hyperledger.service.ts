import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';

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

  constructor(private userdata: UserDataService) {
    console.log("HyperledgerService loaded");
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

  //Get current user cases from blockchain and stores them in UserDataService
  getCases(){
    this.userdata.setUserCases(this.userCases);
  }

  //Get current user evidences from blockchain and stores them in UserDataService
  getEvidences(){
    this.userdata.setUserEvidences(this.userEvidences);
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