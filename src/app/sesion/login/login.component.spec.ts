import { HttpClientTestingModule } from '@angular/common/http/testing';
import { stringify } from '@angular/compiler/src/util';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'src/app/user.model';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [HttpClientTestingModule,ReactiveFormsModule,RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Verificar borrado en Formulario', () => {
    //Arrange
    var resultado=component.loginForm.value["registroAcademico"]="Jose Perez";
    //Act
    component.onResetForm();
    resultado=component.loginForm.value["registroAcademico"];
    //Assert
    console.log("Resultado:"+resultado);
    //resultado="ASDFASDF";
    expect(resultado).toBeNull();
  });

  
  it('Verificar creacion de Formulario', () => {
    //Arrange
    var form=null;
    //Act
    form=component.createFormGroup();
    //Assert
    expect(form).toBeInstanceOf(FormGroup);
  });
});
