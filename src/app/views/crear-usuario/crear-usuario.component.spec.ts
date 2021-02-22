import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { CrearUsuarioComponent } from './crear-usuario.component';

describe('CrearUsuarioComponent', () => {
  let component: CrearUsuarioComponent;
  let fixture: ComponentFixture<CrearUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearUsuarioComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fechas iguales', () => {
    //arrange
    var fecha1 = '2000-01-01'
    var fecha2 = '2000-01-01'
    //act
    var resultado = component.compararFechas(fecha1,fecha2)
    //assert
    expect(resultado).toBeFalsy();
    
  });

  it('fechas distintas', () => {
    //arrange
    var fecha1 = '2000-01-01'
    var fecha2 = '2000-02-01'
    //act
    var resultado = component.compararFechas(fecha1,fecha2)
    //assert
    expect(resultado).toBeTruthy();
  });
  it('agregarMensaje', () => {
    //arrange
    var error = 'Mensaje error'
    var contador = 1;
    var mensajes = ''
    var expect1 = '1.-Mensaje error'
    //act
    var resultado = component.agregarMensajeError(contador,mensajes,error);
    //assert
    expect(resultado).toEqual(expect1)

  });

  
});
