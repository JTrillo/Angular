import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  title1:string = "My opened cases";
  title2:string = "My evidences";
  
  constructor() { }

  ngOnInit() {
  }

}
