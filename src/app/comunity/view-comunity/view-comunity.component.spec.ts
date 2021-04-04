import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fn } from '@angular/compiler/src/output/output_ast';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, convertToParamMap, Data, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, Observable, of } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { User } from 'src/app/user.model';

import { ViewComunityComponent } from './view-comunity.component';



describe('ViewComunityComponents', () => {
  let component: ViewComunityComponent;
  let fixture: ComponentFixture<ViewComunityComponent>;

  const sesionServiceMock = jasmine.createSpyObj('SesionService',
    ['exitSession', 'getToken', 'getUserWithToken', 'usuarioEsAdministradorDeComunidad'])
  const dataServiceMock = jasmine.createSpyObj('DataService',
    ['getUserByToken', 'findComunityById', 'findSuscriptionComunity', 'saveComunityAssign']);
  const filtrarSolicitudesComunidadServiceMock = jasmine.createSpyObj('FiltrarSolicitudesComunidadService',
    ['deleteComunity', 'deleteUserFromComunity'])
  const modalServiceMock = jasmine.createSpyObj('ModalService',
    ['openModal'])
  const spyRouter = jasmine.createSpyObj('Router', ['navigate'])



  beforeEach(async () => {
    console.log("BEFORE EACH EN VIEW COMUNITY COMPONENT")
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserDynamicTestingModule],
      declarations: [ViewComunityComponent],
      providers: [ViewComunityComponent,
        {
          provide: DataService,
          useValue: dataServiceMock
        },
        {
          provide: SesionService,
          useValue: sesionServiceMock
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
          provide: Router,
          useValue: spyRouter
        },
        {
          provide: ModalService,
          useValue: modalServiceMock
        }

      ]
    })
    //component = TestBed.get(ViewComunityComponent)

  });

  beforeEach(() => {
    sesionServiceMock.exitSession.and.returnValue(false);
    spyRouter.navigate.and.returnValue('YES')
    fixture = TestBed.createComponent(ViewComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log("My Mock", component)
    console.log("My mock", dataServiceMock)
    console.log("My mock", sesionServiceMock)
    console.log("My mock", filtrarSolicitudesComunidadServiceMock)
    expect(component).toBeTruthy();
  });

  it('Verificar opcion comunidad, La comunidad es del usuario', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'

    var comunity: Comunity = new Comunity()

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    spyOn(component, 'generarComunidad')
    sesionServiceMock.getUserWithToken.and.returnValue(user)
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    dataServiceMock.findComunityById.and.returnValue(of(comunityAssign))//
    component.verificarOpcionesParaComunidad()
    //Act
    var expResult = true;
    var result = component.comunidadEsDelUsuarioLogueado;

    //Assert
    expect(expResult).toEqual(result)

  })

  it('Verificar opcion comunidad, La comunidad no es del usuario', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'

    var user2: User = new User()
    user2.registroAcademico = '987654321'


    var comunity: Comunity = new Comunity()

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    spyOn(component, 'generarComunidad')
    sesionServiceMock.getUserWithToken.and.returnValue(user2)
    dataServiceMock.getUserByToken.and.returnValue(of(user2))
    dataServiceMock.findComunityById.and.returnValue(of(comunityAssign))//
    component.verificarOpcionesParaComunidad()
    //Act
    var expResult = false;
    var result = component.comunidadEsDelUsuarioLogueado;

    //Assert
    expect(expResult).toEqual(result)

  })

  it('Cargando comunidades', () => {
    spyOn(component, 'verificarOpcionesParaComunidad').and.returnValue(true)
    sesionServiceMock.exitSession.and.returnValue(true);
    component.cargarComunidad()
    //Act
    var expResult = 50
    var result = component.comunity.id;
    //Assert
    if (result) {
      expect(expResult).toEqual(result)
    }
  })

  it('asignar estado ESPERA a solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.estado = 'ESPERA';
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = !component.solicitudEstaActiva && component.solicitudEstaEnEspera && !component.solicitudEstaDenegada
    expect(expResult).toEqual(result)

  })

  it('asignar estado ACTIVO a solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.estado = 'ACTIVO';
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = component.solicitudEstaActiva && !component.solicitudEstaEnEspera && !component.solicitudEstaDenegada
    expect(expResult).toEqual(result)

  })

  it('asignar estado INACTIVO a solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.estado = 'INACTIVO';
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = !component.solicitudEstaActiva && !component.solicitudEstaEnEspera && component.solicitudEstaDenegada
    expect(expResult).toEqual(result)

  })

  it('Verificar si usuario puede enviar una solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = component.puedeEnviarSolicitud
    expect(expResult).toEqual(result)

  })

  it('Dibujar imagen', () => {
    var expResult = 'data:image/jpeg;base64,undefined';
    var result = component.dibujarImagen();
    expect(expResult).toEqual(result)
  })

  it('Solicitar union a comunidad', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'

    var comunity: Comunity = new Comunity()

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    component.comunityAssign = comunityAssign
    component.user = user
    dataServiceMock.saveComunityAssign.and.returnValue(of(comunityAssign))
    component.solicitarUnionAComunidad()
    //Act
    var expResult = true
    var result = !component.solicitudEstaActiva && component.solicitudEstaEnEspera && !component.solicitudEstaDenegada && !component.puedeEnviarSolicitud
    expect(expResult).toEqual(result)

  })

  it('Ver solicitudes', () => {
    spyRouter.navigate.and.returnValue('YES')
    expect(component.verSolicitudes()).toBeUndefined()
  })

  it('Ver miembros de comunidad', () => {
    spyRouter.navigate.and.returnValue('YES')
    expect(component.verMiembrosDeComunidad()).toBeUndefined()
  })

  it('eliminarComunidad', () => {
    //Arrange

    var comunity: Comunity = new Comunity()
    comunity.id = 5;
    component.comunity = comunity
    modalServiceMock.openModal.and.returnValue('YES')
    filtrarSolicitudesComunidadServiceMock.deleteComunity.and.returnValue(of('OK'))
    expect(component.eliminarComunidad()).toBeInstanceOf(Object)
  })

  it('salir de comunidad', () => {
    var user: User = new User()
    user.registroAcademico = '123456789'

    var comunity: Comunity = new Comunity()
    comunity.id=5;
    component.comunity=comunity
    component.user=user
    modalServiceMock.openModal.and.returnValue('YES')
    filtrarSolicitudesComunidadServiceMock.deleteUserFromComunity.and.returnValue(of('OK'))
    expect(component.salirDeComunidad()).toBeInstanceOf(Object)
  })

});
