import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'http://localhost:8080/api/users/accounts'
  postAdminCreationUrl = 'http://localhost:8080/api/users/adminCreation';

  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get<User[]>(this.apiUrl);
  }

  postAdminCreation(registroAcadem: string){
    return this._http.post<number>(this.postAdminCreationUrl, { registroAcademico: registroAcadem });
  }

}
