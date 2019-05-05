import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HyperledgerService } from '../../services/hyperledger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(private hyperledger:HyperledgerService) {
    //CONTINUAR AQUI MAÑANA
    this.hyperledger.getProfile('12345').subscribe(response => {

    });
  }

  ngOnInit() { }

}
