import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  sesion$: Observable<boolean>;
  existeSession: boolean;




  constructor(private dataService: DataService, private sesionService: SesionService) {
    console.log("CONSTRUCTOR" + dataService.getLoggedIn());
    this.existeSession = sesionService.exitSession();

  }


  ngOnInit(): void {
    //Estas acciones solo las realiza cuando ocurre un cambio en la variable
    console.log("sdasdf" + this.existeSession);
    this.sesion$ = this.sesionService.loggedIn$();//Lo convertimos en observador
    this.sesion$.subscribe(isSuscribe => {
      if (isSuscribe) {//isSuscribe nos devolvera el valor de la vaeable booleana, es decir la bariable observable
        this.dataService.getUserByToken(this.sesionService.getUserWithToken()).subscribe(response => {
          var user=response;
          this.sesionService.asignarTipoDeUsuarioConSesion(user);
          this.existeSession=true;
        })
        //POST->Usuario
      } else {
        this.sesionService.asignarTipodeUsuarioSinSesion();
        this.existeSession=false;
      }
      console.log("Sucribe:" + isSuscribe);
      console.log("LocalStorage:" + localStorage.getItem('token'));
    })

  }

  logOut() {
    this.sesionService.log0ut();
  }

  //Roles
  usuarioEsSuscriptor() : boolean{
    return this.sesionService.usuarioEsSuscriptor();
  }

  usuarioEsAdministradorDeSistema() : boolean{
    return this.sesionService.usuarioEsAdministradorDeSistema();
  }

  usuarioEsAdministradorDeComunidad() : boolean{
    return this.sesionService.usuarioEsAdministradorDeComunidad();
  }
}
