import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SesionService } from 'src/app/services/sesion/sesion.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent {


  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private sesionService: SesionService) { }

  //Roles
  verificarSesionSuperUsuario(): boolean {
     if (!this.sesionService.exitSession() || !this.sesionService.usuarioEsAdministradorDeSistema()) {//Si no hay session que redirija
      return false;
    }
    return true;
  }

  verificarSesionUsuarioComunidad(): boolean {
    if (!this.sesionService.exitSession() || !this.sesionService.usuarioEsAdministradorDeComunidad()) {//Si no hay session que redirija
      return false;
    }
    return true;
  }

    verificarSesionAndAdminSistema():boolean {
      if (!this.sesionService.exitSession() || !this.sesionService.usuarioEsAdministradorDeSistema()){//Si no hay session que redirija
        return false;
      }
      return true;
    }
}
