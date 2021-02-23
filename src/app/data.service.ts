import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
<<<<<<< HEAD
  apiUrl = 'http://localhost:8080/api/users/accounts'
  postAdminCreationUrl = 'http://localhost:8080/api/users/adminCreation';
=======
  apiUrl = 'http://localhost:8080/api/users/987654333'
  apiUrlAuthentication='http://localhost:8080/api/users/authentication';
  addUserUrl = '/api/users';

>>>>>>> develop

  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get<User[]>(this.apiUrl);
  }

  postAdminCreation(registroAcadem: string){
    return this._http.post<number>(this.postAdminCreationUrl, { registroAcademico: registroAcadem });
  }
  addNewUser(user: User): Observable<any>{
    console.log('llegue a addNewUser')
    console.log(user)
    return this._http.post<any>(this.addUserUrl,user);
  }

  postAuthentication(user: any){
    return this._http.post(this.apiUrlAuthentication,user);
  }

}
