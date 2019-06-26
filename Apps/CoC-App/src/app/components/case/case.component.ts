import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

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
  participants:string[] = [];
  evidences:Evidence[] = [];
  currentUser:Profile;
  form:FormGroup;

  disabledUser:boolean;
  closed:boolean;

  displayError:boolean=false;

  //MODAL VARIABLES
  newParticipantId:string=undefined;
  newParticipantDisplay:string=undefined;
  switchControl:number=0;

  closing:boolean;

  constructor(private activatedRoute:ActivatedRoute,
              private location:Location,
              private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private router:Router) {
    
    this.today = this.dateToInputDate(new Date());

    //CASE
    this.activatedRoute.params.subscribe( params => {
      let case_id = params['case_id'];
      this.case = this.userdata.getCase(case_id);
    });
    
    this.openingDate = this.dateToInputDate(this.case.openingDate);
    if(this.closureDate !== null && this.closureDate !== undefined && !isNaN(this.case.closureDate.getTime())){
      this.closureDate = this.dateToInputDate(this.case.closureDate);
    }else{
      this.closureDate = this.today;
    }
    this.participants = this.case.participants;

    //EVIDENCES
    this.hyperledger.getCaseEvidences(this.case.identifier).subscribe(response =>{
      //console.log(response);
      this.setEvidences(response);
    });

    //CURRENT USER
    this.currentUser = this.userdata.getUserProfile();

    //FORM
    this.form = new FormGroup({
      'closureDate': new FormControl('', Validators.required),
      'resolution': new FormControl('', Validators.required),
      'newParticipantId': new FormControl('')
    });

    //Disabling buttons
    this.disabledUser = this.case.openedBy != this.currentUser.identifier;
    this.closed = this.case.status === 'CLOSED';

    this.closing = false;
   }

  ngOnInit() {
  }

  closeCase(){
    if(this.form.valid){
      this.displayError=false;
      //console.log(this.form.value);
      let check = confirm(`¿Está seguro de que desea cerrar el caso ${this.case.identifier}?`);
      if(check){
        console.log("Closing case...");
        this.closing = true;
        //Llamar a la transacción del chaincode 'CloseCase'
        this.hyperledger.postCloseCase(this.case.identifier, this.form.value.resolution).subscribe(response => {
          console.log(response);
          this.closing = false;
          //Eliminar las evidencias del caso del servicio userdata y poner el caso a closed
          this.userdata.closeCase(this.case.identifier, this.form.value.resolution);
          this.router.navigate(['/home']);
        })
        
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
    this.newParticipantId = this.newParticipantId.replace(/\s/g, '');

    if(this.newParticipantId !== undefined && this.newParticipantId !== '' && this.newParticipantId !== null){
      //If user already participates in case, it is not needed to include him/her
      if(this.isAlreadyInvolved(this.newParticipantId)){ //Show a warning
        this.switchControl = 2;
      }else{ //Search participant in the blockchain
        this.switchControl = 5;
        this.hyperledger.getProfile(this.newParticipantId).subscribe(response =>{
          //User exists in system
          this.switchControl = 3;
          this.newParticipantDisplay = `${response['lastName']}, ${response['firstName']} (${response['participantId']})`;
        }, error => {
          //User does not exist in system
          this.switchControl = 1; //Show an error
        });
      }
    }else{
      this.switchControl = 4;
    }
    
  }

  cleanSelected(){
    this.newParticipantId = undefined;
    this.switchControl = 0;
    this.form.value['newParticipantId'] = '';
  }

  addParticipant(){
    console.log(`Adding participant ${this.newParticipantId} to case ${this.case.identifier}`);
    this.switchControl = 6;
    //Llamar a la transacción del chaincode 'AddParticipant'
    this.hyperledger.postAddParticipant(this.case.identifier, 'AGENT', this.newParticipantId).subscribe(response => {
      console.log(response);
      //Añadir el nuevo participante al caso del servicio user data
      this.userdata.addParticipantToCase(this.newParticipantId, this.case.identifier);
      jQuery('#addParticipantModal').modal('hide');
      //this.cleanSelected();
      this.router.navigate(['/case',this.case.identifier]);
    });
  }

  isDeposit(participant_id:string):boolean{
    return this.hyperledger.isDeposit(participant_id);
  }

  goBack(){
    this.location.back();
  }

  private dateToInputDate(date:Date): string{
    let day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate();
    let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    let aux = `${date.getFullYear()}-${month}-${day}`;
    return aux;
  }

  private isAlreadyInvolved(participant_id:string): boolean{
    for(let aux of this.case.participants){
      if(aux == participant_id){
        return true;
      }
    }
    return false;
  }

  private setEvidences(response){
    let evidences:Evidence[]= [];
    response.forEach(element =>{
      let caso = this.userdata.getCase(element['caso'].split('#')[1]);
      let evidence:Evidence = {
        identifier: element['evidenceId'],
        hash_value: element['hash'],
        hash_type: element['hash_type'],
        description: element['description'],
        extension: element['extension'],
        additionDate: new Date(element['additionDate']),
        owner: element['owner'].split('#')[1],
        olderOwners: [],
        case: caso
      }
      evidences.push(evidence);
    });
    this.evidences = evidences;
  }

}
