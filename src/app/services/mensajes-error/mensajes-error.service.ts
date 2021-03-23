import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajesErrorService {

  constructor() { }


  public static ERROR_FECHA_MAYOR_ACTUAL = 'La fecha de nacimiento no puede ser mayor o igual a la fecha actual\n'
  public static ERROR_CONTRASENAS_NO_COINCIDEN= 'Las contrasenas no coinciden\n'


  agregarMensajeError(_contador: any, _mensajes: string, _error: string) {
    _mensajes = _mensajes + _contador + '.-' + _error;
    return _mensajes;
  }
}
