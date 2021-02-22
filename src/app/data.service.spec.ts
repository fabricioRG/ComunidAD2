import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { DataService } from './data.service';
import { User } from './user.model';

describe('DataService', () => {
  let service: DataService;

  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  describe('test para metodo post',()=>{
    it('deberia retornar un usuario creado',()=>{
      //arrange
       let usuario = new User();
       usuario.ciudad = 'ciudad'
      usuario.correoElectronico = 'correo@gmail.com'
      usuario.estado = 'ACTIVO'
      usuario.fechaDeNacimiento = '2000-01-01'
      usuario.fotoDePerfil = 'foto'
      usuario.genero = 'M'
      usuario.nombreCompleto = 'Prueba'
      usuario.password = 'Juan1!'
      usuario.registroAcademico = '200000000'
      usuario.rolUsuario = 'SUPER'
      usuario.token = ''
      //act
      var result = service.addNewUser(usuario)
      expect(result).toBeTruthy;
    });
    
    

  })
  
});
