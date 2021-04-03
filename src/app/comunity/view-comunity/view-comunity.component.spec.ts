import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'src/app/data.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';

import { ViewComunityComponent } from './view-comunity.component';

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



describe('ViewComunityComponent', () => {
  let component: ViewComunityComponent;
//  let fixture: ComponentFixture<ViewComunityComponent>;
  let sesionServiceMock: SesionServiceMock;
  let dataServiceMock: DataServiceMock;
  let uploadFileServiceMock : UploadFileServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[RouterTestingModule,HttpClientTestingModule],
      declarations: [ ViewComunityComponent ],
      providers :[ViewComunityComponent,
        {
          provide: DataService,
          useClass: DataServiceMock
        },
        {
          provide: SesionService,
          useClass: SesionServiceMock
        },{
          provide : UploadFileServiceService,
          useClass : UploadFileServiceMock
        }
      ]
    })
    //.compileComponents();
    component = TestBed.get(ViewComunityComponent)
    sesionServiceMock = TestBed.get(SesionService)
    dataServiceMock = TestBed.get(DataService)
    uploadFileServiceMock = TestBed.get(UploadFileServiceService)
  });

 /* beforeEach(() => {
    fixture = TestBed.createComponent(ViewComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });*/

 it('should create', () => {
    expect(component).toBeTruthy();
   });

  it('cargar comunidad',()=>{
    
  })
});
