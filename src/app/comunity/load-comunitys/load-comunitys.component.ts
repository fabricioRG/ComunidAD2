import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-load-comunitys',
  templateUrl: './load-comunitys.component.html',
  styleUrls: ['./load-comunitys.component.css']
})
export class LoadComunitysComponent implements OnInit {


  constructor(private sesionService: SesionService,private dataService : DataService,private router: Router) { 
    this.cargarComunidades()
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
        console.log(comunitys)
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



}
