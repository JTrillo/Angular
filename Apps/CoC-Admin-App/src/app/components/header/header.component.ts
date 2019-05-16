import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  user;
  display:string="";

  constructor(private firebase:FirebaseService, private router:Router) {
    this.user = this.firebase.userAuthenticated();
    this.firebase.userAuthenticated().subscribe(response=>{
      if(response !== null){
        let email = response.email;
        this.firebase.getAdmin(email).subscribe(admin=>{
          this.display = `${admin['lastname']}, ${admin['firstname']} (${email})`;
        });
      }
    });
  }

  ngOnInit() {
  }

  logout(){
    this.firebase.logout().then(response=>{
      this.display = "";
      this.router.navigate(['/login']);
    });
  }

}
