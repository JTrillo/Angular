import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  text1:string = 'Chain of Custody Web App';

  constructor() { }

  ngOnInit() {
  }

}