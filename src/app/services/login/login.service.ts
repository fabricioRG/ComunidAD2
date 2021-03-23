import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private dataService : DataService,private router:Router) { }

  pruebaRuta(){
    console.log("PRUEBA RUTAA");
    if(!this.dataService.getLoggedIn()){//Si no hay session que redirija
      this.router.navigate(['inicio']);
      return false;
    }
      return true;
    
  }
}



