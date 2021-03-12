import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DecimalPipe} from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http'
import { DataService } from './data.service';

import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table'; 
import {MatCheckboxModule} from '@angular/material/checkbox';

import { ProfileComponent } from './views/profile/profile.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { DashboardUsersComponent } from './views/dashboard-users/dashboard-users.component';
import { HeaderComponent } from './views/header/header.component';
import { InicioComponent } from './views/inicio/inicio.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component'
import { PetitionsComponent } from './views/petitions/petitions.component';
import { LoginComponent } from './sesion/login/login.component';
//Formularios
import {ReactiveFormsModule,FormsModule} from '@angular/forms';
import { CrearUsuarioComponent } from './views/crear-usuario/crear-usuario.component';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core';

import {MatRadioModule} from '@angular/material/radio'; 
import {MatSelectModule} from '@angular/material/select'; 
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { EditProfileComponent } from './views/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ActiveModalComponent } from './components/active-modal/active-modal.component';
import { CreateComunityComponent } from './comunity/create-comunity/create-comunity.component';



const rutas: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio'
  },
  {
    path: 'inicio',
    component: InicioComponent,
    
    
  },{
    path: 'editProfile',
    component: EditProfileComponent}
  ,{
    path: 'crearUsuario',
    component: CrearUsuarioComponent

  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      // {
      //   path: '',
      //   pathMatch: 'prefix',
      //   redirectTo: 'users'
      // },
      {
        path: 'users',
        component: DashboardUsersComponent
      },
      {
        path: 'createComunity',
        component: CreateComunityComponent
      },
      {
        path: 'petitions',
        component: PetitionsComponent
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent
      }
    ]
  },
]

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    DashboardComponent,
    HeaderComponent,
    InicioComponent,
    NavbarComponent,
    NavigationBarComponent,
    PetitionsComponent,
    LoginComponent,
    CrearUsuarioComponent,
    EditProfileComponent,
    ActiveModalComponent,
    ChangePasswordComponent,
    CreateComunityComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterModule.forRoot(rutas, {
      useHash: true
    }),
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    BrowserAnimationsModule,
    NgbModule,
  ],
  exports: [
  ],
  providers: [DataService, DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
