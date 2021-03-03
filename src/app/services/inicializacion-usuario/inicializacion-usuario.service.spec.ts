import { TestBed } from '@angular/core/testing';

import { InicializacionUsuarioService } from './inicializacion-usuario.service';

describe('InicializacionUsuarioService', () => {
  let service: InicializacionUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InicializacionUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
