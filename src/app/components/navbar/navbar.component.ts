import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {


  token$: Observable<boolean>;
  verTablero: boolean;
  
  constructor(private dataService: DataService) { 
    this.verTablero=dataService.getLoggedIn();

  }

  ngOnInit(): void {
    this.token$=this.dataService.isLoggedIn();//Estas acciones solo las realiza cuando ocurre un cambio en la variable
    this.token$.subscribe(isSuscribe=>{
      if(isSuscribe){
        this.verTablero=true;
        //POST->Usuario
      }else{
        this.verTablero=false;
      }
      console.log("Sucribe:"+isSuscribe);
      console.log("LocalStorage:"+localStorage.getItem('token'));
    })

  }

  logOut(){
    this.dataService.logOut();
  }

//Si token es null o indefined

}
