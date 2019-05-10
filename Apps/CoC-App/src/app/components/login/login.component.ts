import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HyperledgerService, Profile, Case, Evidence, Owner } from '../../services/hyperledger.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  pct:Number;
  msg:string;

  constructor(private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private router:Router) {
    //Get user wallet
    this.pct = 0;
    this.msg = "Loading your profile";
    this.hyperledger.getWallet().subscribe(response=>{
      //Get user profile
      let participantId = response[0]['name'];
      this.hyperledger.getProfile(participantId).subscribe(profile=>{
        this.setProfile(profile);
        this.pct = 33;
        this.msg = "Loading your cases";
        //Get user cases
        this.hyperledger.getUserCases(participantId).subscribe(cases=>{
          if(cases['length'] > 0){
            this.setCases(cases);
          }
          this.pct = 67;
          this.msg = "Loading your evidences";
          //Get user evidences
          this.hyperledger.getUserEvidences(participantId).subscribe(evidences=>{
            if(evidences['length'] > 0){
              this.setEvidences(evidences);
            }
            this.pct = 100;
            //Navigate home page
            this.router.navigate(['/home'])
          })
        })
      });
    });
  }

  ngOnInit() { }

  private setProfile(response){
    let profile:Profile = {
      identifier: response['participantId'],
      firstName: response['firstName'],
      lastName: response['lastName'],
      birthdate: new Date(response['birthdate']),
      gender: response['gender'],
      job: response['job'],
      studies: response['studies'],
      office: response['office']
    };
    this.userdata.setUserProfile(profile);
  }

  private setCases(response){
    let cases:Case[] = [];
    response.forEach(element => {
      let participants = [];
      element['participants'].forEach(element2 => {
          participants.push(element2.split('#')[1]);
      });
      let caso:Case = {
        identifier: element['caseId'],
        description: element['description'],
        openingDate: new Date(element['openingDate']),
        resolution: element['resolution'],
        closureDate: new Date(element['closureDate']),
        status: element['status'],
        openedBy: element['openedBy'].split('#')[1],
        participants: participants
      }
      cases.push(caso);
    });
    this.userdata.setUserCases(cases);
  }

  private setEvidences(response){
    let evidences:Evidence[]= [];
    response.forEach(element =>{
      let olderOwners = [];
      element['olderOwners'].forEach(element2 => {
        let olderOwner:Owner = {
          owner: element2['owner'],
          until: element2['till']
        }
        olderOwners.push(olderOwner);
      });
      let caso = this.userdata.getCase(element['caso'].split('#')[1]);
      let evidence:Evidence = {
        identifier: element['evidenceId'],
        hash_value: element['hash'],
        hash_type: element['hash_type'],
        description: element['description'],
        extension: element['extension'],
        additionDate: new Date(element['additionDate']),
        owner: element['owner'].split('#')[1],
        olderOwners: olderOwners,
        case: caso
      }
      evidences.push(evidence);
    });
    this.userdata.setUserEvidences(evidences);
  }
}
