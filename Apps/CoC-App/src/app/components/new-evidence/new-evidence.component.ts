import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-evidence',
  templateUrl: './new-evidence.component.html',
  styles: []
})
export class NewEvidenceComponent implements OnInit {

  case_id:string;

  constructor(private activatedRoute:ActivatedRoute) {
    this.activatedRoute.params.subscribe( params => {
      this.case_id = params['case_id'];
    });
  }

  ngOnInit() {
  }

}
