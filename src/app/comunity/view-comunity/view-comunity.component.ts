import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, ParamMap } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { OrdinaryObject } from 'src/app/helpers/ordinary-object.model';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { CommunityPost } from 'src/app/models/comunityPost.model';
import { Course } from 'src/app/models/course.model';
import { IdComunityAssign } from 'src/app/models/idComunityAssign.model';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { User } from 'src/app/user.model';
import { LoadComunitysComponent } from '../load-comunitys/load-comunitys.component';

const encabezadoFoto = "url(data:image/jpeg;base64,";
const finalFoto = ")"
const defaultPicture = "";

@Component({
  selector: 'app-view-comunity',
  templateUrl: './view-comunity.component.html',
  styleUrls: ['./view-comunity.component.css'],
})
export class ViewComunityComponent implements OnInit {

  constructor(private redirection: Router, private route: ActivatedRoute, private uploadFileService: UploadFileServiceService,
    private dataService: DataService, private sessionService: SesionService, private formBuilder: FormBuilder, private modal: ModalService, private comunidadService: FiltrarSolicitudesComunidadService) {
    this.cargarComunidad();
  }

  user: User;
  comunityAssign: ComunityAssign;
  comunidadEsDelUsuarioLogueado: boolean;
  puedeEnviarSolicitud: boolean;
  comunity: Comunity;
  styleBackgroundImageCommunity = "";
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
  alertClosedSuccess = false;
  alertClosedDanger = false;
  disableCreateCommunityPost = false;

  ngOnInit(): void {
    this.newCommunityPost = new CommunityPost();
    this.postForm = this.formBuilder
      .group({
        title: ['', Validators.required],
        message: ['', Validators.required],
        image: ['']
      });
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.comunidadEsDelUsuarioLogueado = false;
      this.puedeEnviarSolicitud = false;
      this.solicitudEstaEnEspera = false;
      this.solicitudEstaActiva = false;
      this.solicitudEstaDenegada = false;
      this.cargarComunidad()
    })
  }


  cargarComunidad() {
    this.comunityAssign = new ComunityAssign();
    this.comunity = new Comunity();
    this.user = new User();
    var idComunidad: string | null = this.route.snapshot.paramMap.get('id');
    //var idComunidad="20"
    console.log("JAXD",this.route.snapshot.paramMap.get('id'))
    console.log('ID COMUNIDAD ESCOGIDA', idComunidad);
    //Ver si hay una sesion, de no haber sesion mandarlo al inicio
    //Si hay sesion buscar el usuario
    //Ver si la comunidad es del usuario(Dependiendo si es del usuario o no apareceran ciertos botones
    if (this.sessionService.exitSession() && idComunidad) {
      if (idComunidad) {
        console.log('EXISTE SESION Y EL ID DE COMUNIDAD');
        var y: number = +idComunidad;
        this.comunity.id = y;
        this.verificarOpcionesParaComunidad();
      }
    } else {
      console.log("VOY A REDIRIGIR")
      this.redirection.navigate(['inicio']);
    }
    
  }

  verificarOpcionesParaComunidad() : boolean{
    this.dataService.getUserByToken(this.sessionService.getUserWithToken()).subscribe(response => {
      this.user = response;
      console.log("USUARIO get token:", this.user)
      //Buscando la comunidad para ver si es del usuario
      this.dataService.findComunityById(this.comunity, this.user).subscribe(response => {
        this.comunityAssign = response;//Tengo a la comunidad y al usuario que la creo
        // console.log("Comunity:::::: ", response);
        if (response.comunity) {
          this.comunity = response.comunity;
        }
        this.loadImageCommunity();
        this.getAllCommunityPost();
        this.getAllUsersInCommunity();
        //Siel registroAcadmico de la comunidad que se recibio es igual al registroAcademico de usuario, es su comunidad
        if (this.comunityAssign.user?.registroAcademico === this.user.registroAcademico) {
          //Solo mostrar el boton de crear Publicacion
          this.comunidadEsDelUsuarioLogueado = true;
        } else {//La comunidad no es del usuario, por lo tanto es MIEMBRO(ENVIO SOLICITUD) | NO HA ENVIADO SOLICITUD
          //Se tiene que buscar si exite una solicitud de comunidad
          if (response.comunity) {
            var comSend = this.generarComunidad(response.comunity, this.user.registroAcademico)
            this.dataService.findSuscriptionComunity(comSend, this.sessionService.getUserWithToken()).subscribe(
              (response) => {
                console.log("Comunidad del usuarioooo:", response)
                this.asignarEstadoDeSolicitud(response)
              },
              (error) => {
                console.log("PUEDO ENVIAR UNA SOLICITUD EN ERROR")
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
    return (this.comunity.course?.nombre) ? this.comunity.course.nombre : null
  }

  userName(usr: User | undefined) {
    return (usr?.nombreCompleto) ? usr.nombreCompleto : null
  }

  loadImageCommunity() {
    if (this.comunity.datosFoto) {
      this.styleBackgroundImageCommunity = encabezadoFoto + this.comunity.datosFoto + finalFoto;
    } else {
      this.styleBackgroundImageCommunity = defaultPicture;
    }
  }

  getAllCommunityPost() {
    let search: OrdinaryObject = {
      numberParam: this.comunity.id
    }
    this.dataService.getAllCommunityPostByCommunity(search, this.user)
      .subscribe(data => {
        this.communityPostList = data;
      });
  }

  getAllUsersInCommunity() {
    let search: OrdinaryObject = {
      numberParam: this.comunity.id
    }
    this.dataService.getAllUsersInCommunity(search, this.user)
      .subscribe(data => {
        this.usersInCommunityList = data;
      });
  }

  get f() { return this.postForm.controls; }

  getFormatedTime(time: string | undefined) {
    let d = new Date(time!);
    var datestring = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " +
      d.getHours() + ":" + d.getMinutes();
    return datestring;
  }

  onSubmit(title: string, message: string) {
    console.log('ON SUBMIT')
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
      const data = new FormData()
      data.append('file', this.fileList[0])
      this.uploadFileService.uploadCommunityPostImage(data, this.user)
        .subscribe((response) => {
          this.newCommunityPost.photo = response.photo;
          this.uploadCommunityPost();
        })
    } else {
      this.uploadCommunityPost();
    }
  }

  uploadCommunityPost() {
    this.restoreForm();
    // console.log("post::: ", this.newCommunityPost);
    this.dataService.persistCommunityPost(this.newCommunityPost, this.user)
      .subscribe((response) => {
        this.getAllCommunityPost();
        this.alertClosedSuccess = true;
        this.restoreForm();
      }, (reason) => {
        this.alertClosedDanger = true;
      });
  }

  restoreForm() {
    this.postForm.reset();
    this.quitarFoto();
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.fileList = event.target.files;

      const file: File = event.target.files[0];
      const reader = new FileReader()
      this.imagenCargada = file.name;
      reader.readAsDataURL(file)

    }
  }

  quitarFoto() {
    this.imagenCargada = '';
    this.f.image.reset();
    this.fileList = null;
  }

  verMiembrosDeComunidad() {
    this.redirection.navigate(['unsuscribeMembers', this.comunity.id])
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
}
