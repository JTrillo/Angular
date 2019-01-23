import { Injectable } from '@angular/core';
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class HyperledgerService {

  //THOSE VARIABLES MUST NOT BE INITIALIZED HERE
  private userProfiles:Profile[] = [
    { identifier: "12345",
      firstName: "Bob",
      lastName: "Protocolo",
      birthdate: new Date(1990,10,20),
      gender: "Male",
      job: "Detective",
      studies: "Software Engineer",
      office: "Málaga"
    },
    { identifier: "12344",
      firstName: "Alice",
      lastName: "Protocolo",
      birthdate: new Date(1990,10,20),
      gender: "Female",
      job: "Detective",
      studies: "Software Engineer",
      office: "Málaga"
    },
    { identifier: "12346",
      firstName: "Clark",
      lastName: "Firewall",
      birthdate: new Date(1994,4,25),
      gender: "Male",
      job: "Officer",
      studies: "Software Engineer",
      office: "Málaga"
    }
  ];

  private userCases:Case[] = [
    { identifier:"CASE001",
      description:"Grand Theft Auto",
      openingDate: new Date(2018,11,21),
      /*resolution: "Testing",
      closureDate: new Date(),*/
      status:"OPENED",
      openedBy:this.userProfiles[0],
      participants:[this.userProfiles[0], this.userProfiles[1], this.userProfiles[2]]
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
      hash:"cf23df2207d99a74fbe169e3eba035e633b65d94",
      hashType:"SHA-1",
      description:"Video recording",
      additionDate:new Date(2018,10,20),
      owner:this.userProfiles[0],
      olderOwners:this.owners,
      case:this.userCases[0]},
    { identifier:"EVD002",
      hash:"cf23df2207d99a74fbe169e3eba035e633b65d94",
      hashType:"SHA-1",
      description:"Image",
      additionDate:new Date(2018,10,21),
      owner:this.userProfiles[0],
      olderOwners:this.owners,
      case:this.userCases[0]}
  ];

  constructor(private userdata: UserDataService) { }

  //Get any user profie from blockchain
  getProfile(identifier:string): Profile{
    for(let aux of this.userProfiles){
      if(aux.identifier == identifier){
        return aux;
      }
    }
    return undefined;
  }

  //Get current user cases from blockchain and stores them in UserDataService
  getCases(){
    let cases:Case[] = [];
    for(let caso of this.userCases){
      if(caso.participants.includes(this.userdata.getUserProfile())){
        cases.push(caso);
      }
    }
    this.userdata.setUserCases(cases);
  }

  //Get current user evidences from blockchain and stores them in UserDataService
  getEvidences(){
    let evidences:Evidence[] = [];
    for(let evidence of this.userEvidences){
      if(evidence.owner.identifier == this.userdata.getUserProfile().identifier){
        evidences.push(evidence);
      }
    }
    this.userdata.setUserEvidences(evidences);
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