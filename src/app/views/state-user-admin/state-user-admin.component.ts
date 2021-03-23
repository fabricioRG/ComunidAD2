import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { DataService } from 'src/app/data.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { FiltrarUsuariosService } from 'src/app/services/filtrar-usuarios/filtrar-usuarios.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-state-user-admin',
  templateUrl: './state-user-admin.component.html',
  styleUrls: ['./state-user-admin.component.css']
})
export class StateUserAdminComponent implements OnInit {

  users$: Observable<User[]>;
  usrs: any;
  filtrosForm: FormGroup;
  token: any;
  displayedColumns: string[] = ['registroAcademico', 'nombreCompleto','estado'];
  ESTADO_ACTIVO: string;
  ESTADO_INACTIVO: string;
  estadoAntiguo:string;

  constructor( private _builder: FormBuilder , private filtrarService: FiltrarUsuariosService, private dataService: DataService,private _modalService: NgbModal) { 
    this.ESTADO_ACTIVO = ConstantesService.ESTADO_USUARIO_ACTIVO
    this.ESTADO_INACTIVO = ConstantesService.ESTADO_USUARIO_INACTIVO
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.token = JSON.parse(this.token).token;

    this.filtrosForm = this._builder.group({
      numeroCarnet: [
        '',
        [
          
        ],
      ],
    });
  }

  

  filtrarUsuarios(values: any){
    if(values.numeroCarnet == null){
      values.numeroCarnet = ''
    }
    return this.filtrarService.getUsuarios(this.token,values)
    .subscribe(data => {
      console.log("users: ", data)
      this.usrs = data;
      console.log("data:",this.usrs)
      
    });
}


cambiarEstadoUsuario(value: any,estado:string){
  const modal = this._modalService.open(ActiveModalComponent);

  modal.componentInstance.modalHeader = 'Cambiar Estado del usuario: '+value.nombreCompleto;
  modal.componentInstance.modalBodyTitle = '¿Estás seguro que deseas cambiar el estado del usuario?';
  modal.componentInstance.modalBody = 'Si aceptas se cambiara el estado del usuario a: '+estado;
  modal.componentInstance.confirmModal = true;

  modal.result.then((result) => {
    this.estadoAntiguo = value.estado
    value.estado = estado
    this.dataService.updateAnyUser(value,this.token).subscribe(
      (user) => {
        this.mostrarMensaje('USUARIO ' + value.nombreCompleto + ' ACTUALIZADO CON EXITO')
        this.estadoAntiguo = ''
      },
      (error) => {
        value.estado = this.estadoAntiguo
        this.mostrarError(error.error,1)
      }
    );
    
  }, (reason) => {
    
  });









  
}

mostrarError(mensajesError: any, contadorErrores: number): void{
  const modal = this._modalService.open(ActiveModalComponent);
    modal.componentInstance.modalHeader = 'ERROR';
    modal.componentInstance.modalBodyTitle = 'Error al cambiar el estado del usuario';
    modal.componentInstance.modalBody = mensajesError + '\n TOTAL DE ERRORES: ' + contadorErrores;
    modal.componentInstance.infoModal = true;
  
}

mostrarMensaje(mensaje: any):void{
  const modal = this._modalService.open(ActiveModalComponent);
    modal.componentInstance.modalHeader = 'Cambio Exitoso';
    modal.componentInstance.modalBodyTitle = 'Se completo el cambio de estado del usuario';
    modal.componentInstance.modalBody = mensaje;
    modal.componentInstance.infoModal = true;
}









  

   
  
  

}
