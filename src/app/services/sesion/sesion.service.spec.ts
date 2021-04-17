import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { componentFactoryName } from '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/user.model';

import { SesionService } from './sesion.service';

describe('SesionService', () => {
  let service: SesionService;
  let httpMock :HttpTestingController;
  const dataServiceMock = jasmine.createSpyObj('DataService',
    ['getUserByToken'])

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SesionService,
        {
          provide: DataService,
          useValue: dataServiceMock
        }
      ]
    });
    var user: User = new User()
    user.rolUsuario = 'SUPER'
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify('token'))
    service = TestBed.inject(SesionService);
    httpMock = TestBed.get(HttpTestingController);

    //spyOn(localStorage.__proto__, 'getItem').and.returnValue('true');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loggedIn', () => {
    expect(service.loggedIn$()).toBeTruthy()
  })

  it('logOut', () => {
    service.log0ut()
    var expResult = false;
    var result = service.getLoggedIn();
    expect(expResult).toEqual(result)
  })

  it('asignarTipodeUsuarioSinSesion', () => {
    service.asignarTipodeUsuarioSinSesion();
    expect(false).toEqual(service.usuarioEsSuscriptor())
  })

  it('usuarioEsAdministradorDeSistema', () => {
    service.asignarTipodeUsuarioSinSesion();
    expect(false).toEqual(service.usuarioEsAdministradorDeSistema())
  })
  it('usuarioEsAdministradorDeComunidad', () => {
    service.asignarTipodeUsuarioSinSesion();
    expect(false).toEqual(service.usuarioEsAdministradorDeComunidad())
  })

  it('getLogger', () => {
    expect(service.getLogger()).toBeTruthy()
  })

  it('logIn', () => {
    var user: User = new User()
    expect(service.logIn(user)).toBeUndefined()

  })
});

