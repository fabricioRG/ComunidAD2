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

  constructor(
    private _http: HttpClient,
    private controllHeader: HeadersService
  ) {}

  getAsignacionesComunidad(token: any, filtros: any) {
    return this._http.post<ComunityAssign[]>(
      this.filtrarSolicitudesComunidadURL,
      filtros,
      this.controllHeader.obtenerHeaderConToken(token)
    );
  }
  actualizarEstadoAsignacionesComunidad(token: any, datos: ComunityAssign) {
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
}
