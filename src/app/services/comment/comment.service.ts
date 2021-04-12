import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommentPost } from 'src/app/models/commentPost.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { User } from 'src/app/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  createCommentURL ="/api/community/post/commentCreate"

  constructor(
    private _http: HttpClient
  ) { }


  /**
   * Crea el comentario para una publicacion
   * @param commentPost 
   * @param user 
   */
  createComment(commentPost: CommentPost, user: User) {
    //console.log('En save comunity: ' + comunity.nombre)
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + user.token,
    });
    let options = { headers: headers };
    return this._http.post<CommentPost>(
      this.createCommentURL,
      commentPost,
      options
    );
  }



  /**
   * Genera un objeto CommentPost
   * @param comentario 
   * @param registroAcademico 
   * @param idCommunityPost 
   */
  generateCommentPost(comentario : string , registroAcademico: string,idCommunityPost:number): CommentPost{
    var commentPost : CommentPost = new CommentPost()
    var comunityPost : CommunityPost = new CommunityPost()
    var user : User = new User()
    comunityPost.id=idCommunityPost
    user.registroAcademico=registroAcademico
    
    commentPost.descripcion=comentario
    commentPost.comunityPost=comunityPost
    commentPost.user=user
    commentPost.stateComment='ACTIVE'
    return commentPost;

  }
}
