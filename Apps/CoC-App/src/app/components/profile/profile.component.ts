import { Component, OnInit } from '@angular/core';
import { HyperledgerService, Profile } from 'src/app/services/hyperledger.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  
  profile:Profile;
  birthdate_display:string;
  other_profile:boolean = false;

  constructor(private hyperledger:HyperledgerService,
              private activatedRoute: ActivatedRoute,
              private location: Location
  ) {
    
    this.activatedRoute.params.subscribe ( params => {
      if(params['user_id']!=undefined){
        this.profile = this.hyperledger.getProfile(params['user_id']);
        this.other_profile = true;
      }else{
        this.profile = this.hyperledger.getUserProfile();
      }
    });
    this.birthdate_display = `${this.profile.birthdate.getFullYear()}-${this.profile.birthdate.getMonth()+1}-${this.profile.birthdate.getDate()}`;
  }

  ngOnInit() {
    
  }

  backPressed(){
    this.location.back();
  }

}