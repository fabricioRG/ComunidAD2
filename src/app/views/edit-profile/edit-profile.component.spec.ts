import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileComponent } from './edit-profile.component';


import { ReactiveFormsModule } from '@angular/forms';

import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';
import {MatRadioModule} from '@angular/material/radio'; 
import {MatInputModule} from '@angular/material/input'; 
import { DataService } from 'src/app/data.service';
import { HttpClient } from '@angular/common/http';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { User } from 'src/app/user.model';
import { Observable, of } from 'rxjs';
import { assertPlatform } from '@angular/core';
import { FechasService } from 'src/app/services/fechas/fechas.service';
import { InicializacionUsuarioService } from 'src/app/services/inicializacion-usuario/inicializacion-usuario.service';



describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;

  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,BrowserAnimationsModule,MatDatepickerModule,MatNativeDateModule,MatRadioModule,MatInputModule],
      declarations: [ EditProfileComponent ],
      providers: [HttpClient, EditProfileComponent ],

    })
    .compileComponents();
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

   it('Obtencion de Token correctamente', () => {
    //arrange
        var dataService = TestBed.inject(DataService)
        var us =  new User();
        us.registroAcademico = '11111111'
        var lista =  of(us)
        spyOn(dataService, "getUserByToken").and.returnValue(lista);
        
    //act
        component.setDataService(dataService)
        component.obtenerUsuario()
    //assert
    expect(component.usuario.registroAcademico).toEqual('11111111');
   });

   it('Probando metodo enviar con fechas correcta, la de nacimiento menor que la actual', () => {
    //arrange
        var fechasService = TestBed.inject(FechasService)
        spyOn(component, 'realizarEnvio');         
        spyOn(fechasService, "compararFechas").and.returnValue(true);
        spyOn(component, "confirmarEnvio").and.returnValue(true);
        var us =  new User();
        us.registroAcademico = '11111111'
    //act
        component.enviar(us)
        fixture.detectChanges(); // trigger ngOnInit here
        
    //assert
        expect(component.realizarEnvio).toHaveBeenCalled(); 
   });

   it('Probando metodo enviar con fechas incorrectas, la de nacimiento mayor o igual que la actual', () => {
    //arrange
        var fechasService = TestBed.inject(FechasService)
        spyOn(component, 'realizarEnvio');         
        spyOn(fechasService, "compararFechas").and.returnValue(false);
        spyOn(component, "confirmarEnvio").and.returnValue(true);
        var us =  new User();
        us.registroAcademico = '11111111'
    //act
        component.enviar(us)
        fixture.detectChanges();
        
    //assert
        expect(component.realizarEnvio).not.toHaveBeenCalled; 
   });

   it('probando realizar envio', () => {
    //arrange
        var inicializarService = TestBed.inject(InicializacionUsuarioService)
        var us =  new User();
        us.registroAcademico = '11111111'
        spyOn(component, 'realizarEnvio');         
        spyOn(inicializarService, "asignarCamposEdicionUsuario").and.returnValue(us);
        spyOn(component, "confirmarEnvio").and.returnValue(true);
        spyOn(component, "mostrarMensaje");
        
    //act
        component.realizarEnvio(us)
        fixture.detectChanges();
        
    //assert
        expect(component.mostrarMensaje).toHaveBeenCalled; 
   });




   
});

