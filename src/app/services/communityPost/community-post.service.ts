import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrdinaryObject } from 'src/app/helpers/ordinary-object.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { User } from 'src/app/user.model';
import { HeadersService } from '../headers/headers.service';

@Injectable({
  providedIn: 'root'
})
export class CommunityPostService {

  getCommunityPostByIdURL="/api/community/post/getPost";
  getUserCommunitiesPostURL = "/api/community/post/get/allUserCommunities";

  constructor(private _http: HttpClient, private controllHeader: HeadersService) { }

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

  getUserCommunitiesPost(params: OrdinaryObject, token: User){
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post<CommunityPost[]>(
      this.getUserCommunitiesPostURL,
      params,
      options
    );
  }

}
