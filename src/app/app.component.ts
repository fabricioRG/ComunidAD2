import { Component } from '@angular/core';
import { DataService } from './data.service';
import { OnInit } from '@angular/core'
import { User } from './user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  users$: User = new User;
  
  constructor(private dataService: DataService) {}

  ngOnInit(){

    // return this.dataService.getUsers()
    // .subscribe(data => this.users$ = data);
  }

  title='myApp';
}
