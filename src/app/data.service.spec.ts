import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DataService } from './data.service';
import { User } from './user.model';


describe('DataService', () => {
  let service: DataService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[DataService]
    });
    
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test para POST de autenticacion',()=>{
    it('Debe retotnar un objeto que tenga los valores de un usuario',()=>{
      //arrange
      let usuario = new User();
      usuario.ciudad = 'Guatemala'
      usuario.correoElectronico = 'correo@userHash.com'
      usuario.estado = 'ACTIVO'
      usuario.fechaDeNacimiento = '2011-12-13T06:00:00.000+00:00'
      usuario.fotoDePerfil = 'foto'
      usuario.genero = 'M'
      usuario.nombreCompleto = 'User hash'
      usuario.password = '2e80a184267270fc8a50f3f9aef3902e'
      usuario.registroAcademico = '111112222'
      usuario.rolUsuario = 'SUPER'
      //act
      var result=service.postAuthentication(usuario);
      //assert
      expect(result).toBeTruthy; 
    })
  })
});
