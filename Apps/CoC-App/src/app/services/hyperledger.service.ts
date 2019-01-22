import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class HyperledgerService {

  //THOSE VARIABLES MUST NOT BE INITIALIZED HERE
  private userProfile:Profile = {
    identifier: "12345",
    firstName: "Bob",
    lastName: "Protocolo",
    birthdate: new Date(1990,10,20),
    gender: "Male",
    job: "Detective",
    studies: "Software Engineer",
    office: "Málaga"
  };

  private userCases:Case[] = [
    { identifier:"CASE001",
      description:"Grand Theft Auto",
      openingDate: new Date(2018,11,21),
      /*resolution: "Testing",
      closureDate: new Date(),*/
      status:"OPENED",
      openedBy:this.userProfile,
      participants:[this.userProfile]
    }
  ];

  private owners:Owner[]=[
    { owner: "11111",
      until: new Date(2018,11,4)  
    },
    {
      owner: "22222",
      until: new Date(2018,11,21)
    }
  ]
  
  private userEvidences:Evidence[] = [
    { identifier:"EVD001",
      hash:"A156456156D4351545F6",
      hashType:"SHA-1",
      description:"Video recording",
      additionDate:new Date(2018,10,20),
      owner:this.userProfile,
      olderOwners:this.owners,
      case:this.userCases[0]},
    { identifier:"EVD002",
      hash:"A156456156D4351545F6",
      hashType:"SHA-1",
      description:"Image",
      additionDate:new Date(),
      owner:this.userProfile,
      olderOwners:this.owners,
      case:this.userCases[0]}
  ];

  constructor(private userdata: UserDataService) { }

  //Retrieve any user profile
  getProfile(identifier:string): Profile{
    let profile: Profile = {
      identifier: identifier,
      firstName: "Bob",
      lastName: "Protocolo",
      birthdate: new Date(1990,10,20),
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

  //Get evidences from case X
  getCaseEvidences(case_id:string):Evidence[]{
    return this.userEvidences;
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
  openedBy:Profile,
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
  until:Date
}