import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Profile, HyperledgerService } from 'src/app/services/hyperledger.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  
  profile:Profile;
  birthdate_display:string;
  other_profile:boolean = false;

  constructor(private userdata:UserDataService,
              private hyperledger:HyperledgerService,
              private activatedRoute:ActivatedRoute,
              private location:Location
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
          this.birthdate_display = this.dateToInputDate(this.profile.birthdate);
        });
        this.other_profile = true;
      }else{
        this.profile = this.userdata.getUserProfile();
        this.birthdate_display = this.dateToInputDate(this.profile.birthdate);
      }
    });
    
  }

  ngOnInit() {
    
  }

  backPressed(){
    this.location.back();
  }

  private dateToInputDate(date:Date): string{
    let day = date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate();
    let month = date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1;
    let aux = `${date.getFullYear()}-${month}-${day}`;
    return aux;
  }

}