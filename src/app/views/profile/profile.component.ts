import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { LoginService } from 'src/app/services/login/login.service';
import { User } from 'src/app/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { ModalService } from 'src/app/services/modal/modal.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  token: any = '';
  usuario: User = new User();
  banderaEstadoActivo = true;

  constructor(private dataService: DataService, public validacionURL: LoginService, private constantesService: ConstantesService, private _modalService: NgbModal, private _modalPropio: ModalService, public sessionService: SesionService) {
    this.token = localStorage.getItem('token');
    if (this.token != null) {
      this.token = JSON.parse(this.token).token
    }
  }

  ngOnInit(): void {
    var aux = new User();
    aux.token = this.token;
    console.log(aux.token)
    this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        console.log(user)
        this.usuario = user;
        console.log("se obtuvo: ")
        console.log(this.usuario)
        if (user.estado == "INACTIVO") {
          this.banderaEstadoActivo = false
        }
      },
      (error) => {
        console.log(error);
      }
    );
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
    console.log("entre modal")
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

}
