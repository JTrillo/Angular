import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { HyperledgerService, Case, Evidence, Profile } from 'src/app/services/hyperledger.service';
import { UserDataService } from 'src/app/services/user-data.service';

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

  constructor(private location:Location,
              private hyperledger:HyperledgerService,
              private userdata:UserDataService) {
    
    this.today = this.dateToInputDate(new Date());

    //CASE - CHANGE IT
    this.hyperledger.getCases();
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
      'resolution': new FormControl({value:this.case.resolution, disabled: this.case.status == 'CLOSED'}, Validators.required)
    });

    //Disabling buttons
    /*this.disabledUser = this.case.openedBy.identifier != this.currentUser.identifier;
    this.disabledClosed = this.case.status == 'CLOSED';*/
    this.disabledClosed = this.disabledUser = false;
   }

  ngOnInit() {
  }

  addEvidence(){
    console.log("add evidence click");
  }

  closeCase(){
    if(this.form.valid){
      this.displayError=false;
      console.log(this.form.value);
      let check = confirm(`¿Está seguro de que desea cerrar el caso ${this.case.identifier}?`);
      if(check){
        //LLAMADA A LA API REST PARA C
      }
    }else{
      this.displayError=true;
      console.error('Form not valid!!')
    }
  }

  addParticipant(){
    console.log("add participant click");
  }

  goBack(){
    this.location.back();
  }

  private dateToInputDate(date:Date): string{
    let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    let aux = `${date.getFullYear()}-${month}-${date.getDate()}`;
    return aux;
  }

}
