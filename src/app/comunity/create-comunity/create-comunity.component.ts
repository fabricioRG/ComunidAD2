import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Comunity } from 'src/app/models/comunity.model';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-create-comunity',
  templateUrl: './create-comunity.component.html',
  styleUrls: ['./create-comunity.component.css']
})
export class CreateComunityComponent implements OnInit {

  //https://www.youtube.com/watch?v=wid1eH5vUFI

  comunityForm: FormGroup;
  datosCorrectos: boolean;
  token : any;
  courses : any;

  //Fotos
   fileList: FileList | null;
   comunity : Comunity;

  constructor(private dataService : DataService,private router:Router,private uploadFileService : UploadFileServiceService) { 
    this.comunityForm=this.createFormGroup();
    //this.token = localStorage.getItem('token');
    //this.token = JSON.parse(this.token).token;
    this.token = localStorage.getItem('token');
    if(this.token!=null){
      this.token = JSON.parse(this.token).token
      }
    this.buscarCursos();
  }

  pruebaRuta(){
    console.log("PRUEBA RUTAA");
    if(!this.dataService.getLoggedIn()){//Si no hay session que redirija
      this.router.navigate(['inicio']);
      return false;
    }
      return true;
    
  }

  ngOnInit(): void {
    //this.buscarCursos();
  }

  buscarCursos():void{
    if(this.dataService.getLoggedIn()){
      console.log("SESION INICIADA EN BUSCAR CURSOS");
      //Tipo de usuario
      var aux = new User();
      aux.token = this.token;
      console.log(aux.token)
      this.dataService.getCourses(aux).subscribe(
        (courses) => {
          console.log(courses)
          this.courses=courses;
          //alert(user);
        },
        (error) => {
          //alert('ERROR: ' + error);
          console.log(error);
          
        }
      );


    }else{
      console.log("NO HAY SESION");
    }
  }

  createFormGroup(){
    return new FormGroup({
      nombreDeComunidad : new FormControl('',[Validators.required,Validators.minLength(1),Validators.maxLength(100)]),
      descripcion: new FormControl('',[Validators.required]),
      tipoDeCurso: new FormControl('',[Validators.required]),
      fileImage : new FormControl() 
    })
  }

  onResetForm(){
    this.comunityForm.reset();
}



  guardarComunidad(registroAcademico : any, aux : User){
        //Creamos el JSON 
        var messages= JSON.stringify(
          {
            "user":{"registroAcademico":registroAcademico},
            "course":{"codigoDeCurso":this.comunityForm.value['tipoDeCurso']},
            "nombre" : this.comunityForm.value['nombreDeComunidad'],
            "descripcion":this.comunityForm.value['descripcion']
          });

        var comunity=JSON.parse(messages)
        this.dataService.saveComunity(comunity,aux).subscribe(response =>{
          console.log(response)
          this.guardarImagen()
          alert("Comunidad creada con exito")
          this.comunity=comunity;
          this.onResetForm()
        },(error)=>{
          alert('ERROR: ' + error);
        });
  }

  onSaveForm(){
    console.log("ON SAVE FORM)))))")
          //this.comunityForm.value['tipoDeCurso']="OtraCosaa";

    if(this.comunityForm.valid){
      console.log(this.comunityForm.value);
      //Buscamos el usuario para su ID
      var aux = new User();
      aux.token = this.token;
      console.log(aux.token)
      this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        this.guardarComunidad(user['registroAcademico'],aux)
      },
      (error) => {
        alert('ERROR: ' + error);
        
      }
    );
    }
  }

  createJSON(){
    var messages= JSON.stringify(
          {
            "user":{"registroAcademico":111111111},
            "course":{"codigoDeCurso":"119"},
            "nombre" : "Comunidad LOA GRANDEZA",
            "descripcion":"Aldea la Grandeza descripcion de la comunidad"
          });

      console.log("JSONNNNN:"+messages);
      console.log("JSON PARSE"+JSON.parse(messages).user.registroAcademico);

  }

 /*fileChangeEvent(e : Event): any{
    
  //var l: Array<FileList>=(<HTMLInputElement>e.target).files
  //l[0];
 /* var l=(<HTMLInputElement>e.target).files
  if((<HTMLInputElement>e.target).files){
    (<HTMLInputElement>e.target).files[0];
  }   */

  //console.log(l)

 /* const element = e.currentTarget as HTMLInputElement;
  let reader = new FileReader()

  let fileList: FileList | null = element.files;
  if(fileList){
    console.log("File Upload -> files",fileList[0])
    this.archivos.push(fileList)
    console.log(this.archivos)
  }*/
  //}

  cargarImagen(e : Event){
    const element = e.currentTarget as HTMLInputElement;
    this.fileList = element.files;
  }

  guardarImagen(){
   const data = new FormData()
   if(this.fileList){
    data.append('file', this.fileList[0])
    var selectedFile : File | null= this.fileList.item(0);
    console.log("FORM DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"+data)
     //this.fileName=fileList[0];
     //this.selectedFiles=fileList;
     //console.log(fileList)
     //console.log("File Upload -> files",fileList[0])
     //this.archivos.push(fileList)
     //console.log(this.archivos)
     var aux = new User();
     aux.token = this.token;
    this.uploadFileService.upload(data,aux).subscribe(response=>{
      console.log("RESPUESTA GUARDAR IMAGEN EN SPRING:"+response)
      var com : Comunity =response;
      this.comunity.foto=com.foto;
      console.log("Communidad que se creo:",this.comunity)
      //
      this.dataService.saveComunity(this.comunity,aux).subscribe(response =>{
        console.log(response)
      },(error)=>{
        alert('ERROR: ' + error);
      });
    })
    }

  }



  //Getter and setter

  get nombreDeComunidad(){
    return this.comunityForm.get('nombreDeComunidad');
  }

  get descripcion(){
    return this.comunityForm.get('descripcion');
  }

  get tipoDeCurso(){
    return this.comunityForm.get('tipoDeCurso');
  }

  get fileImage(){
    return this.comunityForm.get('fileImage');
  }


  public setDataService(dataSer: DataService){
    this.dataService  = dataSer;
  }

}
