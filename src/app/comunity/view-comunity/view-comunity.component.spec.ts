import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fn } from '@angular/compiler/src/output/output_ast';
import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, convertToParamMap, Data, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { from, Observable, of } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { VoteService } from 'src/app/services/vote/vote.service';
import { User } from 'src/app/user.model';

import { ViewComunityComponent } from './view-comunity.component';



describe('ViewComunityComponents', () => {
  let component: ViewComunityComponent;
  let fixture: ComponentFixture<ViewComunityComponent>;

  const sesionServiceMock = jasmine.createSpyObj('SesionService',
    ['exitSession', 'getToken', 'getUserWithToken', 'usuarioEsAdministradorDeComunidad'])
  const dataServiceMock = jasmine.createSpyObj('DataService',
    ['getUserByToken', 'findComunityById', 'findSuscriptionComunity', 'saveComunityAssign',
      'getAllCommunityPostByCommunity', 'getAllUsersInCommunity', 'persistCommunityPost']);
  const filtrarSolicitudesComunidadServiceMock = jasmine.createSpyObj('FiltrarSolicitudesComunidadService',
    ['deleteComunity', 'deleteUserFromComunity'])
  const modalServiceMock = jasmine.createSpyObj('ModalService',
    ['openModal'])
  const spyRouter = jasmine.createSpyObj('Router', ['navigate'])
  const uploadFileServiceServiceMock = jasmine.createSpyObj('UploadFileServiceService',
    ['uploadCommunityPostImage'])
  const voteServiceMock = jasmine.createSpyObj('VoteService',
    [''])


  beforeEach(async () => {
    console.log("BEFORE EACH EN VIEW COMUNITY COMPONENT")
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, BrowserDynamicTestingModule, ReactiveFormsModule],
      declarations: [ViewComunityComponent],
      providers: [HttpClient,ViewComunityComponent,
        {
          provide: DataService,
          useValue: dataServiceMock
        },
        {
          provide: SesionService,
          useValue: sesionServiceMock
        },
        {
          provide: FiltrarSolicitudesComunidadService,
          useValue: filtrarSolicitudesComunidadServiceMock
        },
        {
          provide : VoteService,
          useValue : voteServiceMock
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
          provide: Router,
          useValue: spyRouter
        },
        {
          provide: ModalService,
          useValue: modalServiceMock
        },
        {
          provide: UploadFileServiceService,
          useValue: uploadFileServiceServiceMock
        }

      ]
    })
    //component = TestBed.get(ViewComunityComponent)

  });

  beforeEach(() => {
    sesionServiceMock.exitSession.and.returnValue(false);
    spyRouter.navigate.and.returnValue('YES')
    fixture = TestBed.createComponent(ViewComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    console.log("My Mock", component)
    console.log("My mock", dataServiceMock)
    console.log("My mock", sesionServiceMock)
    console.log("My mock", filtrarSolicitudesComunidadServiceMock)
    expect(component).toBeTruthy();
  });

  it('Verificar opcion comunidad, La comunidad es del usuario', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'

    var comunity: Comunity = new Comunity()

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    spyOn(component, 'generarComunidad').and.stub()
    spyOn(component, 'loadImageCommunity').and.stub()
    spyOn(component, 'getAllCommunityPost').and.stub()
    spyOn(component, 'getAllUsersInCommunity').and.stub()
    sesionServiceMock.getUserWithToken.and.returnValue(user)
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    dataServiceMock.findComunityById.and.returnValue(of(comunityAssign))//
    component.verificarOpcionesParaComunidad()
    //Act
    var expResult = true;
    var result = component.comunidadEsDelUsuarioLogueado;

    //Assert
    expect(expResult).toEqual(result)

  })

  it('Verificar opcion comunidad, La comunidad no es del usuario', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'

    var user2: User = new User()
    user2.registroAcademico = '987654321'


    var comunity: Comunity = new Comunity()
    comunity.datosFoto = 'datos_foto'
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user
    component.comunity = comunity

    spyOn(component, 'generarComunidad').and.stub()
    spyOn(component, 'getAllCommunityPost').and.stub()
    spyOn(component, 'getAllUsersInCommunity').and.stub()
    sesionServiceMock.getUserWithToken.and.returnValue(user2)
    dataServiceMock.getUserByToken.and.returnValue(of(user2))
    dataServiceMock.findComunityById.and.returnValue(of(comunityAssign))//
    dataServiceMock.findSuscriptionComunity.and.returnValue(of(comunityAssign))
    component.verificarOpcionesParaComunidad()
    //Act
    var expResult = false;
    var result = component.comunidadEsDelUsuarioLogueado;

    //Assert
    expect(expResult).toEqual(result)

  })

  it('Cargando comunidades', () => {
    spyOn(component, 'verificarOpcionesParaComunidad').and.returnValue(true)
    sesionServiceMock.exitSession.and.returnValue(true);
    component.cargarComunidad()
    //Act
    var expResult = 50
    var result = component.comunity.id;
    //Assert
    if (result) {
      expect(expResult).toEqual(result)
    }
  })

  it('asignar estado ESPERA a solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.estado = 'ESPERA';
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = !component.solicitudEstaActiva && component.solicitudEstaEnEspera && !component.solicitudEstaDenegada
    expect(expResult).toEqual(result)

  })

  it('asignar estado ACTIVO a solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.estado = 'ACTIVO';
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = component.solicitudEstaActiva && !component.solicitudEstaEnEspera && !component.solicitudEstaDenegada
    expect(expResult).toEqual(result)

  })

  it('asignar estado INACTIVO a solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.estado = 'INACTIVO';
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = !component.solicitudEstaActiva && !component.solicitudEstaEnEspera && component.solicitudEstaDenegada
    expect(expResult).toEqual(result)

  })

  it('Verificar si usuario puede enviar una solicitud ', () => {
    //Arrange
    var comunityAssign: ComunityAssign = new ComunityAssign()
    component.asignarEstadoDeSolicitud(comunityAssign)
    //Act
    var expResult = true
    var result = component.puedeEnviarSolicitud
    expect(expResult).toEqual(result)

  })

  it('Dibujar imagen', () => {
    var expResult = 'data:image/jpeg;base64,undefined';
    var result = component.dibujarImagen();
    expect(expResult).toEqual(result)
  })

  it('Solicitar union a comunidad', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'

    var comunity: Comunity = new Comunity()

    var comunityAssign: ComunityAssign = new ComunityAssign()
    comunityAssign.comunity = comunity
    comunityAssign.user = user

    component.comunityAssign = comunityAssign
    component.user = user
    dataServiceMock.saveComunityAssign.and.returnValue(of(comunityAssign))
    component.solicitarUnionAComunidad()
    //Act
    var expResult = true
    var result = !component.solicitudEstaActiva && component.solicitudEstaEnEspera && !component.solicitudEstaDenegada && !component.puedeEnviarSolicitud
    expect(expResult).toEqual(result)

  })

  it('Ver solicitudes', () => {
    spyRouter.navigate.and.returnValue('YES')
    expect(component.verSolicitudes()).toBeUndefined()
  })

  it('Ver miembros de comunidad', () => {
    spyRouter.navigate.and.returnValue('YES')
    expect(component.verMiembrosDeComunidad()).toBeUndefined()
  })

  it('eliminarComunidad', () => {
    //Arrange
    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token = '1234'

    var comunity: Comunity = new Comunity()
    comunity.id = 5;
    component.comunity = comunity
    modalServiceMock.openModal.and.returnValue('YES')
    sesionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarSolicitudesComunidadServiceMock.deleteComunity.and.returnValue(of('OK'))

    expect(component.eliminarComunidad()).toBeInstanceOf(Object)
  })

  it('salir de comunidad', () => {
    var user: User = new User()
    user.registroAcademico = '123456789'
    user.token = '1234'

    var comunity: Comunity = new Comunity()
    comunity.id = 5;
    component.comunity = comunity
    component.user = user
    modalServiceMock.openModal.and.returnValue('YES')
    sesionServiceMock.getUserWithToken.and.returnValue(user)
    filtrarSolicitudesComunidadServiceMock.deleteUserFromComunity.and.returnValue(of('OK'))
    expect(component.salirDeComunidad()).toBeInstanceOf(Object)
  })

  it('datos foto,existiendo foto', () => {
    //Arrange
    var datosFoto = 'dato_de_foto';
    //Act
    var expResult = component.encabezadoFoto + datosFoto;
    var result = component.getImage(datosFoto);
    //Assert
    expect(expResult).toEqual(result)
  })




  it('loadImageCommunity sin imagen', () => {
    //Arrange
    var expResult = ''
    var result = component.styleBackgroundImageCommunity
    component.loadImageCommunity()
    //Assert
    expect(expResult).toEqual(result)
  })

  it('get all Comunity Post', () => {
    //Arrange
    var listaComunityPost: CommunityPost[] = [{ 'id': 0 }]
    dataServiceMock.getAllCommunityPostByCommunity.and.returnValue(of(listaComunityPost))
    component.getAllCommunityPost()
    //Assert
    expect(listaComunityPost).toEqual(component.communityPostList)
  })

  it('get all usesrs in community', () => {
    var listaUsersInCommunity: User[] = [{ 'registroAcademico': '12345678' }]
    dataServiceMock.getAllUsersInCommunity.and.returnValue(of(listaUsersInCommunity))
    component.getAllUsersInCommunity()
    //Assert
    expect(listaUsersInCommunity[0]['registroAcademico']).toEqual(component.usersInCommunityList[0]['registroAcademico'])
  })

  it('user name', () => {
    var user: User | undefined = new User()
    user.nombreCompleto = 'Jose Perez'

    var expResult = component.userName(user)
    //Assert 1
    if (expResult) {
      expect(user.nombreCompleto).toEqual(expResult)
    }
    //Assert 2
    user = undefined;
    expect(component.userName(user)).toBeNull()

  })

  it('Obtener formulario', () => {
    expect(component.f).toBeTruthy()
  })

  it('get formated Time', () => {
    //Arrange
    var time: string = "2021-03-20 03:09:02.710000";
    //Act
    var expResult = "20/3/2021 3:9"
    var result = component.getFormatedTime(time)
    //Assert
    expect(expResult).toEqual(result)
  })

  it('on Submit', () => {
    //Arrange
    var title: string = "El titulo"
    var mesage: string = "El mensaje"
    spyOn(component, 'saveCommunityPost').and.stub()
    component.newCommunityPost = new CommunityPost()
    component.onSubmit(title, mesage)
    //Act
    var expResult = "El titulo"
    var result = component.newCommunityPost.title
    if (result) expect(expResult).toEqual(result)
  })

  it('saveCommunityPost', () => {
    //Arrange
    spyOn(component, 'persistCommunityPost').and.stub()
    component.saveCommunityPost()
    //Act
    var result = true;
    var expResult = component.alertClosedDanger;
    //Assert
    expect(result).toEqual(expResult)

  })



  it('persist comunity post', () => {
    var fileList = createMockFileList([
      {
        body: 'test',
        mimeType: 'text/plain',
        name: 'test.txt'
      }
    ]);
    var comunityPost: CommunityPost = new CommunityPost()
    comunityPost.photo = 'la foto'
    component.fileList = fileList
    component.newCommunityPost = new CommunityPost()
    spyOn(component, 'uploadCommunityPost').and.stub()
    uploadFileServiceServiceMock.uploadCommunityPostImage.and.returnValue(of(comunityPost))
    component.persistCommunityPost()
    //Act
    var expResult = 'la foto'
    var result = component.newCommunityPost.photo
    //Assert
    if (result) {
      expect(expResult).toEqual(result)
    }

  })

  it('restoreForm', () => {
    spyOn(component, 'quitarFoto').and.stub
    expect(component.restoreForm()).toBeUndefined()

  })

  it('uploadCommunityPost', () => {
    var comunityPost: CommunityPost = new CommunityPost()
    comunityPost.photo = 'la foto'
    spyOn(component, 'restoreForm').and.stub()
    spyOn(component, 'getAllCommunityPost').and.stub()
    dataServiceMock.persistCommunityPost.and.returnValue(of(comunityPost))
    component.uploadCommunityPost()
    //Act
    var expResult = true;
    var result = component.alertClosedSuccess;
    //Assert
    expect(expResult).toEqual(result)

  })

  it('quitar foto', () => {
    component.quitarFoto()
    expect(component.fileList).toBeNull

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
