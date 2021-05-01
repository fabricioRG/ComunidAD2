import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommunitytPostAndUserToken } from 'src/app/models/communitytPostAndUserToken.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { User } from 'src/app/user.model';

import { DeletePostService } from './delete-post.service';

describe('DeletePostService', () => {
  let service: DeletePostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DeletePostService]
    });
    service = TestBed.inject(DeletePostService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deletePostByAdmin', () => {
    var commencommunitytPostAndUserTokenPost: CommunitytPostAndUserToken = new CommunitytPostAndUserToken()
    var user: User = new User()
    var communityPost: CommunityPost = new CommunityPost()
    service.deletePostByAdmin(commencommunitytPostAndUserTokenPost, user).subscribe((result: CommunityPost) => {
      expect(result).toEqual(communityPost)
    })
    const request = httpMock.expectOne(`${service.deletePostByAdminURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(communityPost);
  })


  it('deletePostByUser', () => {
    var commencommunitytPostAndUserTokenPost: CommunitytPostAndUserToken = new CommunitytPostAndUserToken()
    var user: User = new User()
    var communityPost: CommunityPost = new CommunityPost()
    service.deletePostByUser(commencommunitytPostAndUserTokenPost, user).subscribe((result: CommunityPost) => {
      expect(result).toEqual(communityPost)
    })
    const request = httpMock.expectOne(`${service.deletePostByUserURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(communityPost);
  })


  it('generateCommunitytPostAndUserToken', () => {
    var communityPost: CommunityPost = new CommunityPost()
    var token: string = "abcToken"
    var expResult = token
    var result = service.generateCommunitytPostAndUserToken(communityPost, token).token
    if (result) {
      expect(expResult).toEqual(result)
    }
  })

});
