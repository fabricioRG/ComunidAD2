import {FormControl, FormGroup, Validators} from '@angular/forms'
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private dataService: DataService) { 
    this.loginForm=this.createFormGroup();
  }

  ngOnInit(): void {

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
      this.loginForm.value['password']="OtraCosaa";
      console.log(this.loginForm.value)
      this.dataService.postAuthentication(this.loginForm.value).subscribe(result =>
        console.log(result)
      )
      //console.log("Se inicio sesion");
      //console.log(this.loginForm.value);
      //console.log(this.loginForm.value['password'])
      this.onResetForm();
    }else{
      console.log("No se envio la informacion");
    }
  }

  get registroAcademico(){
    return this.loginForm.get('registroAcademico');
  }

  get password(){
    return this.loginForm.get('password');
  }

  

}
