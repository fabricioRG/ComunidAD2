import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { Comunity } from 'src/app/models/comunity.model';
import { ComunityAssign } from 'src/app/models/comunityAssign.model';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-load-comunitys',
  templateUrl: './load-comunitys.component.html',
  styleUrls: ['./load-comunitys.component.css']
})
export class LoadComunitysComponent implements OnInit {

  //COMUNIDADES
  comunidades : ComunityAssign[];
  encabezadoFoto : string="data:image/jpeg;base64,";
  //
  private selectedComunity : Comunity | null;

  constructor(private sesionService: SesionService,private dataService : DataService,private router: Router) { 
    this.cargarComunidades()
    this.selectedComunity=null;
  }

  ngOnInit(): void {

  }

  cargarComunidades(){
    //Primero recuperamos el usuario de la sesion
    var user: User=this.sesionService.getUserWithToken();
    this.dataService.getUserByToken(user).subscribe(response => {
      user = response;
      //Ahora se recupera las comunidades del usuario
      this.dataService.findComunytyByRegistroAcademico(user).subscribe(
        (comunitys) =>{
        console.log("MIS COMUNIDADES")
        this.comunidades=comunitys;
        console.log(this.comunidades)
      })
    })

  }

  //Verificando sesion(Solo se puede ver para usuario de comunidad o super usuario)
  verificarSesionUsuarioComunidad(): boolean {
    if (!this.sesionService.exitSession() || !this.sesionService.usuarioEsAdministradorDeComunidad()) {//Si no hay session que redirija
      this.router.navigate(['inicio']);
      return false;
    }
    return true;
  }

  getImage(datosFoto : any):string{
    if(datosFoto===null){
      return this.encabezadoFoto+datosFoto;
    }
    return this.encabezadoFoto+datosFoto;
  }

  //Metodo para ver la comunidad(La idea es que redirija a otra pagina donde aparece la comunidad)
  verComunidad(id : number | undefined){
    if(id){
      //this.selectedComunity = comunity;
      this.router.navigate(['viewComunity',id]);
      console.log("ID ESCOGIDAAAAAAA:",id)
    }

  }

  


}
