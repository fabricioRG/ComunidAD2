import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { ValorationPost } from 'src/app/models/valorationPost.model';
import { User } from 'src/app/user.model';

import { VoteService } from './vote.service';

describe('VoteService', () => {
  let service: VoteService;
  let httpMock :HttpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[VoteService]
    });
    service = TestBed.inject(VoteService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('createValoration',()=>{
    var valorationPost: ValorationPost = new ValorationPost
    var user: User = new User
    service.createValoration(valorationPost,user).subscribe((result:ValorationPost)=>{
      expect(result).toEqual(valorationPost)
    })
    const request = httpMock.expectOne(`${service.createValorationURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(valorationPost);
  })

  it('updateValoration',()=>{
    var valorationPost: ValorationPost = new ValorationPost
    var user: User = new User
    service.updateValoration(valorationPost,user).subscribe((result:ValorationPost)=>{
      expect(result).toEqual(valorationPost)
    })
    const request = httpMock.expectOne(`${service.updateValorationURL}`);
    expect(request.request.method).toBe('POST');
    request.flush(valorationPost);
  })

  it('genereteValorationPostOfUserLogued',()=>{
    var comunityPost: CommunityPost = new CommunityPost()
    var userLogueado: User = new User()
    var valorationPost: ValorationPost = new ValorationPost()
    valorationPost.communityPost = comunityPost;
    valorationPost.user = userLogueado;

    let expResult = valorationPost;
    let result : ValorationPost=service.genereteValorationPostOfUserLogued(comunityPost,userLogueado)
    expect(expResult).toEqual(result)
  })

});
