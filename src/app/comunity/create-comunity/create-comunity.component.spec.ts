import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { throwError } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { Course } from 'src/app/models/course.model';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

import { CreateComunityComponent } from './create-comunity.component';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { Router } from '@angular/router';


class SesionServiceMock {
  exitSession = jasmine.createSpy('sesionService.exitSession')
  getToken = jasmine.createSpy('sesionService.getToken')
  getUserWithToken = jasmine.createSpy('sesionService.getUserWithToken')
  usuarioEsAdministradorDeComunidad = jasmine.createSpy('sesionService.usuarioEsAdministradorDeComunidad')
}

class DataServiceMock {
  getCourses = jasmine.createSpy('dataService.getCourses')
  saveComunity = jasmine.createSpy('dataService.saveComunity')
  saveComunityAssign = jasmine.createSpy('dataService.saveComunityAssign')
  getUserByToken = jasmine.createSpy('dataService.getUserByToken')
}

class UploadFileServiceMock{
  upload = jasmine.createSpy('uploadFileService.upload')
}

describe('CreateComunityComponent', () => {
  let component: CreateComunityComponent;
  let sesionServiceMock: SesionServiceMock;
  let dataServiceMock: DataServiceMock;
  let uploadFileServiceMock : UploadFileServiceMock;
  const spyRouter = jasmine.createSpyObj('Router', ['navigate'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule, MatRadioModule, MatInputModule],//Los imports que necesito en la prueba
      declarations: [CreateComunityComponent],//Componentes
      providers: [HttpClient, CreateComunityComponent,
        {
          provide: DataService,
          useClass: DataServiceMock
        },
        {
          provide: SesionService,
          useClass: SesionServiceMock
        },
        {
          provide : UploadFileServiceService,
          useClass : UploadFileServiceMock
        },
        {
          provide: Router,
          useValue: spyRouter
        }
      ]//Para servicios

    })
    component = TestBed.get(CreateComunityComponent)
    sesionServiceMock = TestBed.get(SesionService)
    dataServiceMock = TestBed.get(DataService)
    uploadFileServiceMock = TestBed.get(UploadFileServiceService)
    component.ngOnInit()
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('buscar cursos encontrando cursos', () => {
    //https://stackoverflow.com/questions/40080912/angular2-testing-using-jasmine-for-subscribe-method
    //Arrange
    var cursos: any = [{ "codigoDeCurso": "0", "nombre": "SIN CURSO", "noDeSemestre": 0 }, { "codigoDeCurso": "028", "nombre": "Social Humanistica", "noDeSemestre": 1 }, { "codigoDeCurso": "119", "nombre": "Tecnica Complementaria", "noDeSemestre": 1 }, { "codigoDeCurso": "146", "nombre": "Fisica 1", "noDeSemestre": 3 }, { "codigoDeCurso": "169", "nombre": "Matematica Basica 1", "noDeSemestre": 1 }, { "codigoDeCurso": "170", "nombre": "Matematica basica 2", "noDeSemestre": 2 }, { "codigoDeCurso": "177", "nombre": "Deportes 1", "noDeSemestre": 1 }, { "codigoDeCurso": "2666", "nombre": "Orientacion y Liderazgo", "noDeSemestre": 1 }]
    sesionServiceMock.exitSession.and.returnValue(true);
    dataServiceMock.getCourses.and.returnValue(of(cursos))
    component.buscarCursos();
    //Act
    var expResult = cursos;
    var result = component.courses;
    //Assert
    expect(expResult).toEqual(result)
  })

  it('buscar cursos si exitiese error', () => {
    //Arrange
    //https://stackoverflow.com/questions/39960146/testing-error-case-with-observables-in-services
    sesionServiceMock.exitSession.and.returnValue(true);
    dataServiceMock.getCourses.and.returnValue(throwError({ status: 404 }))
    component.buscarCursos()
    //Act
    //Assert
    expect(component.courses).toBeUndefined()
  })


  it('Reset Form', () => {
    //Arrange
    component.onResetForm()
    //Act
    expect(component.comunityForm.value['nombreDeComunidad']).toBeNull()
  })


  it('Generar Comunidad', () => {
    //Act
    component.comunityForm.setValue({
      tipoDeCurso: 'tipoDeCurso',
      nombreDeComunidad: 'nombreDeComunidad',
      descripcion: 'descripcion',
      fileImage: 'fileImage'
    })
    var result: Comunity = component.generarComunidad();
    //Assert
    expect(result.nombre).toEqual('nombreDeComunidad')
  })

  it('Generar Asignacion Comunidad', () => {
    //Arrange
    var community: Comunity = new Comunity();
    var registroAcademico: any = '123456789';
    //Act
    var expResult: string = registroAcademico;
    var result: string | undefined = component.generarAsignacionDeComunidad(community, registroAcademico).idComunityAssign?.registroAcademico;
    //Assert
    if (result) {
      expect(expResult).toEqual(result)
    }
  })

  it('Guardar comunidad', () => {
    //Arrange
    var idComunidad: number = 58;
    var registroAcademico: string = '123456789';

    var user: User = new User();
    user.registroAcademico = registroAcademico;

    var com: Comunity = new Comunity();
    com.id = idComunidad;
    var comAssign: ComunityAssign = new ComunityAssign();
    comAssign.comunity = com;

    dataServiceMock.saveComunity.and.returnValue(of(com))
    sesionServiceMock.getUserWithToken.and.returnValue(registroAcademico)
    dataServiceMock.saveComunityAssign.and.returnValue(of(comAssign))
    //Act
    component.guardarComunidad(user)
    var expResult = idComunidad;
    var result = component.comunityAssign.comunity?.id;
    //Arrange
    if (result) {
      expect(expResult).toEqual(result);
    }


  })

  it('Guardar comunidad con error', () => {
    dataServiceMock.saveComunity.and.returnValue(throwError({ status: 404 }))
    component.guardarComunidad(new User())
    expect(component.comunityAssign).toBeUndefined()
  })

  it('On save form', () => {
    //Arrange
    var registroAcademico: string = '123456789';
    var user: User = new User()
    user.registroAcademico = registroAcademico;


    component.comunityForm.setValue({
      tipoDeCurso: 'tipoDeCurso',
      nombreDeComunidad: 'nombreDeComunidad',
      descripcion: 'descripcion',
      fileImage: 'fileImage'
    })
    sesionServiceMock.getUserWithToken.and.returnValue(registroAcademico)
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    spyOn(component,'guardarImagenYComunidad')
    spyOn(component,'guardarComunidad')

    component.onSaveForm()
    //Act
    var expResult = 'nombreDeComunidad';
    var result = component.comunity.nombre;
    //Arrange
    if (result) {
      expect(expResult).toEqual(result)
    }
  })


  it('On save form con error', () => {
    //Arrange
    var registroAcademico: string = '123456789';
    var user: User = new User()
    user.registroAcademico = registroAcademico;


    component.comunityForm.setValue({
      tipoDeCurso: 'tipoDeCurso',
      nombreDeComunidad: 'nombreDeComunidad',
      descripcion: 'descripcion',
      fileImage: 'fileImage'
    })
    sesionServiceMock.getUserWithToken.and.returnValue(registroAcademico)
    dataServiceMock.getUserByToken.and.returnValue(throwError({ status: 404 }))
    component.onSaveForm()

    expect(component.comunityAssign).toBeUndefined()
  })


  /*it('Cargar imagen',()=>{
    let fixture = TestBed.createComponent(CreateComunityComponent);
    let input = fixture.debugElement.query(By.css('input[type=file]')).nativeElement;
    spyOn(fixture.componentInstance,'cargarImagen')
    input.dispatchEvent(new Event('change'));
    expect(fixture.componentInstance.cargarImagen).toHaveBeenCalled();
  
    
  
  })*/
  it('Verficar Sesion True', () => {
    //Arrange
    sesionServiceMock.exitSession.and.returnValue(true)
    sesionServiceMock.usuarioEsAdministradorDeComunidad.and.returnValue(true)
    spyRouter.navigate.and.returnValue('YES')

    //Act
    var expResult = true;
    var result = component.verificarSesion();
    //Assert
    expect(expResult).toEqual(result)

  })

  it('Verficar Sesion False', () => {
    //Arrange
    sesionServiceMock.exitSession.and.returnValue(true)
    sesionServiceMock.usuarioEsAdministradorDeComunidad.and.returnValue(false)
    //Assert
    expect(component.verificarSesion()).toEqual(false)
  })

  it('Obtener formulario', () => {
    expect(component.f).toBeTruthy()
  })

  it('Guardar imagen y comunidad', () => {
    var fileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt'
      }
    ]);
    component.fileList=fileList
    var user: User = new User()
    var comunity : Comunity = new Comunity()
    comunity.foto="datosDeFoto"
    uploadFileServiceMock.upload.and.returnValue(of(comunity))
    spyOn(component,'guardarComunidad')
    component.comunity = new Comunity()
    component.guardarImagenYComunidad(user)
    //Act
    var expResult = comunity.foto;
    var result = component.comunity.foto;
    if(result){
      expect(expResult).toEqual(result)
    }
  })





  interface MockFile {
    name: string;
    body: string;
    mimeType: string;
  }

  const createFileFromMockFile = (file: MockFile): File => {
    const blob = new Blob([file.body], { type: file.mimeType }) as any;
    blob['lastModifiedDate'] = new Date();
    blob['name'] = file.name;
    return blob as File;
  };

  const createMockFileList = (files: MockFile[]) => {
    const fileList: FileList = {
      length: files.length,
      item(index: number): File {
        return fileList[index];
      }
    };
    files.forEach((file, index) => fileList[index] = createFileFromMockFile(file));

    return fileList;
  };



});
