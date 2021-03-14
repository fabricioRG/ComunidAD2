import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { Comunity } from 'src/app/models/comunity.model';
import { Course } from 'src/app/models/course.model';
import { UploadFileServiceService } from 'src/app/services/uploadFileService/upload-file-service.service';
import { User } from 'src/app/user.model';
import { DataService } from '../../data.service';
import { ActiveModalComponent } from '../../components/active-modal/active-modal.component'

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

  constructor(private dataService : DataService,private router:Router,private uploadFileService : UploadFileServiceService,
    private formBuilder: FormBuilder,private _modalService: NgbModal) { 
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
      nombreDeComunidad : new FormControl('',[Validators.required,Validators.minLength(1),Validators.maxLength(50)]),
      descripcion: new FormControl('',[Validators.required,Validators.minLength(1),Validators.maxLength(100)]),
      tipoDeCurso: new FormControl('',[Validators.required]),
      fileImage : new FormControl('') 
    })

  }

  onResetForm(){
    this.comunityForm.reset();
}

  generarComunidad(registroAcademico : any) : Comunity{
    var user : User= new User;
    var course : Course = new Course;
    var comunity : Comunity = new Comunity;
    comunity.user=user;
    comunity.course=course;
    user.registroAcademico=registroAcademico;
    course.codigoDeCurso=this.comunityForm.value['tipoDeCurso'];
    comunity.nombre= this.comunityForm.value['nombreDeComunidad'];
    comunity.descripcion = this.comunityForm.value['descripcion'];
    this.comunity=comunity;
    return comunity;
  }

  llamarModal(){
    const modal = this._modalService.open(ActiveModalComponent);

    modal.componentInstance.modalHeader = 'Proceso exitoso';
    modal.componentInstance.modalBodyTitle = 'Comunidad guardada';
    modal.componentInstance.modalBody = 'Tu comunidad se ha guardado con exito';
    modal.componentInstance.infoModal = true;

    modal.result.then((result) => {
      console.log("Result: ", result);
    }, (reason) => {
      console.log("Reason: ", reason);
    });

  }

  //Guarda una comunidad en la base de datos(usa la variable global comunity)
  guardarComunidad( aux : User){
        //Creamos el JSON
        this.dataService.saveComunity(this.comunity,aux).subscribe(response =>{
          var com :Comunity;response; 
          console.log("ESTO ES EN GUARDAR COMUNIDAD:",response)
          this.llamarModal()
          this.comunity=response;
          this.onResetForm()
        },(error)=>{
          alert('ERROR: ' + error);
        });
  }

  //Accion al hacer click en guardar comunidad(Sevalida si el formulario es valido)
  onSaveForm(){
    console.log("ON SAVE FORM)))))")
    if(this.comunityForm.valid){
      console.log(this.comunityForm.value);
      //Buscamos el usuario para su ID
      var aux = new User();
      aux.token = this.token;
      console.log(aux.token)
      this.dataService.getUserByToken(aux).subscribe(
      (user) => {
        var u : User=user;
        this.generarComunidad(user.registroAcademico)
        if(this.fileList){//Si selecciono una imagen
          this.guardarImagenYComunidad()
        }else{
          this.guardarComunidad(aux)
        }
      },
      (error) => {
        alert('ERROR: ' + error);
      }
    );
    }
  }

  //Evento el cual es lanzado al buscar una imagen en el input fyle
  cargarImagen(e : Event){
    const element = e.currentTarget as HTMLInputElement;
    this.fileList = element.files;
  }

  //Sube la imagen(regresa una comunidad con el path de la foto), y guarda la comunidad ya con la foto
  guardarImagenYComunidad(){
   const data = new FormData()
   if(this.fileList){
    data.append('file', this.fileList[0])
    var selectedFile : File | null= this.fileList.item(0);
     var aux = new User();
     aux.token = this.token;
    this.uploadFileService.upload(data,aux).subscribe(response=>{
      console.log("RESPUESTA GUARDAR IMAGEN EN SPRING:"+response)
      var com : Comunity =response;
      this.comunity.foto=com.foto;
      console.log("Communidad que se creo:",this.comunity)
      this.guardarComunidad(aux)
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

  get f(){
    return this.comunityForm.controls;
  }

}
