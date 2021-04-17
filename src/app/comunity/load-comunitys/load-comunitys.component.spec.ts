import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { User } from 'src/app/user.model';

import { LoadComunitysComponent } from './load-comunitys.component';


describe('LoadComunityComponent', () => {
  let component: LoadComunitysComponent;
  let fixture: ComponentFixture<LoadComunitysComponent>;
  const sesionServiceMock = jasmine.createSpyObj('SesionService', ['getUserWithToken', 'exitSession','usuarioEsAdministradorDeComunidad']);
  const dataServiceMock = jasmine.createSpyObj('DataService', ['getUserByToken', 'findComunytyByRegistroAcademico']);
  const spyRouter = jasmine.createSpyObj('Router', ['navigate'])

  beforeEach(async () => {

    console.log("BEFORE EACH EN VIEW COMUNITY COMPONENT")
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, BrowserDynamicTestingModule],
      declarations: [LoadComunitysComponent],
      providers: [HttpClient, LoadComunitysComponent,
        {
          provide: DataService,
          useValue: dataServiceMock
        },
        {
          provide: SesionService,
          useValue: sesionServiceMock
        },
        {
          provide: Router,
          useValue: spyRouter
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    var user: User = new User()
    var comunidades: ComunityAssign[] = [{}]
    ///pending('getUserByToken')
    //pending('findComunytyByRegistroAcademico')
    //El problema de que subscribe era indefinido se arreglo asignandole un valor a los mocks que se usaban en el constructor, especificamente a los que usaban un subscribe
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    dataServiceMock.findComunytyByRegistroAcademico.and.returnValue(of(comunidades))
    fixture = TestBed.createComponent(LoadComunitysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log("My Mock", component)
    console.log("My mock", dataServiceMock)
    console.log("My mock", sesionServiceMock)
    if (dataServiceMock) {
      console.log("DATA SERVICE MOCK NO ES NULO EN VIEW COMUNITY")
    }
    expect(component).toBeTruthy();
  });

  it('cargarComunidades', () => {
    //Arrange
    var token: String = '12345678';
    var user: User = new User();
    var comunidades: ComunityAssign[] = [{ "idComunityAssign": { "registroAcademico": "555555555", "idComunidad": 42 } }]

    sesionServiceMock.getUserWithToken.and.returnValue(user)
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    dataServiceMock.findComunytyByRegistroAcademico.and.returnValue(of(comunidades))

    component.cargarComunidades()
    //Act
    var expResult = comunidades;
    var result = component.comunidades;
    //Assert
    expect(expResult).toEqual(result)

  })

  it('verificarSesionUsuarioComunidad',()=>{
    sesionServiceMock.exitSession.and.returnValue(true)
    sesionServiceMock.usuarioEsAdministradorDeComunidad.and.returnValue(true)
    var expResult =true;
    var result = component.verificarSesionUsuarioComunidad();
    expect(expResult).toEqual(result)
  })

  it('datos foto,existiendo foto',()=>{
    //Arrange
    var datosFoto ='dato_de_foto';
    //Act
    var expResult = component.encabezadoFoto+datosFoto;
    var result = component.getImage(datosFoto);
    //Assert
    expect(expResult).toEqual(result)
  })


  it('datos foto,sin existir foto',()=>{
    //Arrange
    var datosFoto =null;
    //Act
    var expResult = component.encabezadoFoto+datosFoto;
    var result = component.getImage(datosFoto);
    //Assert
    expect(expResult).toEqual(result)
  })

  it('Ver comunidad',()=>{
    //Arrange
    var id: number =5;
    spyRouter.navigate.and.returnValue('YES')
    //Act
    component.verComunidad(id)
    //Arrange
    expect(component.verComunidad(id)).toBeUndefined()
  })
});
