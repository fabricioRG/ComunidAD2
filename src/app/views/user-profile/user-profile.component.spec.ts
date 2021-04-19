import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  Data,
  Router,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { HeadersService } from 'src/app/services/headers/headers.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';

import { UserProfileComponent } from './user-profile.component';
import dataUser from 'src/app/Test/ArchivosJson/User3.json';
import user from 'src/app/Test/ArchivosJson/User3.json';
import arregloUsers from 'src/app/Test/ArchivosJson/Users.json';
import arregloComunities from 'src/app/Test/ArchivosJson/ArregloComunitys.json';
import curso from 'src/app/Test/ArchivosJson/course.json';
import arregloAsigns from 'src/app/Test/ArchivosJson/AsignacionesComunidad.json';
import arregloPosts from 'src/app/Test/ArchivosJson/comunityPosts.json';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { ModalService } from 'src/app/services/modal/modal.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { User } from 'src/app/user.model';
import datosUsers from 'src/app/Test/ArchivosJson/Users.json';

const encabezadoFoto = "url(data:image/jpeg;base64,";
const finalFoto = ")"
const defaultPicture = "url('https://bootdey.com/img/Content/avatar/avatar7.png')";
const activeState = ConstantesService.ESTADO_USUARIO_ACTIVO;
const inactiveState = ConstantesService.ESTADO_USUARIO_INACTIVO;
const publicPrivacy = ConstantesService.USER_PRIVACY_PUBLICO;
const privatePrivacy = ConstantesService.USER_PRIVACY_PRIVADO;

export class MockNgbModalRef {
  componentInstance = {
      Prompt: undefined,
      title: undefined,
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let dataService: DataService;
  let sesionService: SesionService;
  let modalService: NgbModal;
  let modal: ModalService;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();
  let uploadFileService: UploadFileServiceService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };
  const getFileList = () => {
    const dt = new DataTransfer();
    dt.items.add(new File([], 'file.csv'));
    return dt.files;
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserProfileComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgbModule], //,
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '50' }),
            },
            paramMap: {
              subscribe: (fn: (value: Data) => void) => fn({}),
            },
          },
        },
        DataService,
        HeadersService,
        HttpClient,
        SesionService,
        NgbModal,
        ModalService,
        UploadFileServiceService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProfileComponent);
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    uploadFileService = new UploadFileServiceService(TestBed.inject(HttpClient));
    sesionService = new SesionService(TestBed.inject(HttpClient), dataService);
    modal = new ModalService(TestBed.inject(NgbModal));
    modalService = TestBed.inject(NgbModal);
    component = new UserProfileComponent(
      TestBed.inject(Router),
      TestBed.inject(ActivatedRoute),
      dataService,
      sesionService,
      modal,
      modalService,
      TestBed.inject(UploadFileServiceService)
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    // spyOn(component,'loadUser').and.stub();
    expect(component).toBeTruthy();
  });
  it('load userCorrect', () => {
    var spy1 = spyOn(sesionService, 'exitSession').and.returnValue(true);
    var spy2 = spyOn(component, 'getUserInfo').and.stub();
    component.loadUser();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('load userCorrect', () => {
    var spy1 = spyOn(sesionService, 'exitSession').and.returnValue(false);
    component.loadUser();
    expect(spy1).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
  });

  it('getUserInfo', () => {
    var spy1 = spyOn(dataService, 'getUserByToken').and.returnValue(
      of(dataUser)
    );
    var spy2 = spyOn(dataService, 'findUserById').and.returnValue(of(dataUser));

    component.getUserInfo();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.actualUser).toBe(dataUser);
  });
  it('getUserInfoBad', () => {
    var spy1 = spyOn(dataService, 'getUserByToken').and.returnValue(
      of(dataUser)
    );
    var spy2 = spyOn(dataService, 'findUserById').and.returnValue(
      throwError('a')
    );

    component.getUserInfo();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
  });
  it('getComunitysWithLenght>0', () => {
    component.actualUser = user;
    var spy1 = spyOn(dataService, 'findUserComunitys').and.returnValue(
      of(arregloAsigns)
    );

    component.getCommunitys();
    expect(spy1).toHaveBeenCalled();
    expect(component.usuarioTieneComunidades).toBeTruthy();
  });
  it('getComunitysWithLenght=0', () => {
    component.actualUser = user;

    var spy1 = spyOn(dataService, 'findUserComunitys').and.returnValue(of([]));

    component.getCommunitys();
    expect(spy1).toHaveBeenCalled();
    expect(component.usuarioTieneComunidades).toBeFalsy();
  });
  it('getComunitysWithLenghtWhenError', () => {
    component.actualUser = user;

    var spy1 = spyOn(dataService, 'findUserComunitys').and.returnValue(
      throwError('a')
    );
    var spy2 = spyOn(console, 'log');
    component.getCommunitys();
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('verComunidadWithId', () => {
    var comunidad = 1;
    component.verComunidad(comunidad);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      'viewComunity',
      comunidad,
    ]);
  });
  it('verComunidadWithoutId', () => {
    var comunidad = undefined;
    var spy2 = spyOn(console, 'log');
    component.verComunidad(comunidad);
    expect(mockRouter.navigate).not.toHaveBeenCalledWith([
      'viewComunity',
      comunidad,
    ]);
    expect(spy2).toHaveBeenCalled();
  });

  it('getImage', () => {
    var datos = 'aaa';
    var encabezado = 'b';
    component.encabezadoFoto = encabezado;
    var result = component.getImage(datos);
    expect(result).toEqual(encabezado + datos);
  });
  it('getImage', () => {
    var datos = null;
    var encabezado = 'b';
    component.encabezadoFoto = encabezado;
    var result = component.getImage(datos);
    expect(result).toEqual(encabezado + datos);
  });

  it('loadImageProfileWithData', () => {
    let photo = 'photo';
    let finalPhoto = encabezadoFoto + photo + finalFoto;
    component.actualUser = { datosFoto: photo };
    component.loadImageProfile();
    expect(component.styleBackgroundImage).toBe(finalPhoto);
  });

  it('loadImageProfileWithoutData', () => {
    component.actualUser = { registroAcademico: '234243' }
    component.loadImageProfile();
    expect(component.styleBackgroundImage).toBe(defaultPicture);
  });

  it('obtenerEstadoStringActiveState', () => {
    let paramBoolean = true;
    component.banderaEstadoActivo = paramBoolean;
    let result = component.obtenerEstadoString();
    expect(result).toBe(ConstantesService.ESTADO_USUARIO_INACTIVO);
    expect(component.banderaEstadoActivo).toBe(!paramBoolean);
  });

  it('obtenerEstadoStringInactiveState', () => {
    let paramBoolean = false;
    component.banderaEstadoActivo = paramBoolean;
    let result = component.obtenerEstadoString();
    expect(result).toBe(ConstantesService.ESTADO_USUARIO_ACTIVO);
    expect(component.banderaEstadoActivo).toBe(!paramBoolean);
  });

  it('revertirEstadoActiveState', () => {
    let paramBoolean = true;
    component.banderaEstadoActivo = paramBoolean;
    let result = component.revertirEstado();
    expect(result).toBe(ConstantesService.ESTADO_USUARIO_ACTIVO);
    expect(component.banderaEstadoActivo).toBe(!paramBoolean);
  });

  it('revertirEstadoInactiveState', () => {
    let paramBoolean = false;
    component.banderaEstadoActivo = paramBoolean;
    let result = component.revertirEstado();
    expect(result).toBe(ConstantesService.ESTADO_USUARIO_INACTIVO);
    expect(component.banderaEstadoActivo).toBe(!paramBoolean);
  });

  // it('onSelectFile', () => {
  //   let fls = { 0: {name:'foo', size: 500001} };
  //   let spy = spyOn(component, 'updateProfileUserImage').and.stub();
  //   component.onSelectFile(fls);
  //   expect(spy).toHaveBeenCalled();
  // });

  // it('updateProfileUserImage', () => {
  //   let usr: User = {
  //     registroAcademico: '2354539'
  //   }
  //   const blob = new Blob([""], { type: "text/html" });
  //   const file = <File>blob;
  //   const fileList = {
  //     0: file,
  //     1: file,
  //     length: 2,
  //     item: (index: number) => file
  //   };
  //   let spy = spyOn(uploadFileService, 'uploadProfileUserImage').
  //     and.returnValue(of(datosUsers));
  //   component.updateProfileUserImage(usr, fileList);
  //   expect(spy).toHaveBeenCalled();
  // });

  it('cambiarEstado', () => {
    component.profileOwner = true;
    let spy = spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.cambiarEstado();
    expect(spy).toHaveBeenCalled();
  });

  it('mostrarError', () => {
    let spy = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    component.mostrarError('error', 2);
    expect(spy).toHaveBeenCalled();
  });

  it('mostrarMensaje', () => {
    let spy = spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    component.mostrarMensaje('error');
    expect(spy).toHaveBeenCalled();
  });

  it('changeUserPrivacy', async () => {
    component.profileOwner = true;
    component.user = {
      privacidad: ConstantesService.USER_PRIVACY_PUBLICO
    }
    let spy = await spyOn(component, 'showConfirmMessage').and.returnValue(Promise.resolve(true));
    component.changeUserPrivacy();
    expect(spy).toHaveBeenCalled();
  });

  it('goToEditProfile', () => {
    component.goToEditProfile();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['editProfile']);
  });

  it('userStateTextActiveUser', () => {
    let expResult = activeState;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.estado = activeState;
    let result = component.userStateText;
    expect(result).toEqual(expResult);
  });

  it('userStateTextInactiveUser', () => {
    let expResult = inactiveState;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.estado = inactiveState;
    let result = component.userStateText;
    expect(result).toEqual(expResult);
  });

  it('userStateIconActiveUser', () => {
    let expResult = ConstantesService.ICON_CHECK_CIRCLE_OUTLINE;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.estado = activeState;
    let result = component.userStateIcon;
    expect(result).toEqual(expResult);
  });

  it('userStateIconInactiveUser', () => {
    let expResult = ConstantesService.ICON_CANCEL;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.estado = inactiveState;
    let result = component.userStateIcon;
    expect(result).toEqual(expResult);
  });

  it('userPrivacyTextActiveUser', () => {
    let expResult = publicPrivacy;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.privacidad = publicPrivacy;
    let result = component.userPrivacyText;
    expect(result).toEqual(expResult);
  });

  it('userPrivacyTextInactiveUser', () => {
    let expResult = privatePrivacy;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.privacidad = privatePrivacy;
    let result = component.userPrivacyText;
    expect(result).toEqual(expResult);
  });

  it('userPrivacyIconActiveUser', () => {
    let expResult = ConstantesService.ICON_PUBLIC;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.privacidad = publicPrivacy;
    let result = component.userPrivacyIcon;
    expect(result).toEqual(expResult);
  });

  it('userPrivacyIconInactiveUser', () => {
    let expResult = ConstantesService.ICON_LOCK;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.privacidad = privatePrivacy;
    let result = component.userPrivacyIcon;
    expect(result).toEqual(expResult);
  });

  it('userGenderTextGenderM', () => {
    let expResult = ConstantesService.USER_GENDER_MASCULINO;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.genero = ConstantesService.USER_GENDER_M;
    let result = component.userGenderText;
    expect(result).toEqual(expResult);
  });

  it('userGenderTextGenderF', () => {
    let expResult = ConstantesService.USER_GENDER_FEMENINO;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.genero = ConstantesService.USER_GENDER_F;
    let result = component.userGenderText;
    expect(result).toEqual(expResult);
  });

  it('userGenderTextGenderN', () => {
    let expResult = ConstantesService.USER_GENDER_SIN_ESPECIFICAR;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.genero = ConstantesService.USER_GENDER_N;
    let result = component.userGenderText;
    expect(result).toEqual(expResult);
  });

  it('userGenderIconGenderM', () => {
    let expResult = ConstantesService.ICON_MALE;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.genero = ConstantesService.USER_GENDER_M;
    let result = component.userGenderIcon;
    expect(result).toEqual(expResult);
  });

  it('userGenderIconGenderF', () => {
    let expResult = ConstantesService.ICON_FEMALE;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.genero = ConstantesService.USER_GENDER_F;
    let result = component.userGenderIcon;
    expect(result).toEqual(expResult);
  });

  it('userGenderIconGenderN', () => {
    let expResult = ConstantesService.ICON_HELP;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.genero = ConstantesService.USER_GENDER_N;
    let result = component.userGenderIcon;
    expect(result).toEqual(expResult);
  });

  it('userRolIconRolSuper', () => {
    let expResult = ConstantesService.ICON_ADMIN_PANEL_SETTINGS;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.rolUsuario = ConstantesService.USER_ROL_SUPER;
    let result = component.userRolIcon;
    expect(result).toEqual(expResult);
  });

  it('userRolIconRolComunidad', () => {
    let expResult = ConstantesService.ICON_MANAGE_ACCOUNTS;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.rolUsuario = ConstantesService.USER_ROL_COMUNIDAD;
    let result = component.userRolIcon;
    expect(result).toEqual(expResult);
  });

  it('userRolIconRolNormal', () => {
    let expResult = ConstantesService.ICON_GROUPS;
    component.actualUser = { registroAcademico: '243345'}
    component.actualUser.rolUsuario = ConstantesService.USER_ROL_NORMAL;
    let result = component.userRolIcon;
    expect(result).toEqual(expResult);
  });

  it('userRolIconUnknowRol', () => {
    let expResult = ConstantesService.ICON_HELP;
    component.actualUser = { registroAcademico: '243345'}
    let result = component.userRolIcon;
    expect(result).toEqual(expResult);
  });

  it('getFormatedTime', () => {
    let expResult = '24/12/2018';
    let d = new Date(2018, 11, 24, 10, 33, 30);
    let resutl = component.getFormatedTime(d.toString());
    expect(resutl).toEqual(expResult);
  });

  it('showConfirmMessage', async () => {
    let spy = await spyOn(modal, 'openModal').and.returnValue(Promise.resolve(true));
    component.showConfirmMessage('','','', false);
    expect(spy).toHaveBeenCalled();
  });

  it('llamarModal', async () => {
    let spy = spyOn(modalService, 'open').and.returnValue(mockModalRef as any);
    component.llamarModal('','','');
    expect(spy).toHaveBeenCalled();
  })

});