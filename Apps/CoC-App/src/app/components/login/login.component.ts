import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  form:FormGroup;
  showFail:boolean;
  showFailMsg:string;

  constructor(private router:Router,
              private auth:AuthService,
              private db:AngularFirestore) {
    this.form = new FormGroup({
      'identifier': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
    this.showFail = false;
    this.showFailMsg = "";
  }

  ngOnInit() {
  }

  signin(){
    //console.log(this.form.value);
    let identifier = this.form.value.identifier;
    let password = this.form.value.password;

    //1. Check if user exists (verify collection in Firestore) and check if user-pass combination is correct
    this.db.collection('users').doc(identifier).get().subscribe(user=>{
      if(user.data()==undefined){
        this.showFail=true;
        this.showFailMsg = `User ${identifier} does not exist`;
      }else if(user.data()['pass']!==password){
        this.showFail=true;
        this.showFailMsg = `Password for user ${identifier} is not valid`;
      }else{
        this.auth.login(identifier);
        /*if(success){
          this.router.navigate(['/home']);
        }else{
          this.showFail = true;
          this.showFailMsg = `Error when communicating with blockchain. Please try again`;
        }*/
      }
    });
  }

  signup(){
    this.router.navigate(['/signup']);
  }
}
