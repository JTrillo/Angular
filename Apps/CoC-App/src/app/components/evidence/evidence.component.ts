import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserDataService } from 'src/app/services/user-data.service';
import { Evidence, Profile } from 'src/app/services/hyperledger.service';

declare var jQuery:any; //To import jQuery

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styles: []
})
export class EvidenceComponent implements OnInit {

  evidence:Evidence;
  additionDate:string;

  participants:Profile[] = []; //Participants in case that no are the current user

  @ViewChild('closeModal') private closeModal: ElementRef;

  constructor(private activatedroute:ActivatedRoute,
              private userdata:UserDataService,
              private location:Location) {
    this.activatedroute.params.subscribe(params => {
      let evidence_id = params['evi_id'];
      this.evidence = this.userdata.getEvidence(evidence_id);
      this.additionDate = this.dateToInputDate(this.evidence.additionDate);
      this.participants = this.removeCurrentUser(this.evidence.case.participants);
    });
  }

  ngOnInit() {
  }

  transferEvidence(){
    console.log("transferEvidence pressed");
    jQuery('#transferModal').modal('hide');
  }

  downloadCopy(){
    console.log("downloadCopy pressed");
  }

  goBack(){
    this.location.back();
  }

  private dateToInputDate(date:Date): string{
    let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    let aux = `${date.getFullYear()}-${month}-${date.getDate()}`;
    return aux;
  }

  private removeCurrentUser(participants:Profile[]): Profile[]{
    let user_id = this.userdata.getUserProfile().identifier;
    for(let aux = 0; aux<participants.length; aux++){
      if(user_id == participants[aux].identifier){
        participants.splice(aux, 1);
        return participants;
      }
    }
    return participants;
  }

}
