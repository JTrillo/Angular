import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserDataService } from 'src/app/services/user-data.service';
import { Evidence } from 'src/app/services/hyperledger.service';

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styles: []
})
export class EvidenceComponent implements OnInit {

  evidence:Evidence;

  constructor(private activatedroute:ActivatedRoute,
              private userdata:UserDataService,
              private location:Location) {
    this.activatedroute.params.subscribe(params => {
      let evidence_id = params['evi_id'];
      this.evidence = this.userdata.getEvidence(evidence_id);
      console.log(this.evidence);
    });
  }

  ngOnInit() {
  }

  openModalTransfer(){
    console.log("openModalTransfer pressed");
  }

  downloadCopy(){
    console.log("downloadCopy pressed");
  }

  goBack(){
    this.location.back();
  }

}
