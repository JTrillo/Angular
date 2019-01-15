import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizado'
})
export class CapitalizadoPipe implements PipeTransform {

  transform(value: string, todas:boolean = true): string {
    value = value.toLowerCase();
    let palabras = value.split(" ");

    if(todas){
      for(let index in palabras){
        palabras[index] = palabras[index][0].toUpperCase() + palabras[index].substr(1);
      }
    }else{ //Solo ponemos en mayus la primera letra de la primera palabra
      palabras[0] = palabras[0][0].toUpperCase() + palabras[0].substr(1);
    }
    

    return palabras.join(" ");
  }

}
