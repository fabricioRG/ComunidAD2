import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from '../headers/headers.service';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';

@Injectable({
  providedIn: 'root'
})
export class FiltrarSolicitudesComunidadService {

  filtrarSolicitudesComunidadURL = '/api/comunity/filtrarSolicitudesComunidades';
  actualizarEstadoSolicitudesComunidadURL = '/api/users/updateStateComunityRequest';
  //Eliminacion de usuarios de comunidad
  filtrarMiembrosActivosDeComunidadURL='/api/users/filtrarMiembrosActivosDeComunidad';
  removeUserFromComunityURL='/api/users/removeUserFromComunity';

  constructor(private _http: HttpClient,private controllHeader: HeadersService) { }

  getAsignacionesComunidad(token: any,filtros: any){
    return this._http.post<ComunityAssign[]>(this.filtrarSolicitudesComunidadURL,filtros,this.controllHeader.obtenerHeaderConToken(token));
  }
  actualizarEstadoAsignacionesComunidad(token: any,datos: ComunityAssign){
    return this._http.post<ComunityAssign>(this.actualizarEstadoSolicitudesComunidadURL,datos,this.controllHeader.obtenerHeaderConToken(token));
  }

  //Eliminacion de usuarios de una comunidad
  getMiembrosActivosDeComunidad(token:any,filtros:any){
    return this._http.post<ComunityAssign[]>(this.filtrarMiembrosActivosDeComunidadURL,filtros,this.controllHeader.obtenerHeaderConToken(token))
  }

  removeUserFromComunity(token:any,comunityAssign: ComunityAssign){
    return this._http.post<ComunityAssign>(this.removeUserFromComunityURL,comunityAssign,this.controllHeader.obtenerHeaderConToken(token))
  }
}
