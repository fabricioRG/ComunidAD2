import { Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { CommunityPostService } from 'src/app/services/communityPost/community-post.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/user.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { OrdinaryObject } from 'src/app/helpers/ordinary-object.model';
import { ModalService } from 'src/app/services/modal/modal.service';
import { CommunitytPostAndUserToken } from 'src/app/models/communitytPostAndUserToken.model';
import { DeletePostService } from 'src/app/services/deletePost/delete-post.service';
import { ValorationPost } from 'src/app/models/valorationPost.model';
import { VoteService } from 'src/app/services/vote/vote.service';
import { Router } from '@angular/router';
import { CommentPost } from 'src/app/models/commentPost.model';
import { CommentService } from 'src/app/services/comment/comment.service';
import { Comunity } from 'src/app/models/comunity.model';

const encabezadoFoto = 'url(data:image/jpeg;base64,';
const finalFoto = ')';
const defaultPicture = '';
const offsetNumber = 10;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {

  panelOpenState = false;
  token: any;
  user: User;
  communityPostList: CommunityPost[] = [];
  postOffset: number = 0;
  actualResponse: boolean = true;
  public emptyTools: object = {
    items: ['Undo', 'Redo'],
  };
  encabezadoFoto: string = 'data:image/jpeg;base64,';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private dataService: DataService,
    private postService: CommunityPostService,
    private sessionService: SesionService,
    private modal: ModalService,
    private deletePostService: DeletePostService,
    private communityPostService: CommunityPostService,
    private voteService: VoteService,
    private redirection: Router,
    private commentService: CommentService,
  ) {
    this.token = '';
  }

  ngOnInit(): void {
    this.dataService
      .getUserByToken(this.sessionService.getUserWithToken())
      .subscribe((response) => {
        this.user = response;
        this.loadUserCommunitiesPost();
      });
  }

  getImage(image: string) {
    return this.encabezadoFoto + image;
  }

  loadUserCommunitiesPost() {
    let params: OrdinaryObject = {
      stringParam: this.user.registroAcademico,
      numberParam: this.postOffset
    }
    this.postService
      .getUserCommunitiesPost(params, this.user)
      .subscribe((data) => {
        if(data.length <= 0){
          this.actualResponse = false;
        }
        this.postOffset += offsetNumber;
        data.forEach(element => {
          this.communityPostList.push(element);
        });
      });
  }

  postIsOfUser(comunityPost: CommunityPost): boolean {
    if (this.user.registroAcademico == comunityPost.user?.registroAcademico) {
      return true;
    }
    return false;
  }

  goToUserProfile(usr: User) {
    this.redirection.navigate(['userProfile', usr.registroAcademico]);
  }

  goToCommunity(community: Comunity) {
    this.redirection.navigate(['viewComunity', community.id]);
  }

  async deletePost(comunityPost: CommunityPost) {
    var dato = await this.modal.openModal(
      'Eliminar post',
      'ESTAS SEGURO QUE DESEAS ELIMINAR EL POST ',
      'SE ELIMINARAR EL POST UNA VEZ SE CONFIRME',
      true
    );
    if (dato) {
      var userWithToken = this.sessionService.getUserWithToken()
      var communityPostAndUserToken: CommunitytPostAndUserToken = this.deletePostService.generateCommunitytPostAndUserToken(comunityPost, userWithToken.token)
      const index = this.communityPostList.indexOf(comunityPost);
      this.deletePostService.deletePostByUser(communityPostAndUserToken, userWithToken)
        .subscribe((response) => {
          this.modal.openModal(
            'Post eliminado:',
            'El post se ha eliminado correctamente' + '',
            '',
            false
          );
          if (index !== -1) {
            this.communityPostList.splice(index, 1);
          }
        })
    }
  }

  getFormatedTime(time: string | undefined) {
    let d = new Date(time!);
    var datestring =
      d.getDate() +
      '/' +
      (d.getMonth() + 1) +
      '/' +
      d.getFullYear() +
      ' ' +
      d.getHours() +
      ':' +
      d.getMinutes();
    return datestring;
  }

  upvote(comunityPost: CommunityPost) {
    var user = this.sessionService.getUserWithToken();
    this.communityPostService.getCommunityPostById(comunityPost, user)
      .subscribe((data) => {
        comunityPost.rated = data.rated
        //Metodo que cree el like
        var isCreate: boolean;
        if (comunityPost.valoration) {
          if (comunityPost.valoration == 'DOWN') {
            //CAMBIARLO A UP-----rated++
            comunityPost.valoration = 'UP';
            this.recalcularRated(comunityPost, '+', 2); //2
          } else if (comunityPost.valoration == 'NONE') {
            comunityPost.valoration = 'UP';
            this.recalcularRated(comunityPost, '+', 1);
          } else if (comunityPost.valoration == 'UP') {
            //CAMBIARLO A NONE-----rated--
            comunityPost.valoration = 'NONE';
            this.recalcularRated(comunityPost, '-', 1);
          }

          //Actualizar una tupla donde id_post=x AND user_registro=y
          isCreate = false;
        } else {
          //Crear un valoration UP-------rated++
          isCreate = true;
          comunityPost.valoration = 'UP';
          this.recalcularRated(comunityPost, '+', 1);
        }
        //Actualizar el comunity_post
        this.saveOrModifyValorationAndComunityPost(comunityPost, isCreate);

      })
  }

  userName(usr: User | undefined) {
    return usr?.nombreCompleto ? usr.nombreCompleto : null;
  }

  communityName(community: Comunity | undefined){
    return community?.nombre ? community.nombre : null;
  }

  recalcularRated(
    comunityPost: CommunityPost,
    operacion: string,
    aumento_devcremento: number
  ) {
    if (comunityPost.rated) {
      if (operacion == '+') {
        comunityPost.rated += aumento_devcremento;
      } else {
        comunityPost.rated -= aumento_devcremento;
      }
    } else {
      //comunityPost.rated=0
      if (operacion == '+') {
        comunityPost.rated = 0;
        comunityPost.rated += aumento_devcremento;
      } else {
        comunityPost.rated = 0;
        comunityPost.rated -= aumento_devcremento;
      }
    }
  }

  saveOrModifyValorationAndComunityPost(
    comunityPost: CommunityPost,
    isCreate: boolean
  ) {
    var user: User = this.sessionService.getUserWithToken();
    this.dataService
      .persistCommunityPost(comunityPost, user)
      .subscribe((data) => {
        var valoration: ValorationPost = this.voteService.genereteValorationPostOfUserLogued(
          comunityPost,
          this.user
        );
        valoration.valoration = comunityPost.valoration;
        if (isCreate) {
          this.voteService
            .createValoration(valoration, user)
            .subscribe((data) => { });
        } else {
          //Actualizacion
          this.voteService
            .updateValoration(valoration, user)
            .subscribe((data) => { });
        }
      });
  }

  downvote(comunityPost: CommunityPost) {
    //Metodo que cree el dislike
    var user = this.sessionService.getUserWithToken();
    this.communityPostService.getCommunityPostById(comunityPost, user)
      .subscribe((data) => {
        comunityPost.rated = data.rated
        var isCreate: boolean;
        if (comunityPost.valoration) {
          if (comunityPost.valoration == 'UP') {
            //CAMBIARLO A DOWN-----rated--
            comunityPost.valoration = 'DOWN';
            this.recalcularRated(comunityPost, '-', 2);
          } else if (comunityPost.valoration == 'NONE') {
            comunityPost.valoration = 'DOWN';
            this.recalcularRated(comunityPost, '-', 1);
          } else if (comunityPost.valoration == 'DOWN') {
            //CAMBIARLO A NONE-----rated++
            comunityPost.valoration = 'NONE';
            this.recalcularRated(comunityPost, '+', 1);
          }

          //Actualizar una tupla donde id_post=x AND user_registro=y
          isCreate = false;
        } else {
          //Crear un valoration UP-------rated--
          isCreate = true;
          comunityPost.valoration = 'DOWN';
          this.recalcularRated(comunityPost, '-', 1);
        }
        //Actualizar el comunity_post
        this.saveOrModifyValorationAndComunityPost(comunityPost, isCreate);
      })
  }

  /**
   * Calcula el numero de caracteres del comentario
   * @param e
   * @param post
   */
  onKeyComment(e: Event, post: CommunityPost) {
    const element = e.currentTarget as HTMLInputElement;
    post.caracteresDeComentario = element.value.length;
  }

  /**
   * Evalua si se puede guardar el comentario del usuario
   * @param post
   */
  saveComment(post: CommunityPost) {
    if (
      post.nuevoComentario &&
      post.nuevoComentario.length != 0 &&
      post.nuevoComentario.length <= 150 &&
      post.id &&
      this.user.registroAcademico
    ) {
      var commentPost: CommentPost = this.commentService.generateCommentPost(
        post.nuevoComentario,
        this.user.registroAcademico,
        post
      );
      var user: User = this.sessionService.getUserWithToken();

      this.commentService.createComment(commentPost, user).subscribe((data) => {
        data.user = this.user;
        post.nuevoComentario = '';
        post.caracteresDeComentario = 0;
        post.commentPost?.push(data);
      });
    }
  }

}
