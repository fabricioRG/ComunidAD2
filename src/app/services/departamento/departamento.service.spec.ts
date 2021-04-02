import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { DepartamentoService } from './departamento.service';
import dummyPosts from 'src/app/Test/ArchivosJson/Dummy.json';

describe('DepartamentoService', () => {
  let service: DepartamentoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartamentoService],
    });
    service = TestBed.inject(DepartamentoService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should executed', () => {
    // const dummyPosts: any[] = [
    //   {
    //     userId: '1',
    //     nombre: 'a',
    //   },
    //   {
    //     userId: '2',
    //     nombre: 'b',
    //   },
    // ];
    service.getDepartamentos().subscribe((departamentos: any[]) => {
      expect(departamentos.length).toBe(2);
    });

    const request = httpMock.expectOne(`${service.departmentUrl}`);
    expect(request.request.method).toBe('GET');
    request.flush(dummyPosts);
  });
});
