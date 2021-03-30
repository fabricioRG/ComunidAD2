import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';

import { FiltrarSolicitudesComunidadService } from './filtrar-solicitudes-comunidad.service';

describe('FiltrarSolicitudesComunidadService', () => {
  let service: FiltrarSolicitudesComunidadService;
  let  _http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule]
    }).compileComponents();
    service = TestBed.inject(FiltrarSolicitudesComunidadService);
  });

  // it('getAsignacionesComunidad', () => {
  //   var a = new ComunityAssign();
  //   a.estado = 'a';
  //   var b = new ComunityAssign();
  //   b.estado = 'a';
  //   spyOn(_http, 'post').and.returnValue(of(a));


  //   var result = service.getAsignacionesComunidad("1","");
  //   var resultadoValor : any;
  //   result.subscribe(resultado => resultadoValor = resultado);
  //   expect(resultadoValor).toEqual(a);
  // });
});
