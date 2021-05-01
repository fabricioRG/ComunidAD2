import { TestBed } from '@angular/core/testing';
import { EditProfileComponent } from 'src/app/views/edit-profile/edit-profile.component';

import { FechasService } from './fechas.service';

describe('FechasService', () => {
  let service: FechasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FechasService);
  });

  it('fechas iguales', () => {
    //arrange
    var fecha1 = '2000-01-01';
    var fecha2 = '2000-01-01';
    //act
    var resultado = service.compararFechas(fecha1, fecha2);
    //assert
    expect(resultado).toEqual(false);
  });

  it('fechas distintas', () => {
    //arrange
    var fecha1 = '2000-01-01';
    var fecha2 = '2000-02-01';
    //act
    var resultado = service.compararFechas(fecha1, fecha2);
    //assert
    expect(resultado).toEqual(true);
  });

  it('convertir fecha correctamente', () => {
    //arrange
    var fecha1 = new Date('2000-01-02'); //se tiene que arregalr la zona horaria
    var esperada = '2000-01-01';

    //act
    var resultado = service.convertirFecha(fecha1);
    //assert
    expect(resultado).toEqual(esperada);
  });

  it('validarCampo not null', () => {
    //arrange
    var esperado = '2000-01-02';
    var fecha1 = new Date(esperado); //se tiene que arregalr la zona horaria

    var spy = spyOn(service, 'convertirFecha').and.returnValue(esperado);

    //act
    var resultado = service.validarCampoYConvertirFecha(fecha1);
    //assert
    expect(resultado).toEqual(esperado);
  });

  it('validarCampo null', () => {
    //arrange

    var fecha1 = ''; //se tiene que arregalr la zona horaria

    //act
    var resultado = service.validarCampoYConvertirFecha(fecha1);
    //assert
    expect(resultado).toEqual(fecha1);
  });
});
