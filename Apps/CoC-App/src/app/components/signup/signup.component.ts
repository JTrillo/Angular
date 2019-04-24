import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { defineBase } from '@angular/core/src/render3';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: []
})
export class SignupComponent implements OnInit {

  form:FormGroup;

  constructor(private router:Router,
              private db:AngularFirestore) {
    this.form = new FormGroup({
      'firstname': new FormControl('', Validators.required),
      'lastname': new FormControl('', Validators.required),
      'birthdate': new FormControl('', Validators.required),
      'gender': new FormControl('', Validators.required),
      'job': new FormControl('', Validators.required),
      'studies': new FormControl('', Validators.required),
      'office': new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
  }

  sendRequest(){
    this.db.collection("new_users").add({
      firstname: this.form.value.firstname,
      lasttname: this.form.value.lastname,
      birthdate: this.form.value.birthdate,
      gender: this.form.value.gender,
      job: this.form.value.job,
      studies: this.form.value.studies,
      office: this.form.value.office
    }).then(docRef => {
      console.log(`Document added with ID: ${docRef.id}`);
    }).catch(err => {
      console.error(`Error adding document: ${err}`);
    });
  }

  signin(){
    this.router.navigate(['/login']);
  }

}
