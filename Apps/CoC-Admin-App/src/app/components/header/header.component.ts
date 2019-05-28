import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(public firebase:FirebaseService, private router:Router) { }

  ngOnInit() {
  }

  logout(){
    this.firebase.logout().then(()=>{
      this.router.navigate(['/login']);
    });
  }

}
