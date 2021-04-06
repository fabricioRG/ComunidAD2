import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from 'src/app/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';

const encabezadoFoto = "url(data:image/jpeg;base64,";
const finalFoto = ")"
const defaultPicture = "url('https://bootdey.com/img/Content/avatar/avatar7.png')";
const defaultPicture2 = "url('https://happytravel.viajes/wp-content/uploads/2020/04/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png')";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  token: any = '';
  usuario: User = new User();
  banderaEstadoActivo = true;
  styleBackgroundImage = "";

  constructor(private dataService: DataService, public validacionURL: LoginService,
    private constantesService: ConstantesService, private _modalService: NgbModal, private _modalPropio: ModalService,
    public sessionService: SesionService, private uploadFileService: UploadFileServiceService) {
    this.token = this.sessionService.getToken();
    // this.loadImageProfile();
  }

  ngOnInit(): void {
    this.updateUser();
  }

  updateUser() {
    var aux = new User();
    aux.token = this.token;
    this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        this.usuario = user;
        if (user.estado == "INACTIVO") {
          this.banderaEstadoActivo = false
        }
        this.loadImageProfile();
      },
      (error) => {
      }
    );
  }


  loadImageProfile() {
    if (this.usuario.datosFoto) {
      this.styleBackgroundImage = encabezadoFoto + this.usuario.datosFoto + finalFoto;
    } else {
      this.styleBackgroundImage = defaultPicture;
    }
  }

  mensajeEstadoBoton(): String {
    if (this.usuario.estado == ConstantesService.ESTADO_USUARIO_ACTIVO) {
      return ConstantesService.ESTADO_USUARIO_INACTIVO
    } else {
      return ConstantesService.ESTADO_USUARIO_ACTIVO
    }
  }

  cambiarEstado() {
    const modal = this._modalService.open(ActiveModalComponent);
    modal.componentInstance.modalHeader = "CONFIRMACION DE CAMBIO";
    modal.componentInstance.modalBodyTitle = "A";
    modal.componentInstance.modalBody = "ESTAS SEGURO DE REALIZAR EL CAMBIO DE ESTADO A ";
    modal.componentInstance.confirmModal = true;

    modal.result.then((result) => {
      this.usuario.estado = this.obtenerEstadoString()
      this.dataService.updateUser(this.usuario).subscribe(
        (user) => {
          this.mostrarMensaje('USUARIO ' + this.usuario.nombreCompleto + ' ACTUALIZADO CON EXITO')

        },
        (error) => {
          this.usuario.estado = this.revertirEstado()
          this.mostrarError(error.error, 1)
        }
      );
    }, (reason) => {
    });
  }

  mostrarError(mensajesError: any, contadorErrores: number): void {
    this._modalPropio.openModal("ERROR EN CAMBIO DE ESTADO DE USUARIO", mensajesError + '\n TOTAL DE ERRORES: ' + contadorErrores, "NO APROBADO", false)

  }

  mostrarMensaje(mensaje: any): void {
    this._modalPropio.openModal("CAMBIO DE ESTADO DE USUARIO CORRECTO", mensaje, "APROBADO", false)
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
    let usr = this.usuario;
    if (fileList) {
      data.append('file', fileList[0]);
      this.uploadFileService.uploadProfileUserImage(data, user)
        .subscribe((resp) => {
          usr.fotoDePerfil = resp.fotoDePerfil;
          this.dataService.updateUser(usr)
            .subscribe((response) => {
              this.updateUser();
            });
          this.llamarModal("Proceso exitoso", "Imagen Cambiada", "Se ha cambiado y guardado correctamente la imagen de perfil");
        },
        (error) => {
          this.llamarModal("Proceso erroneo","Imagen no actualizada", "Han ocurrido errores para actualizar la imagen de perfil")
        })
    }
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
