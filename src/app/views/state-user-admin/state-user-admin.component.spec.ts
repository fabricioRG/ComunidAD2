import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/data.service';
import { FiltrarUsuariosService } from 'src/app/services/filtrar-usuarios/filtrar-usuarios.service';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { ModalService } from 'src/app/services/modal/modal.service';

import { StateUserAdminComponent } from './state-user-admin.component';
import datosUsers from 'src/app/Test/ArchivosJson/Users.json';
import { of, throwError } from 'rxjs';
describe('StateUserAdminComponent', () => {
  let component: StateUserAdminComponent;
  let fixture: ComponentFixture<StateUserAdminComponent>;
  let dataService: DataService;
  let modal: ModalService;
  let filtrarUsuarios: FiltrarUsuariosService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StateUserAdminComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        HeadersService,
        HttpClient,
        DataService,
        DecimalPipe,
        FormBuilder,
        NgbModal,
        ModalService,
        FiltrarUsuariosService,
      ],
    }).compileComponents();
    spyOn(localStorage.__proto__, 'getItem').and.returnValue('true');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateUserAdminComponent);
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    modal = new ModalService(TestBed.inject(NgbModal));
    filtrarUsuarios = new FiltrarUsuariosService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    component = new StateUserAdminComponent(
      TestBed.inject(FormBuilder),
      filtrarUsuarios,
      dataService,
      TestBed.inject(NgbModal),
      modal
    );
    //component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('filtrar Usuarios', () => {
    var spy = spyOn(filtrarUsuarios, 'getUsuarios').and.returnValue(
      of(datosUsers)
    );
    component.filtrarUsuarios(datosUsers);
    expect(component.usrs).toBe(datosUsers);
  });

  it('cambiarEstadoUsuarioAllCorrect', async () => {
    var spy1 = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    var spy2 = spyOn(dataService, 'updateAnyUser').and.returnValue(
      of('Promise.resolve(true)')
    );
    var spy3 = spyOn(component, 'mostrarMensaje').and.stub();
    component.token = 'true';
    await component.cambiarEstadoUsuario(datosUsers, '');
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });
  it('cambiarEstadoUsuarioDataServiceBad', async () => {
    var spy1 = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    var spy2 = spyOn(dataService, 'updateAnyUser').and.returnValue(
      throwError('2')
    );
    var spy3 = spyOn(component, 'mostrarError').and.stub();
    component.token = 'true';
    await component.cambiarEstadoUsuario(datosUsers, '');
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  });
  it('mostrarError', async () => {
    var spy1 = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    await component.mostrarError('a', 1);
    expect(spy1).toHaveBeenCalled();
  });

  it('mostrarMensaje', async () => {
    var spy1 = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    await component.mostrarMensaje('a');
    expect(spy1).toHaveBeenCalled();
  });
});
