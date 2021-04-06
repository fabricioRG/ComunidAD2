import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponentDefinitionMap } from '@angular/compiler/src/render3/partial/component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, convertToParamMap, Data } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';
import { InicioComponent } from 'src/app/views/inicio/inicio.component';

import { UnsuscribeMembersComponent } from './unsuscribe-members.component';

class MockNgbModalRef{
  componentInstance = {
    prompt: undefined,
    title: undefined
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('UnsuscribeMembersComponent', () => {


  let component: UnsuscribeMembersComponent;
  let fixture: ComponentFixture<UnsuscribeMembersComponent>;
  let modalService : NgbModal;
  let modalRef : MockNgbModalRef= new MockNgbModalRef();

  const sessionServiceMock = jasmine.createSpyObj('SesionService',
    ['exitSession', 'getUserWithToken'])
  const dataServiceMock = jasmine.createSpyObj('DataService',
    ['getUserByToken', 'findComunityById'])
  const filtrarAsignacionesComunidadMock = jasmine.createSpyObj('FiltrarSolicitudesComunidadService',
    ['getMiembrosActivosDeComunidad','removeUserFromComunity'])


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserDynamicTestingModule, RouterTestingModule.withRoutes([
        { path: 'inicio', component: InicioComponent }])],
      declarations: [UnsuscribeMembersComponent],
      providers: [NgbModal,NgbModule,ModalService,UnsuscribeMembersComponent,
        {
          provide: SesionService,
          useValue: sessionServiceMock
        },
        {
          provide: DataService,
          useValue: dataServiceMock
        },
        {
          provide : FiltrarSolicitudesComunidadService,
          useValue : filtrarAsignacionesComunidadMock
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
          provide : NgbModalRef,
          useClass : MockNgbModalRef
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    modalService = TestBed.get(NgbModal)
    sessionServiceMock.exitSession.and.returnValue(false)
    fixture = TestBed.createComponent(UnsuscribeMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cargar datos', () => {
    spyOn(component, 'verificarSiComunidadEsDelUsuarioLogueado').and.stub()
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

  it('Obtener formulario', () => {
    component.filtroForm.setValue({
      registroAcademico: 'registro',
    })
    expect(component.f).toBeTruthy()
  })

  it('verificarSiComunidadEsDelUsuarioLogueado', () => {
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
    component.verificarSiComunidadEsDelUsuarioLogueado()
    //Act
    var expResult = true
    var result = component.comunidadEsDelUsuarioLogueado

    //Assert
    if (result) {
      expect(expResult).toEqual(result)
    }

  })

  it('verificarSiComunidadEsDelUsuarioLogueado, no es su comunidad', () => {
    var user: User = new User()
    user.registroAcademico = '123456789'
    var user2: User = new User()
    user2.registroAcademico = 'abc'


    var comunity: Comunity = new Comunity()
    comunity.id = 50
    component.comunity = comunity

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user


    sessionServiceMock.getUserWithToken.and.returnValue(user)
    dataServiceMock.getUserByToken.and.returnValue(of(user2))
    dataServiceMock.findComunityById.and.returnValue(of(comunityAssign))
    component.verificarSiComunidadEsDelUsuarioLogueado()
    //Act
    //Assert
    expect(false).toEqual(component.comunidadEsDelUsuarioLogueado)
    

  })




  it('buscar por filtros, cuando  existe registro academico', () => {
    component.filtroForm.setValue({
      registroAcademico: '12345678',
    })
    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token='abc'
    var listaUsuarios : ComunityAssign[]=[{}]

    sessionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarAsignacionesComunidadMock.getMiembrosActivosDeComunidad.and.returnValue(of(listaUsuarios))
    component.buscarPorFiltros()
    //Act
    var expResult = listaUsuarios
    var result = component.comunityAssignList 
    //Assert
    expect(expResult).toEqual(result)
  })

  it('buscar por filtros, no existe registro academico', () => {
    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token='abc'
    var listaUsuarios : ComunityAssign[]=[{}]

    sessionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarAsignacionesComunidadMock.getMiembrosActivosDeComunidad.and.returnValue(of(listaUsuarios))
    component.buscarPorFiltros()
    //Act
    var expResult = listaUsuarios
    var result = component.comunityAssignList 
    //Assert
    expect(expResult).toEqual(result)
  })

  it('mostrarMensaje',()=>{
    expect(component.mostrarMensaje('Header','Tittle','Mensaje')).toBeTruthy   
  })

  it('eliminar usuario',()=>{
    //https://stackoverflow.com/questions/59524515/writing-a-unit-test-for-ng-bootstrap-modal-ngbmodal-angular-6
    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token='abc'
    var listaUsuarios : ComunityAssign[]=[{}]

    var comunity: Comunity = new Comunity()
    comunity.id = 50
    component.comunity = comunity

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    var spy =spyOn(modalService,"open").and.returnValue(modalRef as any)
    spyOn(component,'buscarPorFiltros').and.stub()
    sessionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarAsignacionesComunidadMock.removeUserFromComunity.and.returnValue(of(listaUsuarios))
    component.eliminarUsuario(comunityAssign)
    //Assert
    expect(spy).toHaveBeenCalled();

  })

});
