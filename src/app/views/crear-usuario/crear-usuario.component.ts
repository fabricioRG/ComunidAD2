import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { DataService } from 'src/app/data.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
})
export class CrearUsuarioComponent implements OnInit {
  users$: User = new User();
  signupForm!: FormGroup;
  ESTADO_USUARIO_ACTIVO = 'ACTIVO';
  ROL_USUARIO_NORMAL = 'COMUNIDAD';
  TOKEN_NULO = null;
  FOTO_PERFIL = 'FOTO';
  REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}/;

  constructor(
    private _builder: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.signupForm = this._builder.group({
      numeroCarnet: [
        '',
        [
          Validators.required,
          Validators.max(999999999),
          Validators.min(100000000),
        ],
      ],
      departamento: ['', [Validators.required, Validators.maxLength(45)]],
      correoElectronico: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(255)],
      ],
      estado: [this.ESTADO_USUARIO_ACTIVO],
      fechaNacimiento: ['', [Validators.required]],
      fotoPerfil: [this.FOTO_PERFIL],
      genero: ['M', [Validators.required]],
      nombreCompleto: ['', [Validators.required, Validators.maxLength(200)]],
      contrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(this.REGEX_PASSWORD),
        ],
      ],
      repetirContrasena: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern(this.REGEX_PASSWORD),
        ],
      ],
      rolUsuario: [this.ROL_USUARIO_NORMAL],
      token: [this.TOKEN_NULO],
    });
    return this.dataService
      .getUsers()
      .subscribe((data) => (this.users$ = data));
  }
  title = 'angular-trials';
  enviar(values: any) {
    var mensajesError = '';
    var contadorErrores = 0;
    var send = true;
    console.log(values);

    if (values.contrasena != values.repetirContrasena) {
      contadorErrores++;
      mensajesError = this.agregarMensajeError(
        contadorErrores,
        mensajesError,
        'Las contrasenas no coinciden\n'
      );
      send = false;
    }
    console.log('Fecha nacimiento: ' + values.fechaNacimiento);
    console.log('Fecha actual: ' + new Date());
    if (
      !this.compararFechas(this.convertirFecha(new Date(values.fechaNacimiento)),this.convertirFecha(new Date()))
    ) {
      contadorErrores++;
      mensajesError = this.agregarMensajeError(
        contadorErrores,
        mensajesError,
        'La fecha de nacimiento no puede ser mayor o igual a la fecha actual\n'
      );
      send = false;
    }

    if (send) {
      console.log(
        'Esta fecha nacimiento es: ' +
          this.convertirFecha(values.fechaNacimiento)
      );
      var usuario = new User();

      usuario.ciudad = values.departamento;
      usuario.correoElectronico = values.correoElectronico;
      usuario.estado = values.estado;
      usuario.fechaDeNacimiento = this.convertirFecha(values.fechaNacimiento);
      usuario.fotoDePerfil = values.fotoPerfil;
      usuario.genero = values.genero;
      usuario.nombreCompleto = values.nombreCompleto;
      usuario.password = values.contrasena;
      usuario.registroAcademico = String(values.numeroCarnet);
      usuario.rolUsuario = values.rolUsuario;
      usuario.token = values.token;

      this.dataService.addNewUser(usuario).subscribe(
        (user) => {
          alert('USUARIO ' + user.nombreCompleto + ' CREADO CON EXITO');
        },
        (error) => {
          alert('ERROR: ' + error.error);
        }
      );
    } else {
      alert(mensajesError + '\n TOTAL DE ERRORES: ' + contadorErrores);
    }

    //console.log(values)
    //console.log(String(values.numeroCarnet).length)
  }

  convertirFecha(date: Date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    if (month < 10) {
      if (day < 10) {
        return `${year}-0${month}-0${day}`;
      } else {
        return `${year}-0${month}-${day}`;
      }
    } else {
      if (day < 10) {
        return `${year}-${month}-0${day}`;
      } else {
        return `${year}-${month}-${day}`;
      }
    }
  }
  agregarMensajeError(_contador: any, _mensajes: string, _error: string) {
    _mensajes = _mensajes + _contador + '.-' + _error;
    return _mensajes;
  }
 
  compararFechas(fechaNacimiento: string, fechaActual: string) {
    var dateNac = new Date(fechaNacimiento)
    var dateActual = new Date(fechaActual)
    dateNac.setTime(dateNac.getTime()+21600000)
    dateActual.setTime(dateActual.getTime()+21600000)

    21600000
    console.log('comparandoFechas sin formato: ');
    console.log('Nacimiento: '+ fechaNacimiento);
    console.log('Actual'+ fechaActual);
    
    console.log('comparandoFechas Con formato: ');
    console.log('Nacimiento: '+dateNac);
    console.log('Actual: '+dateActual);
    if (
      dateNac.getTime() >= dateActual.getTime()
    ) {
      return false;
    } else {
      return true;
    }
  }

  imprimirValor() {
    console.log(this.users$);
  }
}
