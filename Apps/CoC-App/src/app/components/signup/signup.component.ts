import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: []
})
export class SignupComponent implements OnInit {

  form:FormGroup;
  added:boolean;

  constructor(private firebase:FirebaseService) {
    this.form = new FormGroup({
      'email': new FormControl('', [Validators.required, Validators.email]),
      'github': new FormControl('', Validators.required),
      'firstname': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'birthdate': new FormControl('', Validators.required),
      'gender': new FormControl('', Validators.required),
      'job': new FormControl('', Validators.required),
      'studies': new FormControl('', Validators.required),
      'office': new FormControl('', Validators.required),
    });

    this.added = false;
  }

  ngOnInit() {
  }

  sendRequest(){
    this.firebase.addRequest(this.form.value.email, this.form.value.github, this.form.value.firstname,
                             this.form.value.lastname, this.form.value.birthdate, this.form.value.gender,
                             this.form.value.job, this.form.value.studies, this.form.value.office) 
    .then(docRef => {
      this.added = true;
      console.log(`Document added with ID: ${docRef.id}`);
    }).catch(err => {
      console.error(`Error adding document: ${err}`);
    });
  }

}
