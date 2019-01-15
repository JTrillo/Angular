import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent{

  frase:any = {
    mensaje: "Un gran poder requiere una gran responsabilidad.",
    autor: "Ben Parker"
  }

  mostrar:boolean = true;

  cambiarMostrar(){
    this.mostrar = !this.mostrar;
  }

  personajes: string[] = ['Spiderman', 'Venom', 'Octopus'];

}
