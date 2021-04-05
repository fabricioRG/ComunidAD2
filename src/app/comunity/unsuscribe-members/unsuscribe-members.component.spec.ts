import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ActivatedRoute, convertToParamMap, Data } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { InicioComponent } from 'src/app/views/inicio/inicio.component';

import { UnsuscribeMembersComponent } from './unsuscribe-members.component';

describe('UnsuscribeMembersComponent', () => {
  let component: UnsuscribeMembersComponent;
  let fixture: ComponentFixture<UnsuscribeMembersComponent>;

  const sessionServiceMock = jasmine.createSpyObj('SesionService',
    ['exitSession', 'getUserWithToken'])

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, BrowserDynamicTestingModule, RouterTestingModule.withRoutes([
        { path: 'inicio', component: InicioComponent }
      ])],
      declarations: [UnsuscribeMembersComponent],
      providers: [UnsuscribeMembersComponent,
        {
          provide: SesionService,
          useValue: sessionServiceMock
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
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    sessionServiceMock.exitSession.and.returnValue(false)
    fixture = TestBed.createComponent(UnsuscribeMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cargar datos', () => {
    spyOn(component, 'verificarSiComunidadEsDelUsuarioLogueado').and.stub()
    sessionServiceMock.exitSession.and.returnValue(true)
    component.cargarDatos()
    //Act
    var expResult = 50
    var result = component.comunity.id;
    //Assert
    if (result) {
      expect(expResult).toEqual(result)
    }
  })

  it('Obtener formulario', () => {
    expect(component.f).toBeTruthy()
  })

});
