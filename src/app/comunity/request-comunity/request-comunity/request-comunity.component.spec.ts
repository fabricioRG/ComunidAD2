import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataService } from 'src/app/data.service';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';

import { RequestComunityComponent } from './request-comunity.component';

describe('RequestComunityComponent', () => {
  let component: RequestComunityComponent;
  let fixture: ComponentFixture<RequestComunityComponent>;
  let dataService: DataService;
  let sessionService: SesionService;
  let filtrarAsignacionesComunidad: FiltrarSolicitudesComunidadService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestComunityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestComunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('cargarDatos', () => {
  //   expect(component).toBeTruthy();
  // });
});
