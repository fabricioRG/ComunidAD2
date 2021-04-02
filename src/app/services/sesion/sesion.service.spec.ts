import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DataService } from 'src/app/data.service';

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
    expect(service).toBeTruthy();
  });
});

describe('SesionService2', () => {
  let service: SesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SesionService, DataService],
    });
    service = TestBed.inject(SesionService);
    spyOn(localStorage.__proto__, 'getItem').and.returnValue('true');
  });
});
