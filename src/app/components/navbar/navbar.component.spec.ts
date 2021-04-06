import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { ViewComunityComponent } from 'src/app/comunity/view-comunity/view-comunity.component';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';
import { InicioComponent } from 'src/app/views/inicio/inicio.component';
import { UserProfileComponent } from 'src/app/views/user-profile/user-profile.component';

import { NavbarComponent } from './navbar.component';

interface option {
  value?: string,
  viewValue?: string
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let logger$ = new Subject<boolean>(); //Va a emitir un evento


  let sesionServiceMock = jasmine.createSpyObj('SesionService',
    ['asignarTipoDeUsuarioConSesion','getUserWithToken','loggedIn$', 'log0ut', 'exitSession', 'usuarioEsSuscriptor', 'usuarioEsAdministradorDeSistema', 'usuarioEsAdministradorDeComunidad'])
  let dataServiceMock = jasmine.createSpyObj('DataService',
    ['getUserByToken','getUsersBySearch', 'getCommunitiesBySearch'])


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatAutocompleteModule, RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, BrowserDynamicTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'userProfile', component: UserProfileComponent, },
          { path: 'viewComunity', component: ViewComunityComponent }])
      ],
      declarations: [NavbarComponent],
      providers: [NavbarComponent,
        {
          provide: SesionService,
          useValue: sesionServiceMock
        },
        {
          provide: DataService,
          useValue: dataServiceMock
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    var user: User = new User()
    user.registroAcademico = '123456789'
    spyOn(localStorage,'getItem').and.returnValue(JSON.stringify('token'))
    sesionServiceMock.loggedIn$.and.returnValue(logger$.asObservable())
    logger$.next(true)
    sesionServiceMock.getUserWithToken.and.returnValue(user)
    dataServiceMock.getUserByToken.and.returnValue(of(user))
    sesionServiceMock.asignarTipoDeUsuarioConSesion.and.returnValue()

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy
  })

  it('logOut', () => {
    expect(component.logOut()).toHaveBeenCalled
  })

  it('Usuario es suscriptor', () => {
    sesionServiceMock.usuarioEsSuscriptor.and.returnValue(false)
    var expResult = false;
    var result = component.usuarioEsSuscriptor()
    expect(expResult).toEqual(result)
  })

  it('usuarioEsAdministradorDeSistema', () => {
    sesionServiceMock.usuarioEsAdministradorDeSistema.and.returnValue(false)
    var expResult = false;
    var result = component.usuarioEsAdministradorDeSistema()
    expect(expResult).toEqual(result)
  })

  it('usuarioEsAdministradorDeComunidad', () => {
    sesionServiceMock.usuarioEsAdministradorDeComunidad.and.returnValue(false)
    var expResult = false;
    var result = component.usuarioEsAdministradorDeComunidad()
    expect(expResult).toEqual(result)
  })

  it('updateResultList, selected category is Usuario', () => {
    var listaUsuarios: User[] = [{}]
    var resultListSearch: option[] = [{}]
    var opt: option = {
      value: undefined,
      viewValue: undefined
    }
    // resultListSearch.push(opt)
    dataServiceMock.getUsersBySearch.and.returnValue(of(listaUsuarios))
    component.updateResultList()
    //Arrange
    var expResult = resultListSearch;
    var result = component.resultListSearch;
    //Assert
    expect(expResult.length).toEqual(result.length)
  })

  it('updateResultList, selected category is Comunidad', () => {
    var listaComunitys: Comunity[] = [{}]
    var resultListSearch: option[] = [{}]
    component.selectedCategory = 'Comunidad'
    var opt: option = {
      value: undefined,
      viewValue: undefined
    }
    // resultListSearch.push(opt)
    dataServiceMock.getCommunitiesBySearch.and.returnValue(of(listaComunitys))
    component.updateResultList()
    //Arrange
    var expResult = resultListSearch;
    var result = component.resultListSearch;
    //Assert
    expect(expResult.length).toEqual(result.length)
  })

  it('select user, is User', () => {
    var opt: option = {
      value: undefined,
      viewValue: undefined
    }
    component.selectedCategory = 'User'
    expect(component.selectUser(opt)).toBeUndefined()
  })


  it('on key',()=>{
//    localStorage.getItem('token');
    //spyOn(localStorage,'getItem').and.returnValue(JSON.stringify('token'))
    spyOn(component,'updateResultList').and.stub()
    const event = new Event('click');
    expect(component.onKey(event)).toBeUndefined()

  })

});
