import { TestBed } from '@angular/core/testing';

import { FiltrarSolicitudesComunidadService } from './filtrar-solicitudes-comunidad.service';

describe('FiltrarSolicitudesComunidadService', () => {
  let service: FiltrarSolicitudesComunidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiltrarSolicitudesComunidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
