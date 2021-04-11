import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantesService {

  constructor() { }


  public static ESTADO_USUARIO_ACTIVO = 'ACTIVO';
  public static ESTADO_USUARIO_INACTIVO = 'INACTIVO';
  public static ROL_USUARIO_NORMAL = 'COMUNIDAD';
  public static TOKEN_NULO = null;
  public static PRIVACIDAD_INICIAL = 'PUBLICO';
  public static FOTO_PERFIL = 'FOTO';
  public static REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}/;


  public static PRIVACIDAD_PRIVADA = 'PRIVADO';
  public static PRIVACIDAD_PUBLICA = 'PUBLICA';

  //CONSTANTES DE COMUNITY ASIGN
  public static COMUNITY_ASIGN_ESPERA = 'ESPERA';
  public static COMUNITY_ASIGN_ACTIVO = 'ACTIVO';
  public static COMUNITY_ASIGN_DENEGADO = 'DENEGADO';

  //USER
  public static USER_PRIVACY_PRIVADO = 'PRIVADO';
  public static USER_PRIVACY_PUBLICO = 'PUBLICO';
  
  //ICONS
  public static ICON_PUBLIC = 'public';
  public static ICON_LOCK = 'lock';
  public static ICON_CHECK_CIRCLE_OUTLINE = 'check_circle_outline';
  public static ICON_CANCEL = 'cancel';

}
