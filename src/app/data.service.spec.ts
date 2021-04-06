import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { User } from './user.model';
import { of, Subject, throwError } from 'rxjs';
import user from 'src/app/Test/ArchivosJson/User3.json';
import arregloUsers from 'src/app/Test/ArchivosJson/Users.json';

import { HeadersService } from './services/headers/headers.service';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService, HeadersService],
    });
    httpClient = TestBed.inject(HttpClient);
    service = new DataService(httpClient, TestBed.inject(HeadersService));
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test para POST de autenticacion', () => {
    it('Debe retotnar un objeto que tenga los valores de un usuario', () => {
      //arrange
      let usuario = new User();
      usuario.ciudad = 'Guatemala';
      usuario.correoElectronico = 'correo@userHash.com';
      usuario.estado = 'ACTIVO';
      usuario.fechaDeNacimiento = '2011-12-13T06:00:00.000+00:00';
      usuario.fotoDePerfil = 'foto';
      usuario.genero = 'M';
      usuario.nombreCompleto = 'User hash';
      usuario.password = '2e80a184267270fc8a50f3f9aef3902e';
      usuario.registroAcademico = '111112222';
      usuario.rolUsuario = 'SUPER';
      //act
      var result = service.postAuthentication(usuario);
      //assert
      expect(result).toBeTruthy;
    });
  });
  describe('test para metodo post', () => {
    it('deberia retornar un usuario creado', () => {
      //arrange
      let usuario = new User();
      usuario.ciudad = 'ciudad';
      usuario.correoElectronico = 'correo@gmail.com';
      usuario.estado = 'ACTIVO';
      usuario.fechaDeNacimiento = '2000-01-01';
      usuario.fotoDePerfil = 'foto';
      usuario.genero = 'M';
      usuario.nombreCompleto = 'Prueba';
      usuario.password = 'Juan1!';
      usuario.registroAcademico = '200000000';
      usuario.rolUsuario = 'SUPER';
      usuario.token = '';
      //act
      var result = service.addNewUser(usuario);
      expect(result).toBeTruthy;
    });

    it('logged ing', () => {
      var loggg = new Subject<boolean>();
      var cambio = true;
      service.setLoggedIn(cambio);
      service.setLogger$(loggg);
      loggg.next(cambio);
      //act
      var result = service.isLoggedIn();
      expect(result).toEqual(loggg.asObservable());
    });
    it('actualizarEstadosAsignacionesComunidad', () => {
      service.logIn(user);
      expect(service.getLoggedIn()).not.toBeNull();

      const request = httpMock.expectOne(`${service.apiUrlObtenerToken}`);
      expect(request.request.method).toBe('POST');
      request.flush('123');
    });

    it('logout', () => {
      service.logOut();
      expect(service.getLoggedIn()).not.toBeNull();
    });

    it('getUsers', () => {
      service.getUsers().subscribe((result: User) => {
        expect(result).toEqual(user);
      });

      const request = httpMock.expectOne(`${service.apiUrl}`);
      expect(request.request.method).toBe('GET');
      request.flush(user);
    });
    it('getAllUsers', () => {
      service.getAllUsers(user).subscribe((result: User[]) => {
        expect(result.length).toBe(arregloUsers.length);
      });

      const request = httpMock.expectOne(`${service.usersURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloUsers);
    });

    it('postAdminCreation', () => {
      service.postAdminCreation('123', user).subscribe((result: number) => {
        expect(result).toBe(1);
      });

      const request = httpMock.expectOne(`${service.postAdminCreationUrl}`);
      expect(request.request.method).toBe('POST');
      request.flush(1);
    });

    it('getUserByFiltering', () => {
      service.getUsersByFiltering(user, user).subscribe((result: User[]) => {
        expect(result.length).toBe(arregloUsers.length);
      });

      const request = httpMock.expectOne(`${service.getUsersByFilteringURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloUsers);
    });
    it('postChangePasswordUser', () => {
      service.postChangePasswordUser(user, user).subscribe((result: number) => {
        expect(result).toBe(1);
      });

      const request = httpMock.expectOne(`${service.changePasswordUserURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(1);
    });
    // it('addNewUser', () => {
    //   service.postChangePasswordUser(user, user).subscribe((result: number) => {
    //     expect(result).toBe(1);
    //   });

    //   const request = httpMock.expectOne(`${service.changePasswordUserURL}`);
    //   expect(request.request.method).toBe('POST');
    //   request.flush(1);
    // });
  });
});
