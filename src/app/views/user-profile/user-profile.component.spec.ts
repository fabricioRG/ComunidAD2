import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Data, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';

import { UserProfileComponent } from './user-profile.component';
import dataUser from 'src/app/Test/ArchivosJson/User3.json';
import user from 'src/app/Test/ArchivosJson/User3.json';
import arregloUsers from 'src/app/Test/ArchivosJson/Users.json';
import arregloComunities from 'src/app/Test/ArchivosJson/ArregloComunitys.json';
import curso from 'src/app/Test/ArchivosJson/course.json';
import arregloAsigns from 'src/app/Test/ArchivosJson/AsignacionesComunidad.json';
import arregloPosts from 'src/app/Test/ArchivosJson/comunityPosts.json';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let dataService: DataService;
  let sesionService: SesionService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [HttpClientTestingModule, RouterTestingModule], //,
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '50' }),
            },
            paramMap: {
              subscribe: (fn: (value: Data) => void) => fn({
              }),
            }
          }
        },
        DataService,
        HeadersService,
        HttpClient,
        SesionService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    sesionService = new SesionService(TestBed.inject(HttpClient), dataService);
    component = new UserProfileComponent(
      TestBed.inject(Router),
      TestBed.inject(ActivatedRoute),
      dataService,
      sesionService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    // spyOn(component,'loadUser').and.stub();
    expect(component).toBeTruthy();
  });
  it('load userCorrect', () => {
    var spy1 = spyOn(sesionService, 'exitSession').and.returnValue(true);
    var spy2 = spyOn(component, 'getUserInfo').and.stub();
    component.loadUser();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('load userCorrect', () => {
    var spy1 = spyOn(sesionService, 'exitSession').and.returnValue(false);
    component.loadUser();
    expect(spy1).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
  });

  it('getUserInfo', () => {
    var spy1 = spyOn(dataService, 'getUserByToken').and.returnValue(
      of(dataUser)
    );
    var spy2 = spyOn(dataService, 'findUserById').and.returnValue(of(dataUser));

    component.getUserInfo();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.actualUser).toBe(dataUser);
  });
  it('getUserInfoBad', () => {
    var spy1 = spyOn(dataService, 'getUserByToken').and.returnValue(
      of(dataUser)
    );
    var spy2 = spyOn(dataService, 'findUserById').and.returnValue(
      throwError('a')
    );

    component.getUserInfo();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    //expect(component.actualUser).toBe(dataUser);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
  });
  it('getComunitysWithLenght>0', () => {
    component.actualUser = user;
    var spy1 = spyOn(dataService, 'findUserComunitys').and.returnValue(
      of(arregloAsigns)
    );

    component.getCommunitys();
    expect(spy1).toHaveBeenCalled();
    expect(component.usuarioTieneComunidades).toBeTruthy();
  });
  it('getComunitysWithLenght=0', () => {
    component.actualUser = user;

    var spy1 = spyOn(dataService, 'findUserComunitys').and.returnValue(of([]));

    component.getCommunitys();
    expect(spy1).toHaveBeenCalled();
    expect(component.usuarioTieneComunidades).toBeFalsy();
  });
  it('getComunitysWithLenghtWhenError', () => {
    component.actualUser = user;

    var spy1 = spyOn(dataService, 'findUserComunitys').and.returnValue(
      throwError('a')
    );
    var spy2 = spyOn(console, 'log');
    component.getCommunitys();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('verComunidadWithId', () => {
    var comunidad = 1;
    component.verComunidad(comunidad);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'viewComunity',
      comunidad,
    ]);
  });
  it('verComunidadWithoutId', () => {
    var comunidad = undefined;
    var spy2 = spyOn(console, 'log');
    component.verComunidad(comunidad);
    expect(mockRouter.navigate).not.toHaveBeenCalledWith([
      'viewComunity',
      comunidad,
    ]);
    expect(spy2).toHaveBeenCalled();
  });

  it('getImage', () => {
    var datos = 'aaa';
    var encabezado = 'b';
    component.encabezadoFoto = encabezado;
    var result = component.getImage(datos);
    expect(result).toEqual(encabezado + datos);
  });
  it('getImage', () => {
    var datos = null;
    var encabezado = 'b';
    component.encabezadoFoto = encabezado;
    var result = component.getImage(datos);
    expect(result).toEqual(encabezado + datos);
  });
});
