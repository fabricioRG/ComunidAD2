import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  postAdminCreationUrl = 'http://localhost:8080/api/users/adminCreation';
  apiUrl2 = 'http://localhost:8080/api/users/accounts'
  apiUrl = 'http://localhost:8080/api/users/987654333'
  apiUrlAuthentication='http://localhost:8080/api/users/authentication';
  apiUrlObtenerToken='http://localhost:8080/token';
  addUserUrl = 'http://localhost:8080/creation/users';
  userByTokenUrl = '/api/users/findbytoken';


  constructor(private _http: HttpClient) { }

  getUsers() {
    return this._http.get<User>(this.apiUrl);
  }

  getAllUsers(){
    return this._http.get<User[]>(this.apiUrl2);
  }

  postAdminCreation(registroAcadem: string){
    return this._http.post<number>(this.postAdminCreationUrl, { registroAcademico: registroAcadem });
  }
  addNewUser(user: User): Observable<any>{
    console.log('llegue a addNewUser')
    console.log(user)
    return this._http.post<any>(this.addUserUrl,user);
  }
  


  getToken(user: any){
    let headers = new HttpHeaders({
        
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Origin': '*'
      });
    let options = { headers: headers };
    return this._http.post(this.apiUrlObtenerToken,user, options);
  }
  
  getUserByToken(token: User) {
    console.log(token)
    console.log('En data service: '+token.token)
    let headers = new HttpHeaders({    
      'Authorization': 'Bearer '+token.token,
      
    });
    let options = { headers: headers };
    return this._http.post<User>(this.userByTokenUrl,token,options);
  }
  postAuthentication(user: any){
    return this._http.post(this.apiUrlAuthentication,user);
  }

}
