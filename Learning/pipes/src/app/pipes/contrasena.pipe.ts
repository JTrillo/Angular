import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contrasena'
})
export class ContrasenaPipe implements PipeTransform {

  transform(value: string, contrasena: boolean=true): string {
    if(contrasena){
      let toReturn: string = "";
      for(let i=0; i<value.length; i++){
        toReturn+="*";
      }
      return toReturn;
    }else{
      return value;
    }
  }

}
