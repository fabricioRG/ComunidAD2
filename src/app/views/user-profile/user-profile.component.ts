import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { DataService } from 'src/app/data.service';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { User } from 'src/app/user.model';

const encabezadoFoto = "url(data:image/jpeg;base64,";
const finalFoto = ")"
const defaultPicture = "url('https://bootdey.com/img/Content/avatar/avatar7.png')";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private redirection: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private sessionService: SesionService,
    private _modalPropio: ModalService,
    private _modalService: NgbModal,
    private uploadFileService: UploadFileServiceService
  ) { }

  user: User;
  actualUser: User;
  token: any = '';
  styleBackgroundImage = "";
  banderaEstadoActivo = true;

  //Comunidades
  comunidades: ComunityAssign[];
  encabezadoFoto: string = 'data:image/jpeg;base64,';
  usuarioTieneComunidades: boolean;
  profileOwner = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.token = this.sessionService.getToken();
      this.loadUser();
    })
  }

  loadUser() {
    this.profileOwner = false;
    this.user = new User();
    this.actualUser = new User();
    let idUser: string | null = this.route.snapshot.paramMap.get('id');
    if (this.sessionService.exitSession() && idUser) {
      if (idUser) {
        this.actualUser.registroAcademico = idUser;
        this.getUserInfo();
      }
    } else {
      this.redirection.navigate(['inicio']);
    }
  }

  getUserInfo() {
    this.dataService
      .getUserByToken(this.sessionService.getUserWithToken())
      .subscribe((response) => {
        this.user = response;
        //Buscando la comunidad para ver si es del usuario
        this.dataService.findUserById(this.actualUser, this.user).subscribe(
          (data) => {
            this.actualUser = data;
            if (this.actualUser.registroAcademico == this.user.registroAcademico) {
              this.profileOwner = true;
            }
            this.loadImageProfile();
            this.getCommunitys();
          },
          (error) => {
            this.redirection.navigate(['inicio']);
          }
        );
      });
  }

  getCommunitys() {
    this.comunidades = [];
    var user: User = this.sessionService.getUserWithToken();
    user.registroAcademico = this.actualUser.registroAcademico;
    this.dataService.findUserComunitys(this.actualUser).subscribe(
      (response) => {
        this.comunidades = response;
        if (this.comunidades.length == 0) {
          this.usuarioTieneComunidades = false;
        } else {
          this.usuarioTieneComunidades = true;
        }
      },
      (error) => {
        this.usuarioTieneComunidades = false;
        console.log(error);
      }
    );
  }

  verComunidad(id: number | undefined) {
    if (id) {
      //this.selectedComunity = comunity;
      this.redirection.navigate(['viewComunity', id]);
      console.log('ID ESCOGIDAAAAAAA:', id);
    } else {
      console.log('NOU');
    }
  }

  getImage(datosFoto: any): string {
    if (datosFoto === null) {
      return this.encabezadoFoto + datosFoto;
    }
    return this.encabezadoFoto + datosFoto;
  }

  loadImageProfile() {
    if (this.actualUser.datosFoto) {
      this.styleBackgroundImage = encabezadoFoto + this.actualUser.datosFoto + finalFoto;
    } else {
      this.styleBackgroundImage = defaultPicture;
    }
  }

  obtenerEstadoString(): string {
    if (this.banderaEstadoActivo) {
      this.banderaEstadoActivo = !this.banderaEstadoActivo
      return ConstantesService.ESTADO_USUARIO_INACTIVO
    } else {
      this.banderaEstadoActivo = !this.banderaEstadoActivo
      return ConstantesService.ESTADO_USUARIO_ACTIVO
    }
  }


  revertirEstado(): string {
    if (this.banderaEstadoActivo) {
      this.banderaEstadoActivo = !this.banderaEstadoActivo
      return ConstantesService.ESTADO_USUARIO_ACTIVO
    } else {
      this.banderaEstadoActivo = !this.banderaEstadoActivo
      return ConstantesService.ESTADO_USUARIO_INACTIVO
    }
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {

      var reader = new FileReader();

      reader.onload = (event) => { // called once readAsDataURL is completed

      }

      var rlt = reader.readAsDataURL(event.target.files[0]);
      const files = event.target.files;

      var aux = new User();
      aux.token = this.token;

      this.updateProfileUserImage(aux, files);

    }
  }

  updateProfileUserImage(user: User, fileList: FileList) {
    const data = new FormData();
    var aux = new User();
    aux.token = this.token;
    let usr = this.user;
    if (fileList) {
      data.append('file', fileList[0]);
      this.uploadFileService.uploadProfileUserImage(data, user)
        .subscribe((resp) => {
          usr.fotoDePerfil = resp.fotoDePerfil;
          this.dataService.updateUser(usr)
            .subscribe((response) => {
              this.loadUser()
            });
          this.llamarModal("Proceso exitoso", "Imagen Cambiada", "Se ha cambiado y guardado correctamente la imagen de perfil");
        },
          (error) => {
            this.llamarModal("Proceso erroneo", "Imagen no actualizada", "Han ocurrido errores para actualizar la imagen de perfil")
          })
    }
  }

  cambiarEstado() {
    if (this.profileOwner) {
      const modal = this._modalService.open(ActiveModalComponent);
      modal.componentInstance.modalHeader = "CONFIRMACION DE CAMBIO";
      modal.componentInstance.modalBodyTitle = "A";
      modal.componentInstance.modalBody = "ESTAS SEGURO DE REALIZAR EL CAMBIO DE ESTADO A ";
      modal.componentInstance.confirmModal = true;

      modal.result.then((result) => {
        this.user.estado = this.obtenerEstadoString()
        this.dataService.updateUser(this.user).subscribe(
          (response) => {
            this.mostrarMensaje('USUARIO ' + this.user.nombreCompleto + ' ACTUALIZADO CON EXITO')

          },
          (error) => {
            this.user.estado = this.revertirEstado()
            this.mostrarError(error.error, 1)
          }
        );
      }, (reason) => {
      });
    }
  }

  mostrarError(mensajesError: any, contadorErrores: number): void {
    this._modalPropio.openModal("ERROR EN CAMBIO DE ESTADO DE USUARIO", mensajesError + '\n TOTAL DE ERRORES: ' + contadorErrores, "NO APROBADO", false)

  }

  mostrarMensaje(mensaje: any): void {
    this._modalPropio.openModal("CAMBIO DE ESTADO DE USUARIO CORRECTO", mensaje, "APROBADO", false)
  }

  async changeUserPrivacy() {
    if (this.profileOwner) {
      let header = "Cambiar privacidad";
      let body = "¿Estas seguro que deseas cambiar la privacidad de la cuenta?";
      let title = "Cambiar estado a ";
      let confirmType = true;
      if (this.user.privacidad == ConstantesService.USER_PRIVACY_PUBLICO) {
        title += ConstantesService.USER_PRIVACY_PRIVADO;
      } else {
        title += ConstantesService.USER_PRIVACY_PUBLICO
      }
      var result = await this.showConfirmMessage(header, body, title, confirmType);
      if (result) {
        if (this.user.privacidad == ConstantesService.USER_PRIVACY_PUBLICO) {
          this.user.privacidad = ConstantesService.USER_PRIVACY_PRIVADO;
        } else {
          this.user.privacidad = ConstantesService.USER_PRIVACY_PUBLICO;
        }
        this.dataService.updateUser(this.user)
          .subscribe((resp) => {
            this.mostrarMensaje("Se ha cambiado correctamente la privacidad de la cuenta");
            this.loadUser();
          }, (reason) => {
            this.mostrarError(reason, 1);
          })
      }
    }
  }

  goToEditProfile(){
    this.redirection.navigate(['editProfile']);
  }

  get userStateText() {
    if (this.actualUser.estado == ConstantesService.ESTADO_USUARIO_ACTIVO) {
      return ConstantesService.ESTADO_USUARIO_ACTIVO
    } else {
      return ConstantesService.ESTADO_USUARIO_INACTIVO
    }
  }

  get userStateIcon() {
    if (this.actualUser.estado == ConstantesService.ESTADO_USUARIO_ACTIVO) {
      return ConstantesService.ICON_CHECK_CIRCLE_OUTLINE;
    } else {
      return ConstantesService.ICON_CANCEL;
    }
  }

  get userPrivacyText() {
    if (this.actualUser.privacidad == ConstantesService.USER_PRIVACY_PUBLICO) {
      return ConstantesService.USER_PRIVACY_PUBLICO
    } else {
      return ConstantesService.USER_PRIVACY_PRIVADO
    }
  }

  get userPrivacyIcon() {
    if (this.actualUser.privacidad == ConstantesService.USER_PRIVACY_PUBLICO) {
      return ConstantesService.ICON_PUBLIC;
    } else {
      return ConstantesService.ICON_LOCK;
    }
  }

  get userGenderText() {
    if(this.actualUser.genero == ConstantesService.USER_GENDER_M){
      return ConstantesService.USER_GENDER_MASCULINO;
    } else if (this.actualUser.genero == ConstantesService.USER_GENDER_F){
      return ConstantesService.USER_GENDER_FEMENINO;
    } else {
      return ConstantesService.USER_GENDER_SIN_ESPECIFICAR;
    }
  }

  get userGenderIcon() {
    if(this.actualUser.genero == ConstantesService.USER_GENDER_M){
      return ConstantesService.ICON_MALE;
    } else if (this.actualUser.genero == ConstantesService.USER_GENDER_F){
      return ConstantesService.ICON_FEMALE;
    } else {
      return ConstantesService.ICON_HELP;
    }
  }

  get userRolIcon(){
    if(this.actualUser.rolUsuario == ConstantesService.USER_ROL_SUPER){
      return ConstantesService.ICON_ADMIN_PANEL_SETTINGS;
    } else if (this.actualUser.rolUsuario == ConstantesService.USER_ROL_COMUNIDAD){
      return ConstantesService.ICON_MANAGE_ACCOUNTS;
    } else if (this.actualUser.rolUsuario == ConstantesService.USER_ROL_NORMAL){
      return ConstantesService.ICON_GROUPS;
    } else {
      return ConstantesService.ICON_HELP;
    }
  }

  getFormatedTime(time: string | undefined) {
    let d = new Date(time!);
    var datestring = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear()
    return datestring;
  }

  async showConfirmMessage(header: any, title: any,
    body: any, typeConfirm: boolean): Promise<boolean> {
    return await this._modalPropio.openModal(header, title, body, typeConfirm);
  }

  llamarModal(header: String, bodyTitle: String, body: String) {
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = header;
    modal.componentInstance.modalBodyTitle = bodyTitle;
    modal.componentInstance.modalBody = body;
    modal.componentInstance.infoModal = true;

    modal.result.then((result) => {
    }, (reason) => {
    });

  }

}
