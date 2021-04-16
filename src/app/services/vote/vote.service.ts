import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { ValorationPost } from 'src/app/models/valorationPost.model';
import { User } from 'src/app/user.model';
import { HeadersService } from '../headers/headers.service';

@Injectable({
  providedIn: 'root'
})
export class VoteService {

  createValorationURL = "/api/users/createValoration"
  updateValorationURL = "/api/users/updateValoration"

  constructor(
    private _http: HttpClient
  ) { }


  /**
   * Permite crear una valoracion
   * @param valorationPost 
   * @param user 
   */
  createValoration(valorationPost: ValorationPost, user: User) {
    //console.log('En save comunity: ' + comunity.nombre)
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + user.token,
    });
    let options = { headers: headers };
    return this._http.post<ValorationPost>(
      this.createValorationURL,
      valorationPost,
      options
    );
  }

  /**
   * Permite actualizar una valoracion
   * @param valorationPost 
   * @param user 
   */
  updateValoration(valorationPost: ValorationPost, user: User) {
    //console.log('En save comunity: ' + comunity.nombre)
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + user.token,
    });
    let options = { headers: headers };
    return this._http.post<ValorationPost>(
      this.updateValorationURL,
      valorationPost,
      options
    );
  }

  /**
   * Genera un valoration post
   * @param comunityPost 
   * @param userLogueado 
   */
  genereteValorationPostOfUserLogued(comunityPost: CommunityPost, userLogueado: User): ValorationPost {
    var valorationPost: ValorationPost = new ValorationPost()
    valorationPost.communityPost = comunityPost;
    valorationPost.user = userLogueado;
    return valorationPost;
  }
}
