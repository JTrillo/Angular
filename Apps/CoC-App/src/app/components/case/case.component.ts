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
  form:FormGroup;
  openingDate:string;
  closureDate:string;
  evidences:Evidence[] = [];
  participants:Profile[] = [];

  constructor(private location:Location,
              private hyperledger:HyperledgerService,
              private userdata:UserDataService) {
    //FORM
    this.form = new FormGroup({
      'resolution': new FormControl('', Validators.required)
    })
    //CASE - CHANGE IT
    this.hyperledger.getCases();
    this.case = this.userdata.getUserCases()[0];
    
    this.openingDate = this.dateToInputDate(this.case.openingDate);
    if(this.case.closureDate!=undefined){
      this.closureDate = this.dateToInputDate(this.case.closureDate);
    }
    this.participants = this.case.participants;

    //EVIDENCES - CHANGE IT
    this.evidences = this.hyperledger.getCaseEvidences(this.case.identifier);
   }

  ngOnInit() {
  }

  addEvidence(){
    console.log("add evidence click");
  }

  closeCase(){
    console.log(this.form.value);
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
