import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  participant_id:string; //Id of participant who is going to receive the evidence
  noSelected:boolean;

  constructor(private activatedroute:ActivatedRoute,
              private userdata:UserDataService,
              private location:Location,
              private router:Router) {
    this.activatedroute.params.subscribe(params => {
      let evidence_id = params['evi_id'];
      this.evidence = this.userdata.getEvidence(evidence_id);
      this.additionDate = this.dateToInputDate(this.evidence.additionDate);
      this.participants = this.removeCurrentUser(this.evidence.case.participants);
    });
    this.participant_id = undefined;
    this.noSelected = false;
  }

  ngOnInit() {
  }

  participantSelected(participant_id:string){
    this.participant_id = participant_id;
  }

  cleanSelected(){
    this.participant_id = undefined;
    this.noSelected = false;
  }

  transferEvidence(){
    if(this.participant_id!=undefined){
      console.log(`Transfer evidence to: ${this.participant_id}`);
      //TO DO --> Llamar a la transacción del chaincode 'TransferEvidence'
      //TO DO --> Recuperar los nuevos casos y pruebas del usuario
      jQuery('#transferModal').modal('hide');
      this.router.navigate(['/home']);
    }else{
      this.noSelected = true;
    }
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
