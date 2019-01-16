import { Component, OnInit } from '@angular/core';
import { HyperledgerService, Case, Evidence } from 'src/app/services/hyperledger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  
  cases: Case[];
  evidences: Evidence[];

  constructor(private hyperledger: HyperledgerService) {
    this.cases = this.hyperledger.getUserCases();
    this.evidences = this.hyperledger.getUserEvidences();
  }

  ngOnInit() {
  }

}