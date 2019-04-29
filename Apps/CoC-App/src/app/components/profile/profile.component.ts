import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Profile, HyperledgerService } from 'src/app/services/hyperledger.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { AuthService } from 'src/app/services/auth.service';

import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  
  profile:Profile;
  birthdate_display:string;
  other_profile:boolean = false;
  form:FormGroup;
  showError:boolean = false;
  errorMsg:string = "";

  constructor(private userdata:UserDataService,
              private hyperledger:HyperledgerService,
              private activatedRoute:ActivatedRoute,
              private location:Location,
              private db:AngularFirestore,
              private auth:AuthService,
              private router:Router
  ) {
    
    this.activatedRoute.params.subscribe ( params => {
      if(params['user_id']!=undefined){
        this.hyperledger.getProfile(params['user_id']).subscribe(response =>{
          this.profile = {
            identifier: response['participantId'],
            firstName: response['firstName'],
            lastName: response['lastName'],
            birthdate: new Date(response['birthdate']),
            gender: response['gender'],
            job: response['job'],
            studies: response['studies'],
            office: response['office']
          };
          this.birthdate_display = `${this.profile.birthdate.getFullYear()}-${this.profile.birthdate.getMonth()+1}-${this.profile.birthdate.getDate()}`;
        });
        this.other_profile = true;
      }else{
        this.profile = this.userdata.getUserProfile();
        this.birthdate_display = `${this.profile.birthdate.getFullYear()}-${this.profile.birthdate.getMonth()+1}-${this.profile.birthdate.getDate()}`;
      }
    });
    
    //FORM - CHANGE PASSWORD
    this.form = new FormGroup({
      'cur_pass': new FormControl('', Validators.required),
      'new_pass': new FormControl('', Validators.required),
      'rep_pass': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    
  }

  changePassword(){
    console.log(this.form.value);
    if(this.form.value.new_pass === this.form.value.cur_pass){
      this.showError = true;
      this.errorMsg = "New password must be different from current one";
    }else{
      if(this.form.value.new_pass === this.form.value.rep_pass){
        this.db.collection('users').doc(this.profile.identifier).get().subscribe(user=>{
          if(user.data()['pass']!==this.form.value.cur_pass){
            this.showError = true;
            this.errorMsg = "Current password not correct";
          }else{
            this.db.collection('users').doc(this.profile.identifier).update({
              "pass": this.form.value.new_pass
            }).then(()=>{
              console.log("Pass modified");
              this.auth.logout();
              this.router.navigate(['/login']);
            }).catch((err)=> console.log(`Error when updating password. More info: ${err}`));
          }
        });
      }else{
        this.showError = true;
        this.errorMsg = "New password and confirmation are not the same";
      }
    }
  }

  backPressed(){
    this.location.back();
  }

}