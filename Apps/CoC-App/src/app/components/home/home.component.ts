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

  constructor(private userdata: UserDataService) {
    this.cases = this.userdata.getUserCases();
    this.evidences = this.userdata.getUserEvidences();
  }

  ngOnInit() {
  }

}