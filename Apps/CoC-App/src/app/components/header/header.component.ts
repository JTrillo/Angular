import { Component, OnInit } from '@angular/core';
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

  constructor(private router:Router,
              private auth:AuthService,
              private userdata:UserDataService) { }

  ngOnInit() {
    
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean{
    if(this.auth.isAuthenticated()){
      let profile:Profile = this.userdata.getUserProfile();
      this.userDisplay = `${profile.lastName}, ${profile.firstName} (${profile.identifier}) `;
      return true;
    }

    return false;
  }

}