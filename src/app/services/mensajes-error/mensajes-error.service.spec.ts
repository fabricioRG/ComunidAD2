import { TestBed } from '@angular/core/testing';

import { MensajesErrorService } from './mensajes-error.service';

describe('MensajesErrorService', () => {
  let service: MensajesErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajesErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
