import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DepartamentoService {
  departmentUrl = '/get/department/getDepartments';

  constructor(private _http: HttpClient) {}

  getDepartamentos(): any {
    return this._http.get<any>(this.departmentUrl);
  }
}
