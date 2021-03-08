import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  postAdminCreationUrl = '/api/users/adminCreation';
  apiUrl2 = '/api/users/accounts'
  apiUrl = 'http://localhost:8080/api/users/987654333'
  apiUrlAuthentication = 'http://localhost:8080/api/users/authentication';
  apiUrlObtenerToken = 'http://localhost:8080/token';
  addUserUrl = 'http://localhost:8080/creation/users';
  userByTokenUrl = '/api/users/findbytoken';
  coursesUrl = '/api/users/getCourses';
  usersURL = '/api/users/accounts';
  addComunityUrl = '/api/users/creationComunity';
  changePasswordUserURL = '/api/users/changePassword';

  private logger$ = new Subject<boolean>();//Va a emitir un evento
  private loggedIn: boolean;

  constructor(private _http: HttpClient) {
    if (localStorage.getItem('token') === null) {//No hay session
      this.loggedIn = false;
    } else {
      this.loggedIn = true;
    }


  }


  isLoggedIn(): Observable<boolean> {//Crea el Observer
    return this.logger$.asObservable();
  }


  logIn(user: User) {
    let headers = new HttpHeaders({

      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    });
    let options = { headers: headers };
    this._http.post(this.apiUrlObtenerToken, user, options).subscribe(result => {
      localStorage.setItem('token', JSON.stringify(result));
      if (result != null) {
        this.loggedIn = true;
        this.logger$.next(this.loggedIn);//Avisar a los observadores si se logueo
      }

    }, error => {

      console.log(error.error)
      this.logger$.next(this.loggedIn);
    });
  }

  logOut() {
    console.log("SESSION LOG OUT")
    this.loggedIn = false;
    localStorage.clear();
    this.logger$.next(this.loggedIn);
  }

  getUsers() {
    return this._http.get<User>(this.apiUrl);
  }

  getAllUsers(token: User) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post<User[]>(this.usersURL, token, options);
  }

  postAdminCreation(registroAcadem: string, token: User) {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post<number>(this.postAdminCreationUrl, { registroAcademico: registroAcadem }, options);
  }

  postChangePasswordUser(usr: User, token:User){
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post<number>(this.changePasswordUserURL, usr, options);
  }

  addNewUser(user: User): Observable<any> {
    console.log('llegue a addNewUser')
    console.log(user)
    return this._http.post<any>(this.addUserUrl, user);
  }

  getToken(user: any) {
    let headers = new HttpHeaders({
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Origin': '*'
    });
    let options = { headers: headers };
    return this._http.post(this.apiUrlObtenerToken, user, options);
  }

  getUserByToken(token: User) {
    console.log(token)
    console.log('En data service: ' + token.token)
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post<User>(this.userByTokenUrl, token, options);
  }

  postAuthentication(user: any) {
    return this._http.post(this.apiUrlAuthentication, user);
  }


  //Post para traer todos los cursos de la base de datos
  getCourses(token: User) {
    console.log(token)
    console.log('En data service: ' + token.token)
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post<User>(this.coursesUrl, token, options);
  }

  //Posta para agregar comunidad
  saveComunity(comunity: any, token: User) {
    console.log('En save comunity: ' + comunity.nombre)
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post(this.addComunityUrl, comunity, options);
  }

  public getLoggedIn() {
    return this.loggedIn;
  }

  public getTokenSession() {

  }

}
