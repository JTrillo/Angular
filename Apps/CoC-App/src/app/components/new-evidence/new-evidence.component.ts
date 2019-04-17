import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { HyperledgerService } from 'src/app/services/hyperledger.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-new-evidence',
  templateUrl: './new-evidence.component.html',
  styles: []
})
export class NewEvidenceComponent implements OnInit {

  case_id:string;
  form:FormGroup;

  constructor(private activatedRoute:ActivatedRoute,
              private location:Location,
              private hyperledger:HyperledgerService,
              private userdata:UserDataService,
              private router:Router) {

    //CASE ID
    this.activatedRoute.params.subscribe( params => {
      this.case_id = params['case_id'];
    });

    //FORM
    this.form = new FormGroup({
      'identifier': new FormControl('', Validators.required),
      'hash_type': new FormControl('', Validators.required),
      'hash_value': new FormControl('', Validators.required),
      'description': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
  }

  addEvidence(){
    console.log( this.form.value );
    //TO DO --> Llamar a la transacción del chaicode 'AddEvidence'
    //TO DO --> Si la transacción tiene éxito mostrar mensaje de éxito (en el home?)
    //TO DO --> En caso contrario mostrar mensaje de error (misma ventana)
  }

  goBack(){
    this.location.back();
  }

}
