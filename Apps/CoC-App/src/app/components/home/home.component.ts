import { Component, OnInit } from '@angular/core';
import { Case, Evidence } from 'src/app/services/hyperledger.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  
  cases: Case[];
  evidences: Evidence[];
  no_cases: boolean;
  no_evidences: boolean;

  constructor(private userdata: UserDataService) {
    this.cases = this.userdata.getUserCases();
    this.no_cases = this.cases.length > 0 ? false : true;
    this.evidences = this.userdata.getUserEvidences();
    this.no_evidences = this.evidences.length > 0 ? false : true;
  }

  ngOnInit() {
  }

}