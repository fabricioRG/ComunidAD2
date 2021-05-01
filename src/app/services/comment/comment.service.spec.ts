import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CommentPost } from 'src/app/models/commentPost.model';
import { User } from 'src/app/user.model';

import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock :HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[CommentService]

    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.get(HttpTestingController);
  });

   it('should be created', () => {
     expect(service).toBeTruthy();
   });

   it('Create comment',() =>{
     var commentPost : CommentPost = new CommentPost()
     var user : User = new User()
     service.createComment(commentPost,user).subscribe((result : CommentPost)=>{
       expect(result).toEqual(commentPost)
     })
     const request = httpMock.expectOne(`${service.createCommentURL}`);
     expect(request.request.method).toBe('POST');
     request.flush(commentPost);
   })

 /*  it('generateCommentPost',()=>{
     var comentario : string = 'Nuevo comentario'
     var registroAcademico : string = '123456789'
     var idCommunityPost :  number = 1
    
     var result = 'ACTIVE'
     var expResult=service.generateCommentPost(comentario,registroAcademico,idCommunityPost).stateComment;
     expect(expResult).toEqual(result)
    })*/
});
 