import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantesHtmlService {

  constructor() { }

  public static MENSAJE_PERFIL_PUBLICO = 'PERFIL PUBLICO';
  public static MENSAJE_PERFIL_PRIVADO = 'PERFIL PRIVADO';
}



