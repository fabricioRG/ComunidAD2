import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  token: any;

  constructor() {
    this.token = '';
   }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }

}
