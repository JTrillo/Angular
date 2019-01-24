import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { HyperledgerService, Case, Evidence, Profile } from 'src/app/services/hyperledger.service';
import { UserDataService } from 'src/app/services/user-data.service';

declare var jQuery:any; //To import jQuery

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styles: []
})
export class CaseComponent implements OnInit {

  case:Case;
  openingDate:string;
  closureDate:string;
  today:string
  participants:Profile[] = [];
  evidences:Evidence[] = [];
  currentUser:Profile;
  form:FormGroup;

  disabledUser:boolean;
  disabledClosed:boolean;

  displayError:boolean=false;

  //MODAL VARIABLES
  newParticipantId:string=undefined;
  newParticipantDisplay:string=undefined;
  switchControl:number=0;

  constructor(private location:Location,
              private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private router:Router) {
    
    this.today = this.dateToInputDate(new Date());

    //CASE
    this.case = this.userdata.getUserCases()[0];
    
    this.openingDate = this.dateToInputDate(this.case.openingDate);
    if(this.case.closureDate!=undefined){
      this.closureDate = this.dateToInputDate(this.case.closureDate);
    }else{
      //this.closureDate = this.today;
    }
    this.participants = this.case.participants;

    //EVIDENCES - CHANGE IT
    this.evidences = this.hyperledger.getCaseEvidences(this.case.identifier);

    //CURRENT USER
    this.currentUser = this.userdata.getUserProfile();

    //FORM
    this.form = new FormGroup({
      'closureDate': new FormControl({value:'', disabled: this.case.status == 'CLOSED'}, Validators.required),
      'resolution': new FormControl({value:this.case.resolution, disabled: this.case.status == 'CLOSED'}, Validators.required),
      'newParticipantId': new FormControl('')
    });

    //Disabling buttons
    this.disabledUser = this.case.openedBy.identifier != this.currentUser.identifier;
    this.disabledClosed = this.case.status == 'CLOSED';

   }

  ngOnInit() {
  }

  addEvidence(){
    console.log("add evidence click");
    //TO DO --> Ir a la vista de creación de nueva evidencia
  }

  closeCase(){
    if(this.form.valid){
      this.displayError=false;
      console.log(this.form.value);
      let check = confirm(`¿Está seguro de que desea cerrar el caso ${this.case.identifier}?`);
      if(check){
        console.log("Closing case...");
        //TO DO --> Llamar a la transacción del chaincode 'CloseCase'
        //TO DO --> Recuperar los nuevos casos y pruebas del usuario
        this.router.navigate(['/home']);
      }
    }else{
      this.displayError=true;
      console.error('Form not valid!!');
    }
  }

  searchParticipant(){
    //Switch control flag to initial state
    this.switchControl = 0;

    //Get id entered
    this.newParticipantId = this.form.value['newParticipantId'];
    //Search participant in the blockchain
    let profile:Profile = this.hyperledger.getProfile(this.newParticipantId);

    if(profile==undefined){ //Show an error
      this.switchControl = 1;
    }else{
      if(this.isAlreadyInvolved(this.newParticipantId)){ //Show a warning
        this.switchControl = 2;
      }else{ //Show info
        this.switchControl = 3;
        this.newParticipantDisplay = `${profile.lastName}, ${profile.firstName} (${profile.identifier})`;
      }
    }
  }

  cleanSelected(){
    this.newParticipantId = undefined;
    this.switchControl = 0;
  }

  addParticipant(){
    console.log(`Adding participant ${this.newParticipantId} to case ${this.case.identifier}`);
    this.newParticipantId = undefined;
    this.switchControl = 0;
    //TO DO --> Llamar a la transacción del chaincode 'AddParticipant'
    //TO DO --> Recuperar los nuevos casos y pruebas del usuario
    jQuery('#addParticipantModal').modal('hide');
    this.router.navigate(['/case',this.case.identifier]);
  }

  goBack(){
    this.location.back();
  }

  private dateToInputDate(date:Date): string{
    let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    let aux = `${date.getFullYear()}-${month}-${date.getDate()}`;
    return aux;
  }

  private isAlreadyInvolved(participant_id:string): boolean{
    for(let aux of this.case.participants){
      if(aux.identifier == participant_id){
        return true;
      }
    }
    return false;
  }

}
