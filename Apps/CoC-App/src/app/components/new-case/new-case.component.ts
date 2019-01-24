import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-case',
  templateUrl: './new-case.component.html',
  styles: []
})
export class NewCaseComponent implements OnInit {

  form:FormGroup;

  constructor() {
    this.form = new FormGroup({
      'identifier': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required)
    })
  }

  ngOnInit() {
  }
  
  addCase(){
    console.log( this.form.value );
    //TO DO --> Llamar a la transacción del chaincode 'OpenCase'
    //TO DO --> Recuperar los nuevos casos y pruebas del usuario
  }
}