import { HttpClientTestingModule } from '@angular/common/http/testing';
import { stringify } from '@angular/compiler/src/util';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';
import { InicioComponent } from 'src/app/views/inicio/inicio.component';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let logger$ = new Subject<boolean>(); //Va a emitir un evento

  let sesionServiceMock = jasmine.createSpyObj('SesionService',
    ['logIn','loggedIn$', 'log0ut', 'exitSession', 'usuarioEsSuscriptor', 'usuarioEsAdministradorDeSistema', 'usuarioEsAdministradorDeComunidad'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'inicio', component: InicioComponent, },])],
      declarations: [LoginComponent],
      providers: [LoginComponent,
        {
          provide: SesionService,
          useValue: sesionServiceMock
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    sesionServiceMock.loggedIn$.and.returnValue(logger$.asObservable())
    logger$.next(true)
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Verificar borrado en Formulario', () => {
    //Arrange
    var resultado = component.loginForm.value["registroAcademico"] = "Jose Perez";
    //Act
    component.onResetForm();
    resultado = component.loginForm.value["registroAcademico"];
    //Assert
    console.log("Resultado:" + resultado);
    //resultado="ASDFASDF";
    expect(resultado).toBeNull();
  });

  it('On save form',()=>{
    component.loginForm.setValue({
      registroAcademico: '12345678',
      password: 'abcd',
    })
    expect(component.onSaveForm()).toBeTruthy
  })


  it('Verificar creacion de Formulario', () => {
    //Arrange
    var form = null;
    //Act
    form = component.createFormGroup();
    //Assert
    expect(form).toBeInstanceOf(FormGroup);
  });
});
