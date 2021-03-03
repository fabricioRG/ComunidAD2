import { Injectable } from '@angular/core';
import { User } from 'src/app/user.model';
import { FechasService } from '../fechas/fechas.service';

@Injectable({
  providedIn: 'root'
})
export class InicializacionUsuarioService {

  constructor(private fechasServices: FechasService) { }


  inicializarValoresUsuario(values: any): User {
    var usuario = new User();
      usuario.ciudad = values.departamento;
      usuario.correoElectronico = values.correoElectronico;
      usuario.estado = values.estado;
      usuario.fechaDeNacimiento = this.fechasServices.convertirFecha(values.fechaNacimiento);
      usuario.fotoDePerfil = values.fotoPerfil;
      usuario.genero = values.genero;
      usuario.nombreCompleto = values.nombreCompleto;
      usuario.password = values.contrasena;
      usuario.registroAcademico = String(values.numeroCarnet);
      usuario.rolUsuario = values.rolUsuario;
      usuario.token = values.token;
      usuario.privacidad = values.privacidad;
      return usuario;
  }


  asignarCamposEdicionUsuario(usuario: User,values: any): User{
      usuario.ciudad = values.departamento
      usuario.correoElectronico = values.correoElectronico
      usuario.fechaDeNacimiento = values.fechaNacimiento
      usuario.genero = values.genero
      usuario.nombreCompleto = values.nombreCompleto
      usuario.privacidad = values.privacidad
      return usuario;
  }
}
