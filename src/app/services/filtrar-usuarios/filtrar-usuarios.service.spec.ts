import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HeadersService } from '../headers/headers.service';

import { FiltrarUsuariosService } from './filtrar-usuarios.service';
import users from 'src/app/Test/ArchivosJson/Users.json';
describe('FiltrarUsuariosService', () => {
  let service: FiltrarUsuariosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FiltrarUsuariosService, HeadersService],
    });
    service = TestBed.inject(FiltrarUsuariosService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('getAsignacionesComunidad', () => {
    service.getUsuarios(1, 1).subscribe((datos: any[]) => {
      expect(datos.length).toBe(2);
    });

    const request = httpMock.expectOne(`${service.filtrarUsuarios}`);
    expect(request.request.method).toBe('POST');
    request.flush(users);
  });
});
