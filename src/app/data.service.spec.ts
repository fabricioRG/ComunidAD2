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
import arregloComunities from 'src/app/Test/ArchivosJson/ArregloComunitys.json';
import curso from 'src/app/Test/ArchivosJson/course.json';
import arregloAsigns from 'src/app/Test/ArchivosJson/AsignacionesComunidad.json';
import arregloPosts from 'src/app/Test/ArchivosJson/comunityPosts.json';
import { HeadersService } from './services/headers/headers.service';
import { OrdinaryObject } from './helpers/ordinary-object.model';
import { Comunity } from './models/comunity.model';
import { Course } from './models/course.model';
import { ComunityAssign } from './models/comunityAssign.model';
import { CommunityPost } from './models/comunityPost.model';

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
    it('addNewUser', () => {
      service.addNewUser(user).subscribe((result: any) => {
        expect(result).toEqual(user);
      });

      const request = httpMock.expectOne(`${service.addUserUrl}`);
      expect(request.request.method).toBe('POST');
      request.flush(user);
    });
    it('getToken', () => {
      service.getToken(user).subscribe((result: any) => {
        expect(result).toEqual('123');
      });
      const request = httpMock.expectOne(`${service.apiUrlObtenerToken}`);
      expect(request.request.method).toBe('POST');
      request.flush('123');
    });
    it('getUserByToken', () => {
      service.getUserByToken(user).subscribe((result: User) => {
        expect(result).toEqual(user);
      });
      const request = httpMock.expectOne(`${service.userByTokenUrl}`);
      expect(request.request.method).toBe('POST');
      request.flush(user);
    });
    it('getUserBySearch', () => {
      let search: OrdinaryObject = {
        stringParam: 'a',
      };

      service.getUsersBySearch(search, user).subscribe((result: User[]) => {
        expect(result.length).toEqual(arregloUsers.length);
      });
      const request = httpMock.expectOne(`${service.getUsersBySearchURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloUsers);
    });

    it('getComunitiesBySearch', () => {
      let search: OrdinaryObject = {
        stringParam: 'a',
      };

      service
        .getCommunitiesBySearch(search, user)
        .subscribe((result: Comunity[]) => {
          expect(result.length).toEqual(arregloComunities.length);
        });
      const request = httpMock.expectOne(
        `${service.getCommunitiesBySearchURL}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(arregloComunities);
    });
    it('postAuthentication', () => {
      service.postAuthentication(user).subscribe((result: any) => {
        expect(result).toEqual(1);
      });
      const request = httpMock.expectOne(`${service.apiUrlAuthentication}`);
      expect(request.request.method).toBe('POST');
      request.flush(1);
    });
    it('getCourses', () => {
      service.getCourses(user).subscribe((result: Course) => {
        expect(result).toEqual(curso);
      });
      const request = httpMock.expectOne(`${service.coursesUrl}`);
      expect(request.request.method).toBe('POST');
      request.flush(curso);
    });
    it('saveComunity', () => {
      service
        .saveComunity(arregloComunities[0], user)
        .subscribe((result: Comunity) => {
          expect(result).toEqual(arregloComunities[0]);
        });
      const request = httpMock.expectOne(`${service.addComunityUrl}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloComunities[0]);
    });
    it('saveComunityAssign', () => {
      service
        .saveComunityAssign(arregloAsigns[0], user)
        .subscribe((result: Comunity) => {
          expect(result).toEqual(arregloAsigns[0]);
        });
      const request = httpMock.expectOne(`${service.saveComunityAssignURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloAsigns[0]);
    });
    it('findComunityByRegistroAcademico', () => {
      service
        .findComunytyByRegistroAcademico(user)
        .subscribe((result: ComunityAssign[]) => {
          expect(result.length).toEqual(arregloAsigns.length);
        });
      const request = httpMock.expectOne(
        `${service.findComunytyByRegistroAcademicoUrl}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(arregloAsigns);
    });
    it('findComunityById', () => {
      service
        .findComunityById(arregloComunities[0], user)
        .subscribe((result: ComunityAssign) => {
          expect(result).toEqual(arregloAsigns[0]);
        });
      const request = httpMock.expectOne(`${service.findComunityByIdURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloAsigns[0]);
    });
    it('findUserById', () => {
      service.findUserById(user, user).subscribe((result: User) => {
        expect(result).toEqual(user);
      });
      const request = httpMock.expectOne(`${service.findUserByIdURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(user);
    });
    it('findSuscriptionComunity', () => {
      service
        .findSuscriptionComunity(arregloAsigns[0], user)
        .subscribe((result: User) => {
          expect(result).toEqual(arregloAsigns[0]);
        });
      const request = httpMock.expectOne(
        `${service.findSuscriptionComunityURL}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(arregloAsigns[0]);
    });
    it('findUserComunitys', () => {
      service.findUserComunitys(user).subscribe((result: ComunityAssign[]) => {
        expect(result.length).toEqual(arregloAsigns.length);
      });
      const request = httpMock.expectOne(`${service.findUserComunitysURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloAsigns);
    });

    it('getLoggedIn', () => {
      var expected = false;
      service.setLoggedIn(expected);
      var result = service.getLoggedIn();
      expect(result).toBeFalse();
    });
    it('trueLoggedIn', () => {
      service.trueLoggedIn();
      var result = service.getLoggedIn();
      expect(result).toBeTrue();
    });
    it('getTokenSession', () => {
      service.trueLoggedIn();
      var result = service.getTokenSession();
      expect(service.getLoggedIn()).toBeTrue();
    });

    it('updateAnyUser', () => {
      service.updateAnyUser(user, 'token').subscribe((result: User) => {
        expect(result).toEqual(user);
      });
      const request = httpMock.expectOne(`${service.userUpdateUrl}`);
      expect(request.request.method).toBe('POST');
      request.flush(user);
    });
    it('PersistComunityPOst', () => {
      service
        .persistCommunityPost(arregloPosts[0], user)
        .subscribe((result: CommunityPost) => {
          expect(result).toEqual(arregloPosts[0]);
        });
      const request = httpMock.expectOne(`${service.communityPostCreateURL}`);
      expect(request.request.method).toBe('POST');
      request.flush(arregloPosts[0]);
    });
    it('Get all ComunityPOst by comunity', () => {
      let search: OrdinaryObject = {
        stringParam: 'a',
      };
      service
        .getAllCommunityPostByCommunity(search, user)
        .subscribe((result: CommunityPost[]) => {
          expect(result.length).toEqual(arregloPosts.length);
        });
      const request = httpMock.expectOne(
        `${service.findAllCommunityPostByCommunityURL}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(arregloPosts);
    });
    it('Get all users in comunity', () => {
      let search: OrdinaryObject = {
        stringParam: 'a',
      };
      service
        .getAllUsersInCommunity(search, user)
        .subscribe((result: User[]) => {
          expect(result.length).toEqual(arregloUsers.length);
        });
      const request = httpMock.expectOne(
        `${service.findAllUsersInCommunityURL}`
      );
      expect(request.request.method).toBe('POST');
      request.flush(arregloUsers);
    });
    it('Get logger', () => {
      var loggg = new Subject<boolean>();
      service.setLogger$(loggg);
      var result = service.getLogger$();
      expect(result).toBeTruthy();
    });
  });
});
