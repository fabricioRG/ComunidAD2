import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from 'src/app/components/active-modal/active-modal.component';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { IdComunityAssign } from 'src/app/models/idComunityAssign.model';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { FiltrarSolicitudesComunidadService } from 'src/app/services/filtrar-solicitudes-comunidad/filtrar-solicitudes-comunidad.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-request-comunity',
  templateUrl: './request-comunity.component.html',
  styleUrls: ['./request-comunity.component.css']
})
export class RequestComunityComponent implements OnInit {

  constructor(private redirection: Router,private route:ActivatedRoute, 
    private _modalService: NgbModal,
    private dataService : DataService, private sessionService: SesionService,private filtrarAsignacionesComunidad: FiltrarSolicitudesComunidadService) { 
    this.ESTADO_ACTIVO = ConstantesService.COMUNITY_ASIGN_ACTIVO
    this.ESTADO_DENEGADO = ConstantesService.COMUNITY_ASIGN_DENEGADO
    this.cargarDatos()

  }
  user : User;
  comunityAssign : ComunityAssign;
  comunityAssignList : any;
  comunidadEsDelUsuarioLogueado : boolean;
  comunity : Comunity;
  displayedColumns: string[] = ['registroAcademico', 'nombreCompleto','fechaCreacion','estado'];

  //variables para filtrar los datos
  fechaInicial:'';
  fechaFinal:'';
  registroAcademico:'';
  ESTADO_ACTIVO:string;
  ESTADO_DENEGADO:string;

  ngOnInit(): void {
    
  }


  cargarDatos(){
    this.comunityAssign = new ComunityAssign();
    this.comunity = new Comunity();
    this.user = new User();
    var idComunidad:string | null=this.route.snapshot.paramMap.get('id')
    if(this.sessionService.exitSession() && idComunidad){
      if(idComunidad){
        var y : number =+idComunidad;
          this.comunity.id=y;
        this.verificarSiComunidadEsDelUsurioLogueado();
      }
    }else{
      this.redirection.navigate(['inicio']);
    }
  }

  verificarSiComunidadEsDelUsurioLogueado(){
    this.dataService.getUserByToken(this.sessionService.getUserWithToken()).subscribe(response =>{
      this.user =response;
      //Buscando la comunidad para ver si es del usuario
      this.dataService.findComunityById(this.comunity,this.user).subscribe(response =>{
        this.comunityAssign=response;
        if(response.comunity){
          this.comunity=response.comunity;
        }
        console.log("EN VISTA ES",response)
        if(response.user?.registroAcademico===this.user.registroAcademico){//Siel registroAcadmico de la comunidad que se recibio es igual al registroAcademico de usuario, es su comunidad
          this.comunidadEsDelUsuarioLogueado=true;
        }else{
          this.comunidadEsDelUsuarioLogueado=false;
        }
      })
    })
  }

  buscarPorFiltros(){
    console.log(this.fechaInicial)
    console.log(this.fechaFinal)
    console.log(this.registroAcademico)
    if(this.registroAcademico == null){
      this.registroAcademico = ''
    }
    let filtrosEnviar = new IdComunityAssign();
    filtrosEnviar.idComunidad = this.comunity.id;
    filtrosEnviar.registroAcademico = this.registroAcademico
    console.log('ENviare: ')
    console.log(filtrosEnviar)
    return this.filtrarAsignacionesComunidad.getAsignacionesComunidad(this.sessionService.getUserWithToken().token,filtrosEnviar)
    .subscribe(data => {
      console.log("asignaciones: ", data)
      this.comunityAssignList = data;
      
    });
  }

  aprobarSolicitud(elemento : any){

    const modal = this._modalService.open(ActiveModalComponent);
    modal.componentInstance.modalHeader = "Aceptar Solicitud"
    modal.componentInstance.modalBodyTitle = '¿Estás seguro que deseas Aprobar la solicitud del usuario: '+elemento.user.registroAcademico+'?';
    modal.componentInstance.modalBody = 'Si aceptas se cambiara el estado del usuario a: '+ConstantesService.COMUNITY_ASIGN_ACTIVO;
    modal.componentInstance.confirmModal = true;
    modal.result.then((result) => {
      var updateRequest = elemento;
      updateRequest.estado = ConstantesService.COMUNITY_ASIGN_ACTIVO
      this.filtrarAsignacionesComunidad.actualizarEstadoAsignacionesComunidad(this.sessionService.getUserWithToken().token,updateRequest).subscribe(
        (comunityAsign) => {
          elemento = comunityAsign
          this.mostrarMensaje("Actualizacion correcta de la Aceptacion de la solicitud","Se completo correctamente la solicitud de "+elemento.user.registroAcademico,"La solicitud ahora esta: "+ConstantesService.COMUNITY_ASIGN_ACTIVO);
          this.buscarPorFiltros()
        },
        (error) => {
          this.mostrarMensaje("Error al actualizar aceptacion de la solicitud","No se pudo completar la solicitud de cambio",error);
        }
      );
      
    }, (reason) => {
      this.mostrarMensaje("No se acepto la Aceptacion de la solicitud","No se pudo completar la solicitud de cambio","No aceptado");
    });

  }

  denegarSolicitud(elemento : any){
    const modal = this._modalService.open(ActiveModalComponent);
    modal.componentInstance.modalHeader = "Denegar Solicitud"
    modal.componentInstance.modalBodyTitle = '¿Estás seguro que deseas denegar la solicitud del usuario: '+elemento.user.registroAcademico+'?';
    modal.componentInstance.modalBody = 'Si aceptas se cambiara el estado del usuario a: '+ConstantesService.COMUNITY_ASIGN_DENEGADO;
    modal.componentInstance.confirmModal = true;
    modal.result.then((result) => {
      var updateRequest = elemento;
      updateRequest.estado = ConstantesService.COMUNITY_ASIGN_DENEGADO
      this.filtrarAsignacionesComunidad.actualizarEstadoAsignacionesComunidad(this.sessionService.getUserWithToken().token,updateRequest).subscribe(
        (comunityAsign) => {
          elemento = comunityAsign
          this.mostrarMensaje("Actualizacion correcta de la denegacion de la solicitud","Se completo correctamente la solicitud de "+elemento.user.registroAcademico,"La solicitud ahora esta:"+ConstantesService.COMUNITY_ASIGN_DENEGADO);
          this.buscarPorFiltros()
        },
        (error) => {
          this.mostrarMensaje("Error al actualizar denegacion de la solicitud","No se pudo completar la solicitud de cambio",error);
        }
      );
      
    }, (reason) => {
      this.mostrarMensaje("No se acepto la denegacion de la solicitud","No se pudo completar la solicitud de cambio","No aceptado");
    });
  }


    mostrarMensaje(modalHeader:string, modalBodyTitle:string, mensaje: any):void{
      const modal = this._modalService.open(ActiveModalComponent);
        modal.componentInstance.modalHeader = modalHeader;
        modal.componentInstance.modalBodyTitle = modalBodyTitle
        modal.componentInstance.modalBody = mensaje;
        modal.componentInstance.infoModal = true;
    }
  

  
}
