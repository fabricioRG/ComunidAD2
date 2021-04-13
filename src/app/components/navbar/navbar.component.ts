import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/data.service';
import { SesionService } from 'src/app/services/sesion/sesion.service';
import { FormControl, FormGroup } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { User } from 'src/app/user.model';
import { OrdinaryObject } from 'src/app/helpers/ordinary-object.model';
import { Router } from '@angular/router';

interface option {
  value?: string,
  viewValue?: string
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  token: any;
  userId: string;
  formControl: FormControl;

  sesion$: Observable<boolean>;
  existeSession: boolean;
  control = new FormControl();
  searchInput = '';

  resultList: User[];
  resultListSearch: option[];
  filteredResultList: Observable<User[]>;

  category = new FormControl();
  categoryList: string[] = ['Usuario', 'Comunidad'];
  selectedCategory = this.categoryList[0];


  constructor(private dataService: DataService, private sesionService: SesionService, private router: Router) {
    this.existeSession = sesionService.exitSession();
  }


  ngOnInit(): void {
    //Estas acciones solo las realiza cuando ocurre un cambio en la variable
    this.sesion$ = this.sesionService.loggedIn$();//Lo convertimos en observador
    this.sesion$.subscribe(isSuscribe => {
      if (isSuscribe) {//isSuscribe nos devolvera el valor de la vaeable booleana, es decir la bariable observable
        this.dataService.getUserByToken(this.sesionService.getUserWithToken()).subscribe(response => {
          var user = response;
          this.sesionService.asignarTipoDeUsuarioConSesion(user);
          this.existeSession = true;
          ////////////

          this.token = localStorage.getItem('token');
          this.token = JSON.parse(this.token).token;
          
          ///////////
        })
        //POST->Usuario
      } else {
        this.sesionService.asignarTipodeUsuarioSinSesion();
        this.existeSession = false;
      }
    });

    this.filteredResultList = this.control.valueChanges.pipe(
      startWith(''),
    );
  }

  logOut() {
    this.sesionService.log0ut();
  }

  //Roles
  usuarioEsSuscriptor(): boolean {
    return this.sesionService.usuarioEsSuscriptor();
  }

  usuarioEsAdministradorDeSistema(): boolean {
    return this.sesionService.usuarioEsAdministradorDeSistema();
  }

  usuarioEsAdministradorDeComunidad(): boolean {
    return this.sesionService.usuarioEsAdministradorDeComunidad();
  }

  updateResultList() {
    if (this.selectedCategory == this.categoryList[0]) {
      var aux = new User();
      aux.token = this.token;
      let search: OrdinaryObject = {
        stringParam: this.searchInput
      }
      this.dataService.getUsersBySearch(search, aux)
        .subscribe(data => {
          this.resultListSearch = [];
          data.forEach(dt => {
            var opt: option = {
              value: dt.registroAcademico,
              viewValue: dt.nombreCompleto
            }
            this.resultListSearch.push(opt)
          })
        });
    } else if (this.selectedCategory == this.categoryList[1]) {
      var aux = new User();
      aux.token = this.token;
      let search: OrdinaryObject = {
        stringParam: this.searchInput
      }
      this.dataService.getCommunitiesBySearch(search, aux)
        .subscribe(data => {
          this.resultListSearch = [];
          data.forEach(dt => {
            var opt: option = {
              value: dt.id?.toString(),
              viewValue: dt.nombre
            }
            this.resultListSearch.push(opt);
          })
        })
    }

  }

  selectUser(rst: option) {
    if (this.selectedCategory == this.categoryList[0]) {
      this.searchInput = rst.viewValue!;
      this.router.navigate(['userProfile', rst.value]);
    } else if (this.selectedCategory == this.categoryList[1]) {
      this.searchInput = rst.viewValue!;
      this.router.navigate(['viewComunity', rst.value]);
    }
  }

  onKey(event: any) {
    // console.log(this.searchInput);
    if (!this.token) {
      this.token = localStorage.getItem('token');
      this.token = JSON.parse(this.token).token;
    }
    this.updateResultList();
    // console.log("Result:::: ",this.resultListSearch);
  }

  goToPageUserProfile(){
    this.dataService
      .getUserByToken(this.sesionService.getUserWithToken())
      .subscribe((response) => {
        this.router.navigate(['userProfile', response.registroAcademico]);
      });
  }

}
