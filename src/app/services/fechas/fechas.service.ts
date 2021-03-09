import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechasService {

  constructor() { }




  convertirFecha(date: Date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) {
      if (day < 10) {
        return `${year}-0${month}-0${day}`;
      } else {
        return `${year}-0${month}-${day}`;
      }
    } else {
      if (day < 10) {
        return `${year}-${month}-0${day}`;
      } else {
        return `${year}-${month}-${day}`;
      }
    }
  }

  compararFechas(fechaNacimiento: string, fechaActual: string) {
    var dateNac = new Date(fechaNacimiento)
    var dateActual = new Date(fechaActual)
    dateNac.setTime(dateNac.getTime()+21600000)
    dateActual.setTime(dateActual.getTime()+21600000)

    21600000
    console.log('comparandoFechas sin formato: ');
    console.log('Nacimiento: '+ fechaNacimiento);
    console.log('Actual'+ fechaActual);
    
    console.log('comparandoFechas Con formato: ');
    console.log('Nacimiento: '+dateNac);
    console.log('Actual: '+dateActual);
    if (
      dateNac.getTime() >= dateActual.getTime()
    ) {
      return false;
    } else {
      return true;
    }
  }
}
