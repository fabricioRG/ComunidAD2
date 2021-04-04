import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from 'src/app/user.model';

import { UploadFileServiceService } from './upload-file-service.service';

describe('UploadFileServiceService', () => {
  let service: UploadFileServiceService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UploadFileServiceService],
    });
    service = TestBed.inject(UploadFileServiceService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('upload', () => {
    service.upload(null, new User()).subscribe((departamentos) => {
      expect(departamentos).toBeTruthy;
    });

    const request = httpMock.expectOne(
      `${service.uploadImageCreateComunityURL}`
    );
    expect(request.request.method).toBe('POST');
  });
});
