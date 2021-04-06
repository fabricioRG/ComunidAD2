import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from 'src/app/user.model';
import user from 'src/app/Test/ArchivosJson/User3.json';
import arregloAsigns from 'src/app/Test/ArchivosJson/AsignacionesComunidad.json';
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

  it('upload profile user image', () => {
    service.uploadProfileUserImage(null, user).subscribe((result: User) => {
      expect(result).toEqual(user);
    });

    const request = httpMock.expectOne(`${service.uploadUserImageURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(user);
  });
  it('upload comunity post image', () => {
    service.uploadCommunityPostImage(null, user).subscribe((result: User) => {
      expect(result).toEqual(arregloAsigns[0]);
    });
    const request = httpMock.expectOne(
      `${service.uploadCommunityPostImageURL}`
    );
    expect(request.request.method).toBe('POST');
    request.flush(arregloAsigns[0]);
  });
});
