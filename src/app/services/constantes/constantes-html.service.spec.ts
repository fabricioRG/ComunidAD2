import { TestBed } from '@angular/core/testing';

import { ConstantesHtmlService } from './constantes-html.service';

describe('ConstantesHtmlService', () => {
  let service: ConstantesHtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstantesHtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
