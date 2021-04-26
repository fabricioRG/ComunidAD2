import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { User } from 'src/app/user.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityPostService {

  getCommunityPostByIdURL="/api/community/post/getPost";

  constructor(private _http: HttpClient) { }

  getCommunityPostById(communityPost : CommunityPost, user : User){
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + user.token,
    });
    let options = { headers: headers };
    return this._http.post<CommunityPost>(
      this.getCommunityPostByIdURL,
      communityPost,
      options
    )
  }

}
