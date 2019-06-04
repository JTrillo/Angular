import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { UserDataService } from 'src/app/services/user-data.service';
import { HyperledgerService, Evidence } from 'src/app/services/hyperledger.service';
import { FirebaseService } from '../../services/firebase.service';

declare var jQuery:any; //To import jQuery

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styles: []
})
export class EvidenceComponent implements OnInit {

  evidence:Evidence;

  participants:string[] = []; //Participants in case that no are the current user
  participant_id:string; //Id of participant who is going to receive the evidence
  noSelected:boolean;

  transferring:boolean;

  constructor(private activatedroute:ActivatedRoute,
              private userdata:UserDataService,
              private location:Location,
              private router:Router,
              private firebase:FirebaseService,
              private hyperledger:HyperledgerService) {
    this.activatedroute.params.subscribe(params => {
      let evidence_id = params['evi_id'];
      this.evidence = this.userdata.getEvidence(evidence_id);
      this.participants = this.removeCurrentUser(this.evidence.case.participants);
    });
    this.participant_id = undefined;
    this.noSelected = false;

    this.transferring = false;
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

  copyHash(){
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (this.evidence.hash_value));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    alert('Hash copied to clipboard');
  }

  transferEvidence(){
    if(this.participant_id!=undefined){
      this.noSelected = false;
      console.log(`Transfer evidence to: ${this.participant_id}`);
      let participant_type = this.hyperledger.isDeposit(this.participant_id) ? 'DEPOSIT' : 'AGENT';
      //Llamar a la transacción del chaincode 'TransferEvidence'
      this.transferring = true;
      this.hyperledger.postTransferEvidence(this.evidence.identifier, participant_type, this.participant_id).subscribe(response =>{
        this.transferring = false;
        //Eliminar la prueba del servicio user data
        this.userdata.transferEvidence(this.evidence.identifier);
        //Cerrar el modal y navegar al home
        jQuery('#transferModal').modal('hide');
        this.router.navigate(['/home']);
      });
    }else{
      this.noSelected = true;
    }
  }

  downloadCopy(){
    const path = `${this.evidence.case.identifier}/${this.evidence.identifier}.${this.evidence.extension}`;
    this.firebase.getEvidenceCopy(path).subscribe(response =>{
      let a = document.createElement("a");
      a.href = response;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  goBack(){
    this.location.back();
  }

  private removeCurrentUser(participants:string[]): string[]{
    let withoutCurrentUser:string[] = [];
    let user_id = this.userdata.getUserProfile().identifier;
    for(let aux = 0; aux<participants.length; aux++){
      if(user_id != participants[aux]){
        withoutCurrentUser.push(participants[aux]);
      }
    }
    return withoutCurrentUser;
  }

}
