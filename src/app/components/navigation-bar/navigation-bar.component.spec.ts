import { LayoutModule } from '@angular/cdk/layout';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NavigationBarComponent } from './navigation-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SesionService } from 'src/app/services/sesion/sesion.service';

describe('NavigationBarComponent', () => {
  let component: NavigationBarComponent;
  let fixture: ComponentFixture<NavigationBarComponent>;

  let sesionServiceMock = jasmine.createSpyObj('SesionService',
    ['exitSession','usuarioEsAdministradorDeSistema','usuarioEsAdministradorDeComunidad'])

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({

      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
      ],
      declarations: [NavigationBarComponent],
      providers: [NavigationBarComponent,
        {
          provide: SesionService,
          useValue: sesionServiceMock
        }]
    }).compileComponents();
  }));

  beforeEach(() => {
    sesionServiceMock.exitSession.and.returnValue(false)
    sesionServiceMock.usuarioEsAdministradorDeSistema.and.returnValue(false)
    sesionServiceMock.usuarioEsAdministradorDeComunidad.and.returnValue(false)
    fixture = TestBed.createComponent(NavigationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('verificarSesionSuperUsuario true',()=>{
    sesionServiceMock.exitSession.and.returnValue(true)
    sesionServiceMock.usuarioEsAdministradorDeSistema.and.returnValue(true)
    
    var expResult = true
    var result=component.verificarSesionSuperUsuario()
    expect(expResult).toEqual(result)
  })
  
  it('verificarSesionUsuarioComunidad true true',()=>{
    sesionServiceMock.exitSession.and.returnValue(true)
    sesionServiceMock.usuarioEsAdministradorDeComunidad.and.returnValue(true)
    
    var expResult = true
    var result=component.verificarSesionUsuarioComunidad()
    expect(expResult).toEqual(result)
  })
  
  it('verificarSesionAndAdminSistema true',()=>{
    sesionServiceMock.exitSession.and.returnValue(true)
    sesionServiceMock.usuarioEsAdministradorDeSistema.and.returnValue(true)
    
    var expResult = true
    var result=component.verificarSesionAndAdminSistema()
    expect(expResult).toEqual(result)
  })
  
});
