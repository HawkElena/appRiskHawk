import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: "root"

})

export class GetParamGlobalService {
  
  constructor(public miDatePipe: DatePipe) {

  }

//   getParamLocalStorage() {
//     this.arregloPamam = JSON.parse(localStorage.getItem('currentUser'));
//     return this.arregloPamam;

//   }
  getFechaFormateada(strCampoFecha:string){
    // let dia   = strCampoFecha.split('/')[0];
    // let mes   = strCampoFecha.split('/')[1];
    // let anio  = strCampoFecha.split('/')[2];
    // if(dia.length<2){
    //   dia = '0' + dia;
    // }

    // let fecha = anio.substring(0,4) + '-' + mes + '-' + dia;
    // let fecha = this.miDatePipe.transform(strCampoFecha, 'dd-MM-yyyy');
    let fecha = this.miDatePipe.transform(strCampoFecha, 'yyyy-MM-dd');
    // console.log("fecha formato yyyy-mm-dd",fecha);

    return fecha
}

}
