import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/user.model';

import { CreateComunityComponent } from './create-comunity.component';

describe('CreateComunityComponent', () => {
  let component: CreateComunityComponent;
  let fixture: ComponentFixture<CreateComunityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,BrowserAnimationsModule,MatDatepickerModule,MatNativeDateModule,MatRadioModule,MatInputModule ],
      declarations : [CreateComunityComponent],
      providers : [HttpClient,CreateComunityComponent]

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Probando recuperacion de cursos', ()=>{
    //arrange
    var dataService = TestBed.inject(DataService)

    var course : any =[
    {
      codigoCurso:'001',
      noDeSemestre: 1,
      nombre: 'Matematica Aplciacada 1' 
    },
    {
      codigoCurso:'002',
      noDeSemestre: 1,
      nombre: 'Programacion' 
    }
    ];
    dataService.trueLoggedIn()//Se inicia la sesion
    var list = of(course)
    spyOn(dataService,"getCourses").and.returnValue(list);
    //act
    component.setDataService(dataService)
    component.buscarCursos()
  //assert
    //console.log("LISTAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa:",component.courses)
    expect(component.courses[0]['codigoCurso']).toEqual('001');

  })

   
});
