import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  text1:string = 'Chain of Custody Web App';

  constructor(private router:Router,
              private auth:AuthService) { }

  ngOnInit() {
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean{
    return this.auth.isAuthenticated();
  }

}