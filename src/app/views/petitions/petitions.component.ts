import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user.model';

@Component({
  selector: 'app-petitions',
  templateUrl: './petitions.component.html',
  styleUrls: ['./petitions.component.css']
})

export class PetitionsComponent implements OnInit {

  animalsArray: {
    name: string;
    size: string;
  }[] = [
    { name: "chicken", size: "small" },
    { name: "pig", size: "medium" },
    { name: "cow", size: "large" },
  ];

  displayedColumns: string[] = ['name', 'size'];
  dataSource = this.animalsArray;

  constructor() { }

  ngOnInit(): void {
  }

}
