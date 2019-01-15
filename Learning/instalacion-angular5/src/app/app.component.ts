import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Joaquin Trillo Webapp';
  public description = 'Curso de introducción a Angular 5';
  public cont = 0;

  oneMore(e){
  	console.log(e.type);
  	this.cont = this.cont +1;
  }
}
