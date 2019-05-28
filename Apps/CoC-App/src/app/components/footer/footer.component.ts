import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styles: []
})
export class FooterComponent implements OnInit {

  year:number;
  name:string = "Joaquín Trillo Escribano";
  company:string = "Grupo de investigación ERTIS. Universidad de Málaga";

  constructor() {
    let date = new Date();
    this.year = date.getFullYear();
  }

  ngOnInit() {
  }

}