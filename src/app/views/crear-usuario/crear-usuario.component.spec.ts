import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CrearUsuarioComponent } from './crear-usuario.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { DepartamentoService } from 'src/app/services/departamento/departamento.service';
import { DepartamentoServiceMock } from 'src/app/Test/DepartmentServiceMock/department-service-mock';
import { DataService } from 'src/app/data.service';
import { Data, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HeadersService } from 'src/app/services/headers/headers.service';
import values from 'src/app/Test/ArchivosJson/User2.json';

describe('CrearUsuarioComponent', () => {
  let component: CrearUsuarioComponent;
  let fixture: ComponentFixture<CrearUsuarioComponent>;
  let departmentService: DepartamentoService;
  let dataService: DataService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearUsuarioComponent],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        MatInputModule,
      ], //,
      providers: [
        // {
        //   provide: DepartamentoService,
        //   useClass: DepartamentoServiceMock,
        // },
        {
          provide: Router,
          useValue: mockRouter,
        },
        HeadersService,
        HttpClient,
      ],
    }).compileComponents();
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    departmentService = new DepartamentoService(TestBed.inject(HttpClient));
    component = new CrearUsuarioComponent(
      TestBed.inject(FormBuilder),
      dataService,
      TestBed.inject(Router),
      departmentService
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearUsuarioComponent);
    //component = fixture.componentInstance;
    departmentService = new DepartamentoService(TestBed.inject(HttpClient));
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    component = new CrearUsuarioComponent(
      TestBed.inject(FormBuilder),
      dataService,
      TestBed.inject(Router),
      departmentService
    );
    fixture.detectChanges();
  });

  it(' should get departments', () => {
    //arrange
    var expected = [
      {
        id: '1',
        nombre: 'Xela',
      },
    ];
    var spy = spyOn(departmentService, 'getDepartamentos').and.returnValue(
      of(expected)
    );
    //spyOn(,)

    //act
    component.buscarCursos();

    //assert
    expect(component.courses).toEqual(expected);
  });

  it('fechas iguales', () => {
    //arrange
    var fecha1 = '2000-01-01';
    var fecha2 = '2000-01-01';
    //act
    var resultado = component.compararFechas(fecha1, fecha2);
    //assert
    expect(resultado).toBeFalsy();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  it('fechas iguales', () => {
    //arrange
    var fecha1 = '2000-01-01';
    var fecha2 = '2000-01-01';
    //act
    var resultado = component.compararFechas(fecha1, fecha2);
    //assert
    expect(resultado).toBeFalsy();
  });

  it('fechas distintas', () => {
    //arrange
    var fecha1 = '2000-01-01';
    var fecha2 = '2000-02-01';
    //act
    var resultado = component.compararFechas(fecha1, fecha2);
    //assert
    expect(resultado).toBeTruthy();
  });
  it('agregarMensaje', () => {
    //arrange
    var error = 'Mensaje error';
    var contador = 1;
    var mensajes = '';
    var expect1 = '1.-Mensaje error';
    //act
    var resultado = component.agregarMensajeError(contador, mensajes, error);
    //assert
    expect(resultado).toEqual(expect1);
  });

  it('convertir fecha test', () => {
    //arrange
    var fecha = new Date('2021-01-01');
    fecha.setTime(fecha.getTime() + 21600000);
    var fechaEsperada = '2021-01-01'; // esto esta asi porque el sistema le resta 6 horas

    //act
    var fechaFormateada = component.convertirFecha(fecha);
    //assert
    expect(fechaFormateada).toEqual(fechaEsperada);
  });
  it('convertir fecha test', () => {
    //arrange
    var fecha = new Date('2021-05-05');
    fecha.setTime(fecha.getTime() + 21600000);
    var fechaEsperada = '2021-05-05'; // esto esta asi porque el sistema le resta 6 horas

    //act
    var fechaFormateada = component.convertirFecha(fecha);
    //assert
    expect(fechaFormateada).toEqual(fechaEsperada);
  });

  it('enviarContrasenasDistintasYFechasIguales', () => {
    //arrange

    var values: any = {
      contrasena: 'ab',
      repetirContrasena: 'abc',
      fechaNacimiento: new Date(),
      nombreCompleto: 'Juanito',
    };
    var spy = spyOn(component, 'agregarMensajeError').and.stub();
    var spy2 = spyOn(dataService, 'addNewUser');

    //act

    var fechaFormateada = component.enviar(values);
    //assert\
    expect(spy2).not.toHaveBeenCalled();
  });
  it('enviarCorrectamente', () => {
    //arrange

    values.fechaNacimiento = new Date('2011-01-01');
    var spy = spyOn(component, 'agregarMensajeError').and.stub();
    spyOn(component, 'compararFechas').and.returnValue(true);
    //var spy4 = spyOn(component, 'convertirFecha').and.returnValue('2011-01-01');
    var spy3 = spyOn(dataService, 'addNewUser').and.returnValues(of('data'));

    //act

    component.enviar(values);
    //expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
    //assert\
    expect(spy3).toHaveBeenCalled();
  });
});
