import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { ConstantesHtmlService } from 'src/app/services/constantes/constantes-html.service';
import { ConstantesService } from 'src/app/services/constantes/constantes.service';
import { FechasService } from 'src/app/services/fechas/fechas.service';
import { InicializacionUsuarioService } from 'src/app/services/inicializacion-usuario/inicializacion-usuario.service';
import { MensajesErrorService } from 'src/app/services/mensajes-error/mensajes-error.service';

import { User } from 'src/app/user.model';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  PRIVACIDAD_PUBLICA = ConstantesService.PRIVACIDAD_INICIAL
  PRIVACIDAD_PRIVADA = ConstantesService.PRIVACIDAD_PRIVADA
  MENSAJE_PERFIL_PUBLICO = ConstantesHtmlService.MENSAJE_PERFIL_PUBLICO
  MENSAJE_PERFIL_PRIVADO = ConstantesHtmlService.MENSAJE_PERFIL_PRIVADO
  token: any;
  usuario: User = new User();
  signupForm!: FormGroup;

  constructor( private _builder: FormBuilder,private dataService: DataService,private fechasServices: FechasService,
    private inicializarUsuario: InicializacionUsuarioService, private mensajesError:MensajesErrorService, public a: ConstantesService) {
    this.token = localStorage.getItem('token');
    this.token = JSON.parse(this.token).token
   }

  ngOnInit(): void {
    this.iniciarFormulario()
    this.obtenerUsuario()
  }


  obtenerUsuario():void{
    var aux = new User();
    aux.token = this.token;
    console.log(aux.token)
    this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        console.log(user)
        this.usuario = user;
        console.log("se obtuvo: ")
        console.log(this.usuario)
        this.iniciarFormulario()
      },
      (error) => {
        console.log(error);
        
      }
    );
  }


  enviar(values: any) {
    var confirmacion = confirm("¿Seguro que deseas actualizar los datos?");
    if(confirmacion == true){
    var mensajesError = '';
    var contadorErrores = 0;
    var send = true;
    console.log(values);
    console.log('Fecha nacimiento: ' + values.fechaNacimiento);
    console.log('Fecha actual: ' + new Date());
    if (
      !this.fechasServices.compararFechas(this.fechasServices.convertirFecha(new Date(values.fechaNacimiento)),this.fechasServices.convertirFecha(new Date()))
    ) {
      contadorErrores++;
      mensajesError = this.mensajesError.agregarMensajeError(
        contadorErrores,
        mensajesError,
        MensajesErrorService.ERROR_FECHA_MAYOR_ACTUAL
      );
      send = false;
    }
    if (send) {
      this.realizarEnvio(values)
    } else {
      this.mostrarError(mensajesError,contadorErrores)
    }
  }

  }

  mostrarError(mensajesError: any, contadorErrores: number): void{
    alert(mensajesError + '\n TOTAL DE ERRORES: ' + contadorErrores);
  }

  mostrarMensaje(mensaje: any):void{
    alert(mensaje)
  }

  realizarEnvio(values: any): void{
    var usuario = this.inicializarUsuario.asignarCamposEdicionUsuario(this.usuario,values);
    
    
    this.dataService.updateUser(usuario).subscribe(
      (user) => {
        this.mostrarMensaje('USUARIO ' + usuario.nombreCompleto + ' ACTUALIZADO CON EXITO')
      },
      (error) => {
        this.mostrarError(error.error,1)
      }
    );
  }


  
  iniciarFormulario(): void{
    this.signupForm = this._builder.group({
      departamento: [this.usuario.ciudad, [Validators.required, Validators.maxLength(45)]],
      correoElectronico: [
        this.usuario.correoElectronico,
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      fechaNacimiento: [this.usuario.fechaDeNacimiento, [Validators.required]],
      genero: [this.usuario.genero, [Validators.required]],
      nombreCompleto: [this.usuario.nombreCompleto, [Validators.required, Validators.maxLength(200)]],
      privacidad: [this.usuario.privacidad, Validators.required]
    });
  }

  
 
 
  

 

}
