import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Case, Evidence } from '../../services/hyperledger.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: []
})
export class SearchComponent implements OnInit {
  
  keyword:string;
  cases:Case[];
  evidences:Evidence[];

  constructor(private activatedRoute:ActivatedRoute,
              private userdata:UserDataService) {
    this.cases = [];
    this.evidences = [];
    this.activatedRoute.params.subscribe(params =>{
      this.keyword = params['keyword'];
      //Get case ids that match with the keyword
      this.cases = this.userdata.getUserCases().filter(value=>{
        return value.identifier.includes(this.keyword);
      });
      //Get evidence ids that match with the keyword
      this.evidences = this.userdata.getUserEvidences().filter(value=>{
        return value.identifier.includes(this.keyword);
      });
    });
  }

  ngOnInit() {
  }

}
