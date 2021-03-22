import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/user.model';
import { HeadersService } from '../headers/headers.service';

@Injectable({
  providedIn: 'root'
})
export class FiltrarUsuariosService {

  filtrarUsuarios = '/api/users/filtrarUsuarios';

  constructor(private _http: HttpClient,private controllHeader: HeadersService) { }

  getUsuarios(token: any,filtro: any){
      return this._http.post<User[]>(this.filtrarUsuarios,filtro,this.controllHeader.obtenerHeaderConToken(token));
    }
}
