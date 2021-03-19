import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';
import { LoadComunitysComponent } from '../load-comunitys/load-comunitys.component';

@Component({
  selector: 'app-view-comunity',
  templateUrl: './view-comunity.component.html',
  styleUrls: ['./view-comunity.component.css']
})
export class ViewComunityComponent implements OnInit {

  constructor(private redirection: Router,private route:ActivatedRoute, private dataService : DataService, private sessionService: SesionService) { 
    this.cargarComunidad()
  }

  user : User;
  comunity : Comunity;
  comunidadEsDelUsuarioLogueado : boolean;

  //Constante para la imagen
  encabezadoFoto : string="data:image/jpeg;base64,";


  ngOnInit(): void {
  }


  cargarComunidad(){
    this.comunity = new Comunity();
    this.user = new User();
    var idComunidad:string | null=this.route.snapshot.paramMap.get('id')
    console.log("ID COMUNIDAD ESCOGIDA",idComunidad)
    //Ver si hay una sesion, de no haber sesion mandarlo a la pinga
    //Si hay sesion buscar el usuario
    //Ver si la comunidad es del usuario(Dependiendo si es del usuario o no apareceran ciertos botones
    if(this.sessionService.exitSession() && idComunidad){
      if(idComunidad){
        console.log("EXISTE SESION Y EL ID DE COMUNIDAD")
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
        var comResponse : Comunity = response;
        this.comunity=comResponse;
        if(comResponse.user?.registroAcademico===this.user.registroAcademico){//Siel registroAcadmico de la comunidad que se recibio es igual al registroAcademico de usuario, es su comunidad
          this.comunidadEsDelUsuarioLogueado=true;
        }else{
          this.comunidadEsDelUsuarioLogueado=false;
        }
      })
    })
  }


  dibujarImagen(){
    return this.encabezadoFoto+this.comunity.datosFoto;
  }

}
