import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'http://localhost:8080/api/users/987654333'
  apiUrlAuthentication='http://localhost:8080/api/users/authentication';


  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get<User>(this.apiUrl);
  }

  postAuthentication(user: any){
    return this._http.post(this.apiUrlAuthentication,user);
  }

}
