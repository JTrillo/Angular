import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

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
  cardImport=0; //0 --> initial value, 1 --> No cards in user's wallet, 2 --> At least one card in user's wallet

  card:FormControl;
  file:File;
  filename:string = "Choose a card";
  uploading:boolean;
  uploaded:boolean;
  invalid_filename:boolean;

  constructor(private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private router:Router) {
    //Get user wallet
    this.pct = 0;
    this.msg = "Loading your profile";
    this.hyperledger.getWallet().subscribe(response=>{
      if(response['length'] > 0){ //EXISTS AT LEAST ONE CARD IN USER'S WALLET
        this.cardImport = 2;
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
      }else{ //THERE ARE NO CARD IN USER'S WALLET
        this.cardImport = 1;
        this.card = new FormControl('', Validators.required);
        this.uploading = false;
        this.uploaded = false;
        this.invalid_filename = false;
      }
    });
  }

  ngOnInit() { }

  uploadCard(){
    //We have to store one card in user's wallet
    let tokens = this.filename.split('@');
    if(tokens[tokens.length-1] !== "cocv2.card"){ //Invalid file
      this.invalid_filename = true;
    }else{
      this.invalid_filename = false;
      this.uploading = true;
      this.hyperledger.postImportCard(this.file, this.filename).subscribe(response=>{
        console.log(response);
        this.uploading = false;
        this.uploaded = true;
      });
    }
  }

  getFile(event: FileList){
    this.invalid_filename = false;

    this.file = event.item(0);
    this.filename = this.file.name;
  }

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
      let closureDate = undefined;
      if(element['closureDate'] !== undefined){
        closureDate = new Date(element['closureDate']);
      }
      let caso:Case = {
        identifier: element['caseId'],
        description: element['description'],
        openingDate: new Date(element['openingDate']),
        resolution: element['resolution'],
        closureDate: closureDate,
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
