import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from '../headers/headers.service';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltrarSolicitudesComunidadService {
  filtrarSolicitudesComunidadURL =
    '/api/comunity/filtrarSolicitudesComunidades';
  actualizarEstadoSolicitudesComunidadURL =
    '/api/users/updateStateComunityRequest';
  deleteComunityURL = '/api/comunity/deleteComunity';
  deleteUserFromComunityURL = '/api/comunity/deleteUserFromComunity';

  //Eliminacion de usuarios de comunidad
  filtrarMiembrosActivosDeComunidadURL='/api/users/filtrarMiembrosActivosDeComunidad';
  removeUserFromComunityURL='/api/users/removeUserFromComunity';
  constructor(
    private _http: HttpClient,
    private controllHeader: HeadersService
  ) {}

  getAsignacionesComunidad(token: any, filtros: any): any {
    return this._http.post<ComunityAssign[]>(
      this.filtrarSolicitudesComunidadURL,
      filtros,
      this.controllHeader.obtenerHeaderConToken(token)
    );
  }
  actualizarEstadoAsignacionesComunidad(
    token: any,
    datos: ComunityAssign
  ): any {
    return this._http.post<ComunityAssign>(
      this.actualizarEstadoSolicitudesComunidadURL,
      datos,
      this.controllHeader.obtenerHeaderConToken(token)
    );
  }

  deleteComunity(token: any, filtros: any): Observable<any> {
    return this._http.post<any>(
      this.deleteComunityURL,
      filtros,
      this.controllHeader.obtenerHeaderConToken(token)
    );
  }
  deleteUserFromComunity(token: any, filtros: any): Observable<any> {
    return this._http.post<any>(
      this.deleteUserFromComunityURL,
      filtros,
      this.controllHeader.obtenerHeaderConToken(token)
    );
  }

  //Eliminacion de usuarios de una comunidad
  getMiembrosActivosDeComunidad(token:any,filtros:any){
    return this._http.post<ComunityAssign[]>(this.filtrarMiembrosActivosDeComunidadURL,filtros,this.controllHeader.obtenerHeaderConToken(token))
  }

  removeUserFromComunity(token:any,comunityAssign: ComunityAssign){
    return this._http.post<ComunityAssign>(this.removeUserFromComunityURL,comunityAssign,this.controllHeader.obtenerHeaderConToken(token))
  }
}
