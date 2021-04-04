import { HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HeadersService } from '../headers/headers.service';

import { FiltrarSolicitudesComunidadService } from './filtrar-solicitudes-comunidad.service';
import asignaciones from 'src/app/Test/ArchivosJson/AsignacionesComunidad.json';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';

describe('FiltrarSolicitudesComunidadService', () => {
  let service: FiltrarSolicitudesComunidadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FiltrarSolicitudesComunidadService, HeadersService],
    });
    service = TestBed.inject(FiltrarSolicitudesComunidadService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('getAsignacionesComunidad', () => {
    service
      .getAsignacionesComunidad(1, 1)
      .subscribe((asignacionesss: any[]) => {
        expect(asignacionesss.length).toBe(2);
      });

    const request = httpMock.expectOne(
      `${service.filtrarSolicitudesComunidadURL}`
    );
    expect(request.request.method).toBe('POST');
    request.flush(asignaciones);
  });
  it('actualizarEstadosAsignacionesComunidad', () => {
    service
      .actualizarEstadoAsignacionesComunidad(1, new ComunityAssign())
      .subscribe((asignacionesss: any[]) => {
        expect(asignacionesss.length).toBe(2);
      });

    const request = httpMock.expectOne(
      `${service.actualizarEstadoSolicitudesComunidadURL}`
    );
    expect(request.request.method).toBe('POST');
    request.flush(asignaciones);
  });
  it('deleteComunidad', () => {
    service
      .deleteComunity(1, new ComunityAssign())
      .subscribe((asignacionesss: any[]) => {
        expect(asignacionesss.length).toBe(2);
      });

    const request = httpMock.expectOne(`${service.deleteComunityURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(asignaciones);
  });
  it('deleteUserFromComunity', () => {
    service
      .deleteUserFromComunity(1, new ComunityAssign())
      .subscribe((asignacionesss: any[]) => {
        expect(asignacionesss.length).toBe(2);
      });

    const request = httpMock.expectOne(`${service.deleteUserFromComunityURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(asignaciones);
  });
});
