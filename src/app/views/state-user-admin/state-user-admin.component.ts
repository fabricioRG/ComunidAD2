import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { DataService } from 'src/app/data.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { FiltrarUsuariosService } from 'src/app/services/filtrar-usuarios/filtrar-usuarios.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-state-user-admin',
  templateUrl: './state-user-admin.component.html',
  styleUrls: ['./state-user-admin.component.css'],
})
export class StateUserAdminComponent implements OnInit {
  users$: Observable<User[]>;
  usrs: any;
  filtrosForm: FormGroup;
  token: any;
  displayedColumns: string[] = [
    'registroAcademico',
    'nombreCompleto',
    'estado',
  ];
  ESTADO_ACTIVO: string;
  ESTADO_INACTIVO: string;
  estadoAntiguo: string;

  constructor(
    private _builder: FormBuilder,
    private filtrarService: FiltrarUsuariosService,
    private dataService: DataService,
    private _modalService: NgbModal,
    private _modal: ModalService
  ) {
    this.ESTADO_ACTIVO = ConstantesService.ESTADO_USUARIO_ACTIVO;
    this.ESTADO_INACTIVO = ConstantesService.ESTADO_USUARIO_INACTIVO;
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.token = JSON.parse(this.token).token;

    this.filtrosForm = this._builder.group({
      numeroCarnet: ['', []],
    });
  }

  filtrarUsuarios(values: any) {
    if (values.numeroCarnet == null) {
      values.numeroCarnet = '';
    }
    return this.filtrarService
      .getUsuarios(this.token, values)
      .subscribe((data: any) => {
        console.log('users: ', data);
        this.usrs = data;
        console.log('data:', this.usrs);
      });
  }

  async cambiarEstadoUsuario(value: any, estado: string) {
    var modalHeader = 'Cambiar Estado del usuario: ' + value.nombreCompleto;
    var modalBodyTitle =
      '¿Estás seguro que deseas cambiar el estado del usuario?';
    var modalBody = 'Si aceptas se cambiara el estado del usuario a: ' + estado;
    var confirmModal = true;

    var resultado = await this._modal.openModal(
      modalHeader,
      modalBody,
      modalBodyTitle,
      confirmModal
    );
    if (resultado) {
      this.estadoAntiguo = value.estado;
      value.estado = estado;
      this.dataService.updateAnyUser(value, this.token).subscribe(
        (user: any) => {
          this.mostrarMensaje(
            'USUARIO ' + value.nombreCompleto + ' ACTUALIZADO CON EXITO'
          );
          this.estadoAntiguo = '';
        },
        (error: any) => {
          value.estado = this.estadoAntiguo;
          this.mostrarError(error.error, 1);
        }
      );
    }
  }

  async mostrarError(
    mensajesError: any,
    contadorErrores: number
  ): Promise<void> {
    //const modal = this._modalService.open(ActiveModalComponent);
    var modalHeader = 'ERROR';
    var modalBodyTitle = 'Error al cambiar el estado del usuario';
    var modalBody = mensajesError + '\n TOTAL DE ERRORES: ' + contadorErrores;
    var confirmModal = false;

    var resultado = await this._modal.openModal(
      modalHeader,
      modalBody,
      modalBodyTitle,
      confirmModal
    );
  }

  async mostrarMensaje(mensaje: any): Promise<void> {
    //const modal = this._modalService.open(ActiveModalComponent);
    var modalHeader = 'Cambio Exitoso';
    var modalBodyTitle = 'Se completo el cambio de estado del usuario';
    var modalBody = mensaje;
    var confirmModal = false;
    var resultado = await this._modal.openModal(
      modalHeader,
      modalBody,
      modalBodyTitle,
      confirmModal
    );
  }
}
