import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConstantesService {
  constructor() {}

  public static ESTADO_USUARIO_ACTIVO = 'ACTIVO';
  public static ESTADO_USUARIO_INACTIVO = 'INACTIVO';
  public static ROL_USUARIO_NORMAL = 'COMUNIDAD';
  public static TOKEN_NULO = null;
  public static PRIVACIDAD_INICIAL = 'PUBLICO';
  public static FOTO_PERFIL = 'FOTO';
  public static REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,30}/;

  //USERS
  public static PRIVACIDAD_PRIVADA = 'PRIVADO';
  public static PRIVACIDAD_PUBLICA = 'PUBLICA';

  //CONSTANTES DE COMUNITY ASIGN
  public static COMUNITY_ASIGN_ESPERA = 'ESPERA';
  public static COMUNITY_ASIGN_ACTIVO = 'ACTIVO';
  public static COMUNITY_ASIGN_DENEGADO = 'DENEGADO';

  //USER
  public static USER_PRIVACY_PRIVADO = 'PRIVADO';
  public static USER_PRIVACY_PUBLICO = 'PUBLICO';
  public static USER_GENDER_M = 'M';
  public static USER_GENDER_F = 'F';
  public static USER_GENDER_N = 'N';
  public static USER_GENDER_MASCULINO = 'MASCULINO';
  public static USER_GENDER_FEMENINO = 'FEMENINO';
  public static USER_GENDER_SIN_ESPECIFICAR = 'SIN ESPECIFICAR';
  public static USER_ROL_SUPER = 'SUPER';
  public static USER_ROL_COMUNIDAD = 'COMUNIDAD';
  public static USER_ROL_NORMAL = 'NORMAL';

  //ICONS
  public static ICON_PUBLIC = 'public';
  public static ICON_LOCK = 'lock';
  public static ICON_CHECK_CIRCLE_OUTLINE = 'check_circle_outline';
  public static ICON_CANCEL = 'cancel';
  public static ICON_EMAIL = 'email';
  public static ICON_APARTMENT = 'apartment';
  public static ICON_ASSIGNMENT_IND = 'assignment_ind';
  public static ICON_FEMALE = 'female';
  public static ICON_MALE = 'male';
  public static ICON_HELP = 'help';
  public static ICON_ADMIN_PANEL_SETTINGS = 'admin_panel_settings';
  public static ICON_MANAGE_ACCOUNTS = 'manage_accounts';
  public static ICON_GROUPS = 'groups';
  public static ICON_CAKE = 'cake';

  public static COMUNITY_PUBLICO = 'PUBLICO';
  public static COMUNITY_PRIVADO = 'PRIVADO';

  //FILTROS
  public static ESTADO_VALORACION_SIN_VALORACION = 'SIN_VALORACION';
  public static ESTADO_VALORACION_MAS_VALORACION = 'MAS_VALORACION';
  public static ESTADO_VALORACION_MENOS_VALORACION = 'MENOS_VALORACION';

  public static ICONO_VALORACION_SIN_VALORACION = 'do_not_disturb';
  public static ICONO_VALORACION_MAS_VALORACION = 'arrow_upward';
  public static ICONO_VALORACION_MENOS_VALORACION = 'arrow_downward';

  public static MENSAJE_VALORACION_SIN_VALORACION = 'NINGUNO';
  public static MENSAJE_VALORACION_MAS_VALORACION = 'CON MAS VALORACION';
  public static MENSAJE_VALORACION_MENOS_VALORACION = 'CON MENOS VALORACION';
}
