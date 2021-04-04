import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DataService } from 'src/app/data.service';
import { HeadersService } from '../headers/headers.service';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let dataService: DataService;
  let mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: Router,
          useValue: mockRouter,
        },
        LoginService,
        DataService,
        HeadersService,
      ],
    });
    dataService = new DataService(
      TestBed.inject(HttpClient),
      TestBed.inject(HeadersService)
    );
    service = new LoginService(dataService, TestBed.inject(Router));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('pruebaRutaWhenTrue', () => {
    var spy = spyOn(dataService, 'getLoggedIn').and.returnValue(true);
    var result = service.pruebaRuta();
    expect(result).toEqual(true);
  });
  it('pruebaRutaWhenFalse', () => {
    var spy = spyOn(dataService, 'getLoggedIn').and.returnValue(false);
    var result = service.pruebaRuta();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['inicio']);
    expect(result).toEqual(false);
  });
});
