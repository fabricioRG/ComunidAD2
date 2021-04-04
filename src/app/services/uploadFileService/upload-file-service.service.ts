import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comunity } from 'src/app/models/comunity.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { User } from 'src/app/user.model';

@Injectable({
  providedIn: 'root'
})
export class UploadFileServiceService {


  uploadImageCreateComunityURL = '/api/users/uploadImageComunity';
  uploadCommunityPostImageURL = '/api/community/post/upload/images';


  constructor(private _http: HttpClient) {

  }


  upload(file: FormData | null, token: User) {
    console.log('En save IMAGE: ', file)
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post(this.uploadImageCreateComunityURL, file, options);
  }

  uploadCommunityPostImage(file: FormData | null, token: User){
    let headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token.token,
    });
    let options = { headers: headers };
    return this._http.post<CommunityPost>(this.uploadCommunityPostImageURL, file, options);
  }

}
