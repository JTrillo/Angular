import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name: string = 'Joaquin';

  numeros: number[] = [1,2,3,4,5,6,7,8,9,10];

  numero: number = Math.PI;

  salario: number = 1994.87;

  object: Object = {foo: 'bar', baz: 'qux', nested: {xyz: 3, numbers: [1, 2, 3, 4, 5]}};

  valorDePromesa = new Promise ( (resolve, reject) => {
    setTimeout( ()=>resolve('Llego la data!'), 3500);
  });

  hoy:Date = new Date();

  nombre_completo: string = 'joaQuin trIllo escriBano';

  video:string = 'Ap_KO2DPvDc';

  contrasena:boolean = true;
}
