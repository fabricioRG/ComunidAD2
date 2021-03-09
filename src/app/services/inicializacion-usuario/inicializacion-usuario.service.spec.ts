import { TestBed } from '@angular/core/testing';
import { User } from 'src/app/user.model';
import { FechasService } from '../fechas/fechas.service';

import { InicializacionUsuarioService } from './inicializacion-usuario.service';

describe('InicializacionUsuarioService', () => {
  let service: InicializacionUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InicializacionUsuarioService);
  });

  it('crearUsuario ver si asigna correctamente genero', () => {
    //arrange
    var usuario =  new User();
    
    usuario.fechaDeNacimiento = '2000-01-01'
    usuario.genero = 'M'
    var fechasService = TestBed.inject(FechasService)
    spyOn(fechasService, "convertirFecha").and.returnValue('2000-01-01');
    //act
    service.setFechasService(fechasService)
    var resultado = service.inicializarValoresUsuario(usuario)

    //assert
    expect(resultado.genero).toEqual(usuario.genero)
  });
});
