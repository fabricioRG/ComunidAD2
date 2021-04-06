import { HttpClientTestingModule } from '@angular/common/http/testing';
import { componentFactoryName } from '@angular/compiler';
import { TestBed } from '@angular/core/testing';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/user.model';

import { SesionService } from './sesion.service';

describe('SesionService', () => {
  let service: SesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SesionService, DataService],
    });
    service = TestBed.inject(SesionService);
    spyOn(service, 'asignarTipoDeUsuarioConSesion').and.stub();
    spyOn(localStorage.__proto__, 'getItem').and.returnValue('true');
  });

  it('should be created', () => {
    console.log('My Service:',service)
    expect(service).toBeTruthy();
  });



  /*it('usuario es suscriptor',()=>{
    var user:User= new User()
    user.token='abc'
    user.rolUsuario='SUPER'
    console.log("USER AQUI",user)
    service.asignarTipoDeUsuarioConSesion(user)
    var expResult = true;
    var result =service.usuarioEsSuscriptor()
    expect(expResult).toEqual(result)
  })*/
/*  it('log Out',()=>{
    service.log0ut()
    var expResult = false;
    var result = service.loggedIn;
    expect(expResult).toEqual(result)
  })*/
});



/*describe('SesionService2', () => {
  let service: SesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SesionService, DataService],
    });
    service = TestBed.inject(SesionService);
    spyOn(localStorage.__proto__, 'getItem').and.returnValue('true');
  });
});*/
