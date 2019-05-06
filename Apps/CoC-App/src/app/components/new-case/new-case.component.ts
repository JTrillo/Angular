import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import { HyperledgerService } from '../../services/hyperledger.service';
@Component({
  selector: 'app-new-case',
  templateUrl: './new-case.component.html',
  styles: []
})
export class NewCaseComponent implements OnInit {

  form:FormGroup;

  constructor(private hyperledger:HyperledgerService) {
    this.form = new FormGroup({
      'identifier': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
  }
  
  addCase(){
    console.log( this.form.value );
    //Llamar a la transacción del chaincode 'OpenCase'
    this.hyperledger.postNewCase(this.form.value.identifier, this.form.value.description).subscribe(response =>{
      console.log(response);
    });
    //TO DO --> Recuperar los nuevos casos y pruebas del usuario
  }
}