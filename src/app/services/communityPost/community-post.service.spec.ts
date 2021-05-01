import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { User } from 'src/app/user.model';

import { CommunityPostService } from './community-post.service';

describe('CommunityPostService', () => {
  let service: CommunityPostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports : [HttpClientTestingModule],
      providers : [CommunityPostService]
    });
    service = TestBed.inject(CommunityPostService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getCommunityPostById',()=>{
    var comunityPost : CommunityPost = new CommunityPost()
    var user : User = new User()
    service.getCommunityPostById(comunityPost,user).subscribe((result : CommunityPost)=>{
      expect(result).toEqual(comunityPost)
    })
    const request = httpMock.expectOne(`${service.getCommunityPostByIdURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(comunityPost);
  })
});
