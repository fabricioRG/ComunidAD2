import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunitytPostAndUserToken } from 'src/app/models/communitytPostAndUserToken.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { User } from 'src/app/user.model';

@Injectable({
  providedIn: 'root'
})
export class DeletePostService {


  deletePostByAdminURL="/api/community/post/adminDeleteComunity";
  deletePostByUserURL="/api/community/post/userDeleteComunity";

  constructor(private _http: HttpClient) { }

  /**
   * Metodo para utilizarse cuando un usuario Creador de una comunidad
   * desea eliminar un POST
   * @param communitytPostAndUserToken 
   * @param user 
   */
  deletePostByAdmin( communitytPostAndUserToken:CommunitytPostAndUserToken, user:User){
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + user.token,
    });
    let options = { headers: headers };
    return this._http.post<CommunityPost>(
      this.deletePostByAdminURL,
      communitytPostAndUserToken,
      options
    )
  }

  /**
   * Metodo a utilizarse cuando un usuario desea eliminar un post de una comunidad
   * @param communitytPostAndUserToken 
   * @param user 
   */
  deletePostByUser(communitytPostAndUserToken:CommunitytPostAndUserToken, user:User){
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + user.token,
    });
    let options = { headers: headers };
    return this._http.post<CommunityPost>(
      this.deletePostByUserURL,
      communitytPostAndUserToken,
      options
    )
  }

  /**
   * Genera un objeto de tipo CommunityPostAndUserToken
   * @param communityPost 
   * @param token 
   */
  generateCommunitytPostAndUserToken(communityPost: CommunityPost, token: string | undefined):CommunitytPostAndUserToken{
    var communitytPostAndUserToken:CommunitytPostAndUserToken = new CommunitytPostAndUserToken
    communitytPostAndUserToken.communityPost=communityPost
    communitytPostAndUserToken.token=token
    return communitytPostAndUserToken
  }
}
