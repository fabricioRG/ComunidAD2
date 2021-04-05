import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, convertToParamMap, Data, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';
import { InicioComponent } from 'src/app/views/inicio/inicio.component';

import { RequestComunityComponent } from './request-comunity.component';

class MockNgbModalRef {
  componentInstance = {
    prompt: undefined,
    title: undefined
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('RequestComunityComponent', () => {
  let component: RequestComunityComponent;
  let fixture: ComponentFixture<RequestComunityComponent>;
  let modalService: NgbModal;
  let modalRef: MockNgbModalRef = new MockNgbModalRef();


  const sessionServiceMock = jasmine.createSpyObj('SesionService',
    ['exitSession', 'getUserWithToken'])

  const dataServiceMock = jasmine.createSpyObj('DataService',
    ['getUserByToken', 'findComunityById'])

  const filtrarSolicitudesComunidadServiceMock = jasmine.createSpyObj('FiltrarSolicitudesComunidadService',
    ['getAsignacionesComunidad','actualizarEstadoAsignacionesComunidad'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserDynamicTestingModule, RouterTestingModule.withRoutes([
        { path: 'inicio', component: InicioComponent }
      ])],
      declarations: [RequestComunityComponent, InicioComponent],
      providers: [NgbModal, NgbModule, ModalService, RequestComunityComponent, FormBuilder,
        {
          provide: SesionService,
          useValue: sessionServiceMock
        },
        {
          provide: DataService,
          useValue: dataServiceMock
        },
        {
          provide: FiltrarSolicitudesComunidadService,
          useValue: filtrarSolicitudesComunidadServiceMock
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
        {
          provide: NgbModalRef,
          useClass: MockNgbModalRef
        }

      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    modalService = TestBed.get(NgbModal)
    sessionServiceMock.exitSession.and.returnValue(false)
    fixture = TestBed.createComponent(RequestComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('cargarDatos', () => {
    expect(component).toBeTruthy();
  });

  it('cargar comunidades', () => {
    //Arrange
    spyOn(component, 'verificarSiComunidadEsDelUsurioLogueado').and.stub()
    sessionServiceMock.exitSession.and.returnValue(true)
    component.cargarDatos()
    //Act
    var expResult = 50
    var result = component.comunity.id;
    //Assert
    if (result) {
      expect(expResult).toEqual(result)
    }
  })

  it('verificarSiComunidadEsDelUsurioLogueado', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'

    var comunity: Comunity = new Comunity()
    comunity.id = 50
    component.comunity = comunity

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user


    sessionServiceMock.getUserWithToken.and.returnValue(user)
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    dataServiceMock.findComunityById.and.returnValue(of(comunityAssign))
    component.verificarSiComunidadEsDelUsurioLogueado()
    //Act
    var expResult = true;
    var result = component.comunidadEsDelUsuarioLogueado;
    //Assert
    expect(expResult).toEqual(result)

  })

  it('Buscar por filtros', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token = '1234'
    var comunityAssignList: ComunityAssign[] = [{}]

    sessionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarSolicitudesComunidadServiceMock.getAsignacionesComunidad.and.returnValue(of(comunityAssignList))
    component.buscarPorFiltros()
    //Act
    var expResult = comunityAssignList;
    var result = component.comunityAssignList
    //Assert
    expect(expResult).toEqual(result)
  })

  it('mostrarMensaje', () => {
    expect(component.mostrarMensaje('Header', 'Tittle', 'Mensaje')).toBeTruthy
  })

  it('aprobar solicitud', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token = 'abc'

    var comunity: Comunity = new Comunity()
    comunity.id = 50
    component.comunity = comunity
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    var spy = spyOn(modalService, "open").and.returnValue(modalRef as any)
    spyOn(component, 'buscarPorFiltros').and.stub()
    sessionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarSolicitudesComunidadServiceMock.actualizarEstadoAsignacionesComunidad.and.returnValue(of(comunityAssign))

    component.aprobarSolicitud(comunityAssign)
    //Assert
    expect(spy).toHaveBeenCalled();

  })

  it('denegar solicitud',()=>{

    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token = 'abc'

    var comunity: Comunity = new Comunity()
    comunity.id = 50
    component.comunity = comunity
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    var spy = spyOn(modalService, "open").and.returnValue(modalRef as any)
    spyOn(component, 'buscarPorFiltros').and.stub()
    sessionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarSolicitudesComunidadServiceMock.actualizarEstadoAsignacionesComunidad.and.returnValue(of(comunityAssign))
    component.denegarSolicitud(comunityAssign)
    //Assert
    expect(spy).toHaveBeenCalled();

  })

});
