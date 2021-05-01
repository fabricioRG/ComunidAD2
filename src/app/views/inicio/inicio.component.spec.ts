import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'src/app/data.service';
import { CommunityPostService } from 'src/app/services/communityPost/community-post.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { VoteService } from 'src/app/services/vote/vote.service';

import { InicioComponent } from './inicio.component';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  const spyRouter = jasmine.createSpyObj('Router', ['navigate']);
  const sesionServiceMock = jasmine.createSpyObj('SesionService', [
    'exitSession',
    'getToken',
    'getUserWithToken',
    'usuarioEsAdministradorDeComunidad',
  ]);
  const postServiceMock = jasmine.createSpyObj('postService', [
    'getUserCommunitiesPost'
  ])
  const dataServiceMock = jasmine.createSpyObj('DataService', [
    'getUserByToken',
    'findComunityById',
    'findSuscriptionComunity',
    'saveComunityAssign',
    'getAllCommunityPostByCommunity',
    'getAllUsersInCommunity',
    'persistCommunityPost',
    'saveComunity',
  ]);
  const filtrarSolicitudesComunidadServiceMock = jasmine.createSpyObj(
    'FiltrarSolicitudesComunidadService',
    ['deleteComunity', 'deleteUserFromComunity']
  );
  const uploadFileServiceServiceMock = jasmine.createSpyObj(
    'UploadFileServiceService',
    ['uploadCommunityPostImage']
  );
  const modalServiceMock = jasmine.createSpyObj('ModalService', ['openModal']);
  const voteServiceMock = jasmine.createSpyObj('VoteService', ['']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        ReactiveFormsModule,
      ],
      declarations: [InicioComponent],
      providers: [
        HttpClient,
        InicioComponent,
        {
          provide: DataService,
          useValue: dataServiceMock,
        },
        {
          provide: SesionService,
          useValue: sesionServiceMock,
        },
        {
          provide: CommunityPostService,
          useValue: postServiceMock
        },
        {
          provide: VoteService,
          useValue: voteServiceMock,
        },
        {
          provide: Router,
          useValue: spyRouter,
        },
        {
          provide: ModalService,
          useValue: modalServiceMock,
        },
        {
          provide: UploadFileServiceService,
          useValue: uploadFileServiceServiceMock,
        },
      ],
    });
      // .compileComponents();
  });

  beforeEach(() => {
    spyRouter.navigate.and.returnValue('YES');
    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getImage', () => {
    let photo = "photo";
    let expResult = component.encabezadoFoto;
    let result = component.getImage(photo);
    expect(result).toEqual(expResult);
  });

});
