import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { Profile } from 'src/app/services/hyperledger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  text1:string = 'Chain of Custody Web App';
  userDisplay:string;

  form:FormGroup;

  constructor(private auth:AuthService,
              private userdata:UserDataService,
              private router:Router) {

    this.form = new FormGroup({
      'keyword': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    
  }

  logout(){
    this.auth.logout();
  }

  isAuthenticated(): boolean{
    if(this.auth.isAuthenticated()){
      let profile:Profile = this.userdata.getUserProfile();
      this.userDisplay = `${profile.lastName}, ${profile.firstName} (${profile.identifier}) `;
      return true;
    }
    return false;
  }

  isTech(): boolean{
    if(this.userdata.getUserProfile().office === "FORENSICS_TECHNICIAN"){
      return true;
    }
    return false;
  }

  search(){
    this.router.navigate(['/search', this.form.value.keyword.toUpperCase()]);
  }

}