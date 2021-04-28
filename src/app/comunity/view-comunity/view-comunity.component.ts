import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  ParamMap,
} from '@angular/router';
import { DataService } from 'src/app/data.service';
import { OrdinaryObject } from 'src/app/helpers/ordinary-object.model';
import { CommentPost } from 'src/app/models/commentPost.model';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { Course } from 'src/app/models/course.model';
import { IdComunityAssign } from 'src/app/models/idComunityAssign.model';
import { ConstantesHtmlService } from 'src/app/services/constantes/constantes-html.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { CommentService } from 'src/app/services/comment/comment.service';
import { ValorationPost } from 'src/app/models/valorationPost.model';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { VoteService } from 'src/app/services/vote/vote.service';
import { User } from 'src/app/user.model';
import { LoadComunitysComponent } from '../load-comunitys/load-comunitys.component';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FechasService } from 'src/app/services/fechas/fechas.service';

const encabezadoFoto = 'url(data:image/jpeg;base64,';
const finalFoto = ')';
const defaultPicture = '';

@Component({
  selector: 'app-view-comunity',
  templateUrl: './view-comunity.component.html',
  styleUrls: ['./view-comunity.component.css'],
})
export class ViewComunityComponent implements OnInit {
  constructor(
    private redirection: Router,
    private route: ActivatedRoute,
    private uploadFileService: UploadFileServiceService,
    private dataService: DataService,
    private sessionService: SesionService,
    private formBuilder: FormBuilder,
    private modal: ModalService,
    private comunidadService: FiltrarSolicitudesComunidadService,
    private commentService: CommentService,
    private voteService: VoteService,
    private fechasService: FechasService
  ) {
    this.cargarComunidad();
  }

  user: User;
  comunityAssign: ComunityAssign;
  comunidadEsDelUsuarioLogueado: boolean;
  puedeEnviarSolicitud: boolean;
  comunity: Comunity;
  styleBackgroundImageCommunity = '';
  communityPostList: CommunityPost[];
  usersInCommunityList: User[];
  postForm: FormGroup;
  newCommunityPost: CommunityPost;
  fileList: FileList | null;
  imagenCargada: string | ArrayBuffer | null;

  //Constante para la imagen
  encabezadoFoto: string = 'data:image/jpeg;base64,';

  //Variables para ver estado de solicitud
  solicitudEstaEnEspera: boolean;
  solicitudEstaActiva: boolean;
  solicitudEstaDenegada: boolean;
  banderaMostrarPosts: boolean;
  alertClosedSuccess = false;
  alertClosedDanger = false;
  disableCreateCommunityPost = false;
  //privacidad
  privacidad: boolean;
  disableCreateComment = false;
  comentarioEsValido = true;

  //rich text
  public tools: object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'SubScript',
      'SuperScript',
      '|',
      'LowerCase',
      'UpperCase',
      '|',
      'Formats',
      'Alignments',
      '|',
      'OrderedList',
      'UnorderedList',
      '|',
      'Indent',
      'Outdent',
      '|',
      'CreateLink',
      '|',
      'ClearFormat',
      'Print',
      'SourceCode',
      '|',
      'FullScreen',
    ],
  };

  public emptyTools: object = {
    items: ['Undo', 'Redo'],
  };
  public iframe: object = { enable: true };
  public height: number = 500;
  //filtros
  filtrosForm!: FormGroup;
  opcionesValoracion = [
    {
      valor: ConstantesService.ESTADO_VALORACION_MAS_VALORACION,
      mensaje: ConstantesService.MENSAJE_VALORACION_MAS_VALORACION,
      icono: ConstantesService.ICONO_VALORACION_MAS_VALORACION,
    },
    {
      valor: ConstantesService.ESTADO_VALORACION_MENOS_VALORACION,
      mensaje: ConstantesService.MENSAJE_VALORACION_MENOS_VALORACION,
      icono: ConstantesService.ICONO_VALORACION_MENOS_VALORACION,
    },
  ];

  //
  ngOnInit(): void {
    this.newCommunityPost = new CommunityPost();
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      message: ['', Validators.required],
      image: [''],
    });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comunidadEsDelUsuarioLogueado = false;
      this.puedeEnviarSolicitud = false;
      this.solicitudEstaEnEspera = false;
      this.solicitudEstaActiva = false;
      this.solicitudEstaDenegada = false;
      this.banderaMostrarPosts = false;
      this.privacidad = false;
      this.cargarComunidad();
    });

    this.filtrosForm = this.formBuilder.group({
      fechaInicial: [''],
      fechaFinal: [''],
      usuario: ['', Validators.maxLength(200)],
      tipoValoracion: [''],
    });
  }

  verificarPrivacidad(): boolean {
    if (this.comunity.privacidad === ConstantesService.COMUNITY_PRIVADO) {
      if (this.comunidadEsDelUsuarioLogueado) {
        this.banderaMostrarPosts = true;
      } else if (this.solicitudEstaActiva) {
        this.banderaMostrarPosts = true;
      } else {
        this.banderaMostrarPosts = false;
        this.communityPostList = [];
        this.usersInCommunityList = [];
      }
    } else {
      this.banderaMostrarPosts = true;
    }

    return this.banderaMostrarPosts;
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
        post.id
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

  /**
   * Calcula el numero de caracteres del comentario
   * @param e
   * @param post
   */
  onKeyComment(e: Event, post: CommunityPost) {
    const element = e.currentTarget as HTMLInputElement;
    post.caracteresDeComentario = element.value.length;
  }

  async cargarComunidad() {
    this.comunityAssign = new ComunityAssign();
    this.comunity = new Comunity();
    this.user = new User();
    var idComunidad: string | null = this.route.snapshot.paramMap.get('id');
    //var idComunidad="20"
    //Ver si hay una sesion, de no haber sesion mandarlo al inicio
    //Si hay sesion buscar el usuario
    //Ver si la comunidad es del usuario(Dependiendo si es del usuario o no apareceran ciertos botones
    if (this.sessionService.exitSession() && idComunidad) {
      if (idComunidad) {
        console.log('EXISTE SESION Y EL ID DE COMUNIDAD');
        var y: number = +idComunidad;
        this.comunity.id = y;

        await this.verificarOpcionesParaComunidad();

        await this.verificarPrivacidad();
      }
    } else {
      console.log('VOY A REDIRIGIR');
      this.redirection.navigate(['inicio']);
    }
  }
  asignarPrivacidad(dato: any) {
    if (dato == ConstantesService.COMUNITY_PRIVADO) {
      this.privacidad = true;
    } else {
      this.privacidad = false;
    }
  }
  asignarPrivacidadBooleanAString(dato: boolean) {
    if (dato) {
      this.comunity.privacidad = ConstantesService.COMUNITY_PRIVADO;
    } else {
      this.comunity.privacidad = ConstantesService.COMUNITY_PUBLICO;
    }
  }

  cambiarPrivacidadComunidad() {
    this.asignarPrivacidadBooleanAString(this.privacidad);
    this.guardarComunidad(this.user);
  }
  guardarComunidad(aux: User) {
    //Creamos el JSON
    this.dataService.saveComunity(this.comunity, aux).subscribe(
      (response) => {},
      (error) => {
        alert('ERROR: ' + error);
      }
    );
  }
  verificarOpcionesParaComunidad(): boolean {
    this.dataService
      .getUserByToken(this.sessionService.getUserWithToken())
      .subscribe((response) => {
        this.user = response;
        //Buscando la comunidad para ver si es del usuario
        this.dataService
          .findComunityById(this.comunity, this.user)
          .subscribe((response) => {
            this.comunityAssign = response; //Tengo a la comunidad y al usuario que la creo
            // console.log("Comunity:::::: ", response);
            if (response.comunity) {
              this.comunity = response.comunity;
              this.asignarPrivacidad(this.comunity.privacidad);
              this.verificarPrivacidad();
            }

            this.loadImageCommunity();
            this.getAllCommunityPost(); //es privado
            this.getAllUsersInCommunity(); //es privado
            //Siel registroAcadmico de la comunidad que se recibio es igual al registroAcademico de usuario, es su comunidad
            if (
              this.comunityAssign.user?.registroAcademico ===
              this.user.registroAcademico
            ) {
              //Solo mostrar el boton de crear Publicacion
              this.comunidadEsDelUsuarioLogueado = true;
            } else {
              //La comunidad no es del usuario, por lo tanto es MIEMBRO(ENVIO SOLICITUD) | NO HA ENVIADO SOLICITUD
              //Se tiene que buscar si exite una solicitud de comunidad
              if (response.comunity) {
                var comSend = this.generarComunidad(
                  response.comunity,
                  this.user.registroAcademico
                );
                this.dataService
                  .findSuscriptionComunity(
                    comSend,
                    this.sessionService.getUserWithToken()
                  )
                  .subscribe(
                    (response) => {
                      console.log('Comunidad del usuarioooo:', response);
                      this.asignarEstadoDeSolicitud(response);
                    },
                    (error) => {
                      console.log('PUEDO ENVIAR UNA SOLICITUD EN ERROR');
                      this.puedeEnviarSolicitud = true;
                    }
                  );
              }
            }
          });
      });
    return true;
  }

  asignarEstadoDeSolicitud(comunityAssign: ComunityAssign) {
    if (comunityAssign.estado) {
      //al enviar solicitud tiene un estado(ESPERA,ACTIVO,DENEGADO )
      console.log('ESTADOOOO', comunityAssign.estado);
      var estado: String = comunityAssign.estado;
      if (estado === 'ESPERA') {
        console.log('ES ESPERA');
        this.solicitudEstaActiva = false;
        this.solicitudEstaEnEspera = true;
        this.solicitudEstaDenegada = false;
      } else if (estado === 'ACTIVO') {
        this.solicitudEstaActiva = true;
        this.solicitudEstaEnEspera = false;
        this.solicitudEstaDenegada = false;
      } else {
        this.solicitudEstaActiva = false;
        this.solicitudEstaEnEspera = false;
        this.solicitudEstaDenegada = true;
      }
    } else {
      //Puede enviar una solicitud
      console.log('PUEDO ENVIAR UNA SOLICITUD');
      this.puedeEnviarSolicitud = true;
    }
  }

  dibujarImagen() {
    return this.encabezadoFoto + this.comunity.datosFoto;
  }

  getImage(image: string) {
    return this.encabezadoFoto + image;
  }

  solicitarUnionAComunidad() {
    console.log('REALIZANDO SOLICITUD A COMUNIDAD');
    var comAssing: ComunityAssign = new ComunityAssign();
    if (this.comunityAssign.comunity) {
      comAssing = this.generarComunidad(
        this.comunityAssign.comunity,
        this.user.registroAcademico
      );
    }

    this.dataService
      .saveComunityAssign(comAssing, this.sessionService.getUserWithToken())
      .subscribe((response) => {
        console.log('GUARDADNDO SOLICITUD', response);
        this.solicitudEstaActiva = false;
        this.solicitudEstaEnEspera = true;
        this.solicitudEstaDenegada = false;
        this.puedeEnviarSolicitud = false;
      });
  }

  generarComunidad(com: Comunity, registroAcademico: any): ComunityAssign {
    var comunityAssign: ComunityAssign = new ComunityAssign();
    var idCommunityAssign: IdComunityAssign = new IdComunityAssign();
    var user: User = new User();
    var comunidad: Comunity = new Comunity();
    //Id
    idCommunityAssign.idComunidad = com.id;
    idCommunityAssign.registroAcademico = registroAcademico;
    comunityAssign.idComunityAssign = idCommunityAssign;
    //User
    user.registroAcademico = registroAcademico;
    comunityAssign.user = user;
    //Comunity
    comunidad.id = com.id;
    comunityAssign.comunity = comunidad;
    //Tipo
    comunityAssign.tipo = 'MIEMBRO';
    //Estado
    comunityAssign.estado = 'ESPERA';

    return comunityAssign;
  }

  async eliminarComunidad() {
    var dato = await this.modal.openModal(
      'ELIMINAR COMUNIDAD PARA SIEMPRE',
      'ESTAS SEGURO QUE DESEAS ELIMINAR LA COMUNIDAD: ' +
        this.comunity.nombre +
        ', NO PODRAS RECUPERARLA NUNCA MAS',
      'ELIMINACION PERMANENTE UNA VEZ SE CONFIRME',
      true
    );
    if (dato) {
      let filtrosEnviar = new IdComunityAssign();
      filtrosEnviar.idComunidad = this.comunity.id;

      this.comunidadService
        .deleteComunity(
          this.sessionService.getUserWithToken().token,
          filtrosEnviar
        )
        .subscribe(
          (mensaje) => {
            this.modal.openModal(
              'Comunidad eliminada:' + this.comunity.nombre,
              mensaje.mensaje + '',
              '',
              false
            );
            this.redirection.navigate(['dashboard/showComunitys']);
          },
          (error) => {
            this.modal.openModal(
              'Error con comunidad:' + this.comunity.nombre,
              error.error.mensaje + '',
              '',
              false
            );
            this.redirection.navigate(['dashboard/showComunitys']);
          }
        );
    }
  }

  verSolicitudes() {
    this.redirection.navigate(['comunityRequest', this.comunity.id]);
  }

  get courseName() {
    return this.comunity.course?.nombre ? this.comunity.course.nombre : null;
  }

  userName(usr: User | undefined) {
    return usr?.nombreCompleto ? usr.nombreCompleto : null;
  }

  loadImageCommunity() {
    if (this.comunity.datosFoto) {
      this.styleBackgroundImageCommunity =
        encabezadoFoto + this.comunity.datosFoto + finalFoto;
    } else {
      this.styleBackgroundImageCommunity = defaultPicture;
    }
  }

  getAllCommunityPost() {
    let search: OrdinaryObject = {
      numberParam: this.comunity.id,
      stringParam: this.user.registroAcademico,
    };
    this.dataService
      .getAllCommunityPostByCommunity(search, this.user)
      .subscribe((data) => {
        this.communityPostList = data;
      });
  }

  getAllUsersInCommunity() {
    let search: OrdinaryObject = {
      numberParam: this.comunity.id,
    };
    this.dataService
      .getAllUsersInCommunity(search, this.user)
      .subscribe((data) => {
        this.usersInCommunityList = data;
      });
  }

  get f() {
    return this.postForm.controls;
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

  onSubmit(title: string, message: string) {
    console.log('ON SUBMIT');
    this.newCommunityPost.title = title;
    this.newCommunityPost.message = message;
    this.saveCommunityPost();
  }

  saveCommunityPost() {
    this.alertClosedDanger = false;
    this.alertClosedSuccess = false;
    if (!this.postForm.invalid) {
      this.persistCommunityPost();
    } else {
      this.alertClosedDanger = true;
    }
  }

  persistCommunityPost() {
    this.newCommunityPost.comunity = this.comunity;
    this.newCommunityPost.user = this.user;
    if (this.fileList) {
      const data = new FormData();
      data.append('file', this.fileList[0]);
      this.uploadFileService
        .uploadCommunityPostImage(data, this.user)
        .subscribe((response) => {
          this.newCommunityPost.photo = response.photo;
          this.uploadCommunityPost();
        });
    } else {
      this.uploadCommunityPost();
    }
  }

  uploadCommunityPost() {
    this.restoreForm();
    // console.log("post::: ", this.newCommunityPost);
    this.dataService
      .persistCommunityPost(this.newCommunityPost, this.user)
      .subscribe(
        (response) => {
          this.getAllCommunityPost();
          this.alertClosedSuccess = true;
          this.restoreForm();
        },
        (reason) => {
          this.alertClosedDanger = true;
        }
      );
  }

  restoreForm() {
    this.postForm.reset();
    this.quitarFoto();
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.fileList = event.target.files;

      const file: File = event.target.files[0];
      const reader = new FileReader();
      this.imagenCargada = file.name;
      reader.readAsDataURL(file);
    }
  }

  quitarFoto() {
    this.imagenCargada = '';
    this.f.image.reset();
    this.fileList = null;
  }

  verMiembrosDeComunidad() {
    this.redirection.navigate(['unsuscribeMembers', this.comunity.id]);
  }

  async salirDeComunidad() {
    var dato = await this.modal.openModal(
      'SALIRME DE LA COMUNIDAD PARA SIEMPRE',
      'ESTAS SEGURO QUE DESEAS SALIRTE DE LA COMUNIDAD: ' +
        this.comunity.nombre +
        ', NO PODRAS INTERACTUAR CON NADA DE LA COMUNIDAD EN CUESTION, TENDRAS QUE VOLVER A ENVIAR SOLICITUD PARA UNIRTE SI QUISIERAS',
      'SE SALDRA DE LA COMUNIDAD UNA VEZ SE CONFIRME',
      true
    );
    if (dato) {
      let filtrosEnviar = new IdComunityAssign();
      filtrosEnviar.idComunidad = this.comunity.id;
      filtrosEnviar.registroAcademico = this.user.registroAcademico;

      this.comunidadService
        .deleteUserFromComunity(
          this.sessionService.getUserWithToken().token,
          filtrosEnviar
        )
        .subscribe(
          (mensaje) => {
            this.modal.openModal(
              'Se salio de la comunidad:' + this.comunity.nombre,
              mensaje.mensaje + '',
              '',
              false
            );
            this.redirection.navigate(['dashboard']);
          },
          (error) => {
            this.modal.openModal(
              'Error al salirse de la comunidad:' + this.comunity.nombre,
              error.error.mensaje + '',
              '',
              false
            );
            this.redirection.navigate(['dashboard']);
          }
        );
    }
  }
  ////////////////

  /**
   * Recalcula el rated para un post de una comunidad
   * @param comunityPost
   * @param operacion
   */
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

  /**
   * Actualiza la valoracion del usuario y el rated del post de la comunidad
   * @param comunityPost
   */
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
            .subscribe((data) => {});
        } else {
          //Actualizacion
          this.voteService
            .updateValoration(valoration, user)
            .subscribe((data) => {});
        }
      });
  }

  /**
   * Accion que se realiza al darle click al boton de Valoracio positiva(Flecha para arriba)
   * @param comunityPost
   */
  upvote(comunityPost: CommunityPost) {
    //Metodo que cree el like
    var isCreate: boolean;
    if (this.comunidadEsDelUsuarioLogueado || this.solicitudEstaActiva) {
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
    }
  }

  goToUserProfile(usr: User) {
    this.redirection.navigate(['userProfile', usr.registroAcademico]);
  }

  downvote(comunityPost: CommunityPost) {
    //Metodo que cree el dislike
    var isCreate: boolean;
    if (this.comunidadEsDelUsuarioLogueado || this.solicitudEstaActiva) {
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
    }
  }

  filtrarPublicaciones(values: any) {
    console.log(values);

    let search = {
      idComunidad: this.comunity.id,
      registroAcademico: this.user.registroAcademico,
      fechaInicial: this.fechasService.validarCampoYConvertirFecha(
        values.fechaInicial
      ),
      fechaFinal: this.fechasService.validarCampoYConvertirFecha(
        values.fechaFinal
      ),
      usuario: values.usuario,
      valoracion: values.tipoValoracion,
    };

    console.log(search);
    this.dataService
      .getAllCommunityPostByCommunityWithFilters(search, this.user)
      .subscribe((data) => {
        this.communityPostList = data;
      });
  }

  borrarCampos() {
    this.filtrosForm.reset();
    this.filtrosForm.controls['usuario'].setValue('');
    this.filtrosForm.controls['fechaInicial'].setValue('');
    this.filtrosForm.controls['fechaFinal'].setValue('');
    this.filtrosForm.controls['tipoValoracion'].setValue('');
  }
}
