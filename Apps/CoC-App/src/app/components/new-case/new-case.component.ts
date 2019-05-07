import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import { HyperledgerService, Case } from '../../services/hyperledger.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-new-case',
  templateUrl: './new-case.component.html',
  styles: []
})
export class NewCaseComponent implements OnInit {

  form:FormGroup;
  loading:boolean;
  tx_id:string;

  constructor(private hyperledger:HyperledgerService,
              private userdata:UserDataService) {
    this.form = new FormGroup({
      'identifier': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required)
    });
    this.tx_id = undefined;
    this.loading = false;
  }

  ngOnInit() {
  }
  
  addCase(){
    console.log( this.form.value );
    this.loading = true;
    //Llamar a la transacción del chaincode 'OpenCase'
    this.hyperledger.postNewCase(this.form.value.identifier, this.form.value.description).subscribe(response =>{
      console.log(response);
      //Add new case to user data service
      let curr_user_id = this.userdata.getUserProfile().identifier;
      let caso:Case = {
        identifier: this.form.value.identifier,
        description: this.form.value.description,
        openingDate: new Date(response['timestamp']),
        status: 'OPENED',
        openedBy: curr_user_id,
        participants: [curr_user_id, "0001"] //0001 is Málaga's deposit ID
      }
      let cases = this.userdata.getUserCases();
      cases.push(caso);
      this.userdata.setUserCases(cases);
      //Stop loading spinner and show tx id message
      this.loading = false;
      this.tx_id = response['transactionId'];
    });
  }
}