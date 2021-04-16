import {FormControl, FormGroup, Validators} from '@angular/forms'
import { Component, OnInit, ElementRef } from '@angular/core';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SesionService } from 'src/app/services/sesion/sesion.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  credencialesIncorrectas: boolean;
  sesion$: Observable<boolean>;
  token : any;

    // Password visibility
    hide = true;
    hide2 = true;
  

  constructor(private dataService: DataService,private router:Router,private sesionService: SesionService) { 
    this.loginForm=this.createFormGroup();
    
  }

  ngOnInit(): void {
    this.sesion$=this.sesionService.loggedIn$();
    this.sesion$.subscribe(isSuscribe=>{
    console.log("Sucribe IN LOGIN session service:"+isSuscribe);
    console.log("LocalStorage IN LOGIN session service:"+localStorage.getItem('token'));
    if(isSuscribe){
      this.router.navigate(['inicio']);
    }else{
      this.credencialesIncorrectas=true;
    }
  })
  }


  //Validaciones de formulario
  createFormGroup(){
    return new FormGroup({
      registroAcademico : new FormControl('',[Validators.required,Validators.minLength(9),Validators.maxLength(9)]),
      password: new FormControl('',[Validators.required]) 
    })
  }

  //Limpiar el formulario
  onResetForm(){
      this.loginForm.reset();
  }

  //Guardar los valores del formulario
  onSaveForm(){
    if(this.loginForm.valid){
      //this.loginForm.value['password']="OtraCosaa";
      console.log(this.loginForm.value)
      this.sesionService.logIn(this.loginForm.value);
      //Ya revisa el observable
    }else{
      console.log("No se envio la informacion");
    }
  }

 /* get registroAcademico(){
    return this.loginForm.get('registroAcademico');
  }

  get password(){
    return this.loginForm.get('password');
  }*/

  get f(){
    return this.loginForm.controls;
  }
  

}
